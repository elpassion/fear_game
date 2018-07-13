import Phaser from 'phaser'
import { gameChannel, socket} from '../client';
import Player from '../sprites/Player';
import makeAnimations from '../utils/animations';

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'Game' });
  }

  create () {
    this.playersGroup = this.physics.add.group({
      classType: Player,
    });
    this.otherPlayers = this.physics.add.group({
      classType: Player,
    });

    socket.connect();

    gameChannel.push('get_map')
      .receive("ok", (level) => {
        this.generateMap(level.data);
      } );

    gameChannel.on('move', (data) => {
      data.move_time && this.animateMove(data);
    });
    gameChannel.on('lose', (data) => {
      this.animateMove(data, true);
    });

    gameChannel.on('user_joined', (data) => {
      this.addPlayer(data);
    });

    gameChannel.on('self_joined', (player) => {
      this.addMainPlayer(player);
    });

    gameChannel.on('destroy_field', (point) => {
      if (this.layer && this.layer.layer) {
        this.layer.layer.data[point.y][point.x] = -1;
      }
    });

    makeAnimations(this);

    this.addBackground();
  }

  update () {
    this.renderBackground();
    this.player && this.player.update();
    this.anims.play(this.animation, true);
  }

  addBackground() {
    const gameWidth  = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;
    const x          = gameWidth / 2;
    const y          = gameHeight / 2;

    this.backgrounds = [
      this.add.tileSprite(x, y, gameWidth, gameHeight, 'background-stars-nebula').setAlpha(0.5).setScrollFactor(0),
      this.add.tileSprite(x, y, gameWidth, gameHeight, 'background-stars-small').setAlpha(0.25).setScrollFactor(0),
      this.add.tileSprite(x, y, gameWidth, gameHeight, 'background-stars-small').setAlpha(0.5).setScrollFactor(0),
      this.add.tileSprite(x, y, gameWidth, gameHeight, 'background-stars-large').setAlpha(0.25).setScrollFactor(0),
      this.add.tileSprite(x, y, gameWidth, gameHeight, 'background-stars-large').setAlpha(0.5).setScrollFactor(0)
    ];

    this.backgrounds.forEach((background) => {
      background.tilePositionX = Math.random() * background.width;
      background.tilePositionY = Math.random() * background.height;
    });
  }

  generateMap(levelData) {
    // levelData[5][0] = 3;
    // levelData.forEach((tiles, row)=>{
    //   tiles.forEach( (tile, column)=>{
    //     if(levelData[row][column]!==-1) {
    //       if( levelData[row-1][column]<0 ) {
    //         levelData[row][column] = Phaser.Math.Between(6, 8);
    //       } else if ( levelData[row+1][column]<0 ) {
    //         levelData[row][column] = Phaser.Math.Between(21, 23);
    //       } else if ( levelData[row][column+1]<0 ) {
    //         levelData[row][column] = Phaser.Math.Between(18, 20);
    //       } else {
    //         levelData[row][column] = Phaser.Math.Between(0, 5);
    //       }
    //     }
    //   })
    // })

    console.log('levelData', levelData);
    const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });
    const tiles = map.addTilesetImage('map');
    this.layer = map.createDynamicLayer(0, tiles, 0, 0);

    const tile = this.layer.layer.data[0];

    // TODO REMOVING TILES
    // 'removing' tiles
    // for(let i = 0; i < tile.length; i++) {
    //   console.log(tile);
    //   setTimeout(() => {
    //     tile[i].index = -1;
    //   }, 1000 * i);
    // }
  }

  addMainPlayer(data) {
    this.player = this._createPlayer(data);

    this.physics.add.collider(
      this.player.catBullets,
      this.otherPlayers,
      (cat, player) => {
        console.log(cat);
        console.log(player);
        cat.hit();
        // player.destroy();
      },
      null,
      this,
    );

    this.playersGroup.add(this.player);
    // this.player = this.addPlayer(data);
    console.log(this.player);
    this.cameras.main.startFollow(this.player);
  }

  _createPlayer(data) {
    return new Player({
      scene: this,
      x: data.x * 16,
      y: data.y * 16,
      key: 'player',
      name: data.name
    }).setTint(this.colorFromString(data.name, 0.5));
  }

  addPlayer(data) {
    const player = this._createPlayer(data);

    this.playersGroup.add(player);
    this.otherPlayers.add(player);
  }

  renderBackground() {
    this.backgrounds.forEach((background, index) => { background.tilePositionY -= 0.25 * (index + 1) });
  }

  getPlayerFromGroup(name) {
    return this.playersGroup.getChildren().find( player => {
      return player.name === name;
    })
  }

  animateMove(data, lost = null) {
    const movingPlayer = this.getPlayerFromGroup(data.name);
    let direction = '';

    if(movingPlayer.y / 16 === data.y) {
      if(movingPlayer.x / 16 < data.x) {
        direction = 'e';
      } else if(movingPlayer.x / 16 > data.x) {
        direction = 'w';
      } else if (lost) {
        movingPlayer.animation = 'death';
        movingPlayer.playAnimation();
        movingPlayer.die();
        delete this.players[data.name];
        return;
      } else {
        direction = 'w';
      }
    } else {
      if(movingPlayer.y / 16 < data.y) {
        direction = 's';
      } else if(movingPlayer.y / 16 > data.y) {
        direction = 'n';
      } else if (lost) {
        movingPlayer.animation = 'death';
        movingPlayer.playAnimation();
        movingPlayer.die();
        delete this.players[data.name];
        return;
      } else {
        direction = 'n';
      }
    }

    let movement = {};

    if(direction === 'n') movement = { start: 'up', complete: 'upStanding', angle: 270 };
    if(direction === 's') movement = { start: 'down', complete: 'downStanding', angle: 90 };
    if(direction === 'e') movement = { start: 'right', complete: 'rightStanding', angle: 0 };
    if(direction === 'w') movement = { start: 'left', complete: 'leftStanding', angle: 180 };

    const tween = this.tweens.add({
      targets: movingPlayer,
      x: data.x * 16,
      y: data.y * 16,
      duration: data.move_time,
      ease: 'Linear',
      onStart: () => {
        movingPlayer.firingAngle = movement.angle;
        movingPlayer.animation = movement.start;
        movingPlayer.playAnimation();
      },
      onComplete: () => {
        if (lost) {
          movingPlayer.animation = 'death';
        } else {
          movingPlayer.animation = movement.complete;
        }

        movingPlayer.playAnimation();

        if (lost) {
          movingPlayer.die();
          this.playersGroup.remove(movingPlayer);
        }
      }
    });
  }

  colorFromString(string, saturation = 1.0) {
    const hsv = Phaser.Display.Color.HSVColorWheel(saturation);

    return hsv[Math.abs(this.hashCode(string, 360))].color;
  }

  hashCode(string, tableSize) {
    var hash = 0, len = string.length, i, c;

    if (len == 0) return hash;

    for (i = 0; i < len; i++) {
      c = string.charCodeAt(i);
      hash = ((hash<<5) - hash) + c;
      hash &= hash; // Convert to 32bit integer
    }

    return tableSize ? hash % tableSize : hash;
  }

}
