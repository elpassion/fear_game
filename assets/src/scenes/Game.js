import Phaser from 'phaser'
import { gameChannel, socket} from '../client';
import Player from '../sprites/Player';
import makeAnimations from '../utils/animations';

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'Game' });

    this.players = {};

    gameChannel.on('self_joined', (player) => {
      this.addMainPlayer(player);
    });
  }

  create () {
    socket.connect();

    gameChannel.push('get_map')
      .receive("ok", (level) => {
        this.generateMap(level.data);
      } );

    // TODO MOVE SOCKETS
    // setTimeout(() => {
    //   gameChannel.push('move', { dir: 'n' });
    // }, 3000);
    gameChannel.on('move', (data) => {
      data.move_time && this.animateMove(data);
    });


    // TODO new other player
    // gameChannel.on('connected', () => {
    //   this.players = new Player
    // });

    makeAnimations(this);

    this.addBackground();
  }

  update () {
    this.updateBackground();
    this.player && this.player.update();
    this.anims.play(this.animation, true);
  }

  addBackground() {
    let width = this.sys.game.config.width * 4; // TODO: Why do we have to multiply those values by 2? :/
    let height = this.sys.game.config.height * 4;
    const startXPoint = width / 2;
    const startYPoint = height / 2;

    this.backgrounds = [
      this.add.tileSprite(this.sys.game.config.width, this.sys.game.config.height, width, height, 'background-stars-nebula').setAlpha(0.5),
      this.add.tileSprite(this.sys.game.config.width, this.sys.game.config.height, width, height, 'background-stars-small').setAlpha(0.25),
      this.add.tileSprite(this.sys.game.config.width, this.sys.game.config.height, width, height, 'background-stars-small').setAlpha(0.5),
      this.add.tileSprite(this.sys.game.config.width, this.sys.game.config.height, width, height, 'background-stars-large').setAlpha(0.25),
      this.add.tileSprite(this.sys.game.config.width, this.sys.game.config.height, width, height, 'background-stars-large').setAlpha(0.5)
    ];

    this.backgrounds.forEach((background) => {
      background.tilePositionX = Math.random() * background.width;
      background.tilePositionY = Math.random() * background.height;
    });
  }

  generateMap(levelData) {
    console.log(levelData);
    const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });
    const tiles = map.addTilesetImage('mario-tiles');
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
    console.log(data);
    this.player = new Player({
      scene: this,
      x: data.x * 16,
      y: data.y * 16,
      key: 'player',
    });

    this.players[data.name] = this.player;
    this.cameras.main.startFollow(this.player);
  }

  updateBackground() {
    this.backgrounds.forEach((background, index) => { background.tilePositionX -= 0.15 * (index + 1) });
  }


  animateMove(data) {
    const movingPlayer = this.player;
    // const movingPlayer = this.players[data.name];
    let direction = '';

    if(movingPlayer.y / 16 === data.y) {
      if(movingPlayer.x / 16 < data.x) {
        direction = 'e';
      } else {
        direction = 'w';
      }
    } else {
      if(movingPlayer.y / 16 < data.y) {
        direction = 's';
      } else {
        direction = 'n';
      }
    }

    const tween = this.tweens.add({
      targets: this.player,
      x: data.x * 16,
      y: data.y * 16,
      duration: data.move_time,
      ease: 'Linear',
      onStart: () => {
        if(direction === 'n') this.player.animation = 'up';
        if(direction === 's') this.player.animation = 'down';
        if(direction === 'e') this.player.animation = 'right';
        if(direction === 'w') this.player.animation = 'left';
        // if(direction === 'n') this.players[data.name].animation = 'up';
        // if(direction === 's') this.players[data.name].animation = 'down';
        // if(direction === 'e') this.players[data.name].animation = 'right';
        // if(direction === 'w') this.players[data.name].animation = 'left';
      },
      onComplete: () => {
        this.player.animation = 'stand';
      }
    });
  }

}
