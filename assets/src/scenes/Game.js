import Phaser from 'phaser';
import { gameChannel, socket } from '../client';
import Player from '../sprites/Player';
import makeAnimations from '../utils/animations';

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' });
  }

  create() {
    this.music = this.sound.add('music');
    if (this.music.audioBuffer) this.music.play();

    this.playersGroup = this.physics.add.group({
      classType: Player,
    });
    this.otherPlayers = this.physics.add.group({
      classType: Player,
    });


    socket.connect();

    gameChannel.push('get_map')
      .receive('ok', (level) => {
        this.generateMap(level.data);
      });

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

    gameChannel.on('fly', (data) => {
      this.animateMove(data, false, true);
    });

    gameChannel.on('fly_lose', (data) => {
      this.animateMove(data, true, true);
    });

    gameChannel.on('fire', (data) => {
      data.username && this.player.name !== data.username && this.getPlayerFromGroup(data.username).fireCat(true);
    });

    gameChannel.on('destroy_field', (point) => {
      if (this.layer && this.layer.layer) {
        this.layer.layer.data[point.y][point.x].index = -1;
        const data = this.getLevelData();
        this.generateMap(data);
      }
    });

    makeAnimations(this);

    this.addBackground();
  }

  update() {
    this.renderBackground();
    this.player && this.player.update();
    this.anims.play(this.animation, true);
  }

  addBackground() {
    const gameWidth = this.sys.game.config.width;
    const gameHeight = this.sys.game.config.height;
    const x = gameWidth / 2;
    const y = gameHeight / 2;

    this.backgrounds = [
      this.add.tileSprite(x, y, gameWidth, gameHeight, 'background-stars-nebula').setAlpha(0.5).setScrollFactor(0),
      this.add.tileSprite(x, y, gameWidth, gameHeight, 'background-stars-small').setAlpha(0.25).setScrollFactor(0),
      this.add.tileSprite(x, y, gameWidth, gameHeight, 'background-stars-small').setAlpha(0.5).setScrollFactor(0),
      this.add.tileSprite(x, y, gameWidth, gameHeight, 'background-stars-large').setAlpha(0.25).setScrollFactor(0),
      this.add.tileSprite(x, y, gameWidth, gameHeight, 'background-stars-large').setAlpha(0.5).setScrollFactor(0),
    ];

    this.backgrounds.forEach((background) => {
      background.tilePositionX = Math.random() * background.width;
      background.tilePositionY = Math.random() * background.height;
    });
  }

  getLevelData() {
    const data = new Array(this.layer.layer.data.length);
    for (let row = 0; row < this.layer.layer.data.length; row++) {
      data[row] = new Array(this.layer.layer.data[row].length);
      for (let col = 0; col < this.layer.layer.data[row].length; col++) {
        if (this.layer.layer.data[row][col].index >= 37) {
          data[row][col] = -1;
        } else {
          data[row][col] = this.layer.layer.data[row][col].index;
        }
      }
    }
    return data;
  }

  generateMap(levelData) {
    for (let row = 1; row < levelData.length - 1; row++) {
      for (let col = 1; col < levelData.length - 1; col++) {
        if (levelData[row][col] !== -1 && levelData[row][col] < 37) {
          const up = levelData[row - 1][col];
          const down = levelData[row + 1][col];
          const left = levelData[row][col - 1];
          const right = levelData[row][col + 1];

          if ((up < 0 || up >= 37) && left >= 0 && left < 37 && right >= 0 && right < 37 && down >= 0 && down < 37) {
            levelData[row][col] = Phaser.Math.Between(6, 8); // krawedz na gorze
          } else if (up >= 0 && up < 37 && left >= 0 && left < 37 && right >= 0 && right < 37 && down < 0) {
            levelData[row][col] = Phaser.Math.Between(21, 23); // krawedz na dole
            levelData[row + 1][col] = Phaser.Math.Between(40, 42);
          } else if (up >= 0 && up < 37 && (left < 0 || left >= 37) && right >= 0 && right < 37 && down >= 0 && down < 37) {
            levelData[row][col] = Phaser.Math.Between(15, 17); // krawedz lewa
          } else if (up >= 0 && up < 37 && left >= 0 && left < 37 && (right < 0 || right >= 37) && down >= 0 && down < 37) {
            levelData[row][col] = Phaser.Math.Between(18, 20); // krawedz prawa
          } else if ((up < 0 || up >= 37) && left >= 0 && left < 37 && (right < 0 || right >= 37) && down >= 0 && down < 37) {
            levelData[row][col] = Phaser.Math.Between(12, 14); // krawedz prawa & gora
          } else if (up >= 0 && up < 37 && left >= 0 && left < 37 && (right < 0 || right >= 37) && (down < 0 || down >= 37)) {
            levelData[row][col] = Phaser.Math.Between(26, 28); // krawedz prawa & dół
            levelData[row + 1][col] = 37;
          } else if ((up < 0 || up >= 37) && (left < 0 || left >= 37) && right >= 0 && right < 37 && down >= 0 && down < 37) {
            levelData[row][col] = Phaser.Math.Between(9, 11); // krawedz lewa & gora
          } else if (up >= 0 && up < 37 && (left < 0 || left >= 37) && right >= 0 && right < 37 && (down < 0 || down >= 37)) {
            levelData[row][col] = Phaser.Math.Between(29, 31); // krawedz lewa & dół
            levelData[row + 1][col] = 38; // krawedz lewa & dół
          } else if (up >= 0 && up < 37 && (left < 0 || left >= 37) && (right < 0 || right >= 37) && down >= 0 && down < 37) {
            levelData[row][col] = 24; // krawedz prawa & lewa
          } else if ((up < 0 || up >= 37) && left >= 0 && left < 37 && right >= 0 && right < 37 && (down < 0 || down >= 37)) {
            levelData[row][col] = 25; // krawedz gora & dol
            levelData[row + 1][col] = Phaser.Math.Between(40, 42); // krawedz gora & dol
          } else if (up >= 0 && up < 37 && (left < 0 || left >= 37) && (right < 0 || right >= 37) && (down < 0 || down >= 37)) {
            levelData[row][col] = 35; // cypel dolny
            levelData[row + 1][col] = 39;
          } else if ((up < 0 || up >= 37) && (left < 0 || left >= 37) && (right < 0 || right >= 37) && down >= 0 && down < 37) {
            levelData[row][col] = 32; // cypel gorny
          } else if ((up < 0 || up >= 37) && (left < 0 || left >= 37) && right >= 0 && right < 37 && (down < 0 || down >= 37)) {
            levelData[row][col] = 33; // cypel lewy
            levelData[row + 1][col] = 38;
          } else if ((up < 0 || up >= 37) && left >= 0 && left < 37 && (right < 0 || right >= 37) && (down < 0 || down >= 37)) {
            levelData[row][col] = 34; // cypel prawy
            levelData[row + 1][col] = 37;
          } else if ((up < 0 || up >= 37) && (left < 0 || left >= 37) && (right < 0 || right >= 37) && (down < 0 || down >= 37)) {
            levelData[row][col] = 36; // wyspa
            levelData[row + 1][col] = 39;
          } else {
            levelData[row][col] = (col * row) % 6; // Phaser.Math.Between(0, 5);      // czysty kafel
          }
        }
      }
    }

    if (this.layer) this.layer.destroy();

    const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });
    const tiles = map.addTilesetImage('map');
    this.layer = map.createDynamicLayer(0, tiles, 0, 0);

    // const tile = this.layer.layer.data[0];
  }

  addMainPlayer(data) {
    this.player = this.createPlayer(data);

    this.physics.add.collider(
      this.player.catBullets,
      this.otherPlayers,
      (cat, player) => {
        cat.hit();

        const hitData = {
          dir: '',
          username: player.name,
        };

        if (cat.angle === 0) hitData.dir = 'n';
        if (cat.angle === -90) hitData.dir = 'w';
        if (cat.angle === -180) hitData.dir = 's';
        if (cat.angle === 90) hitData.dir = 'e';

        gameChannel.push('hit', hitData);
      },
      null,
      this,
    );

    this.playersGroup.add(this.player);
    this.cameras.main.startFollow(this.player);
  }

  createPlayer(data) {
    return new Player({
      scene: this,
      x: data.x * 16,
      y: data.y * 16,
      key: 'player',
      name: data.name,
    }).setTint(this.colorFromString(data.name, 0.5));
  }

  addPlayer(data) {
    const player = this.createPlayer(data);

    this.playersGroup.add(player);
    this.otherPlayers.add(player);
  }

  renderBackground() {
    this.backgrounds.forEach((background, index) => { background.tilePositionY -= 0.25 * (index + 1); });
  }

  getPlayerFromGroup(name) {
    return this.playersGroup.getChildren().find(player => player.name === name);
  }

  animateMove(data, lost = false, push = false) {
    const movingPlayer = this.getPlayerFromGroup(data.name);

    if (this.player.name === data.name) {
      this.player.move_time = data.move_time;
    }

    let direction = '';

    const playerX = Math.round(movingPlayer.x / 16);
    const playerY = Math.round(movingPlayer.y / 16);

    if (playerY === data.y) {
      if (playerX < data.x) {
        direction = 'e';
      } else if (playerX > data.x) {
        direction = 'w';
      } else if (lost) {
        movingPlayer.animation = 'death';
        movingPlayer.playAnimation();
        movingPlayer.die();
        this.playersGroup.remove(movingPlayer);
        this.otherPlayers.remove(movingPlayer);
        return;
      } else {
        direction = 'w';
      }
    } else if (playerY < data.y) {
      direction = 's';
    } else if (playerY > data.y) {
      direction = 'n';
    } else if (lost) {
      movingPlayer.animation = 'death';
      movingPlayer.playAnimation();
      movingPlayer.die();
      this.playersGroup.remove(movingPlayer);
      this.otherPlayers.remove(movingPlayer);
      return;
    } else {
      direction = 'n';
    }

    let movement = {};

    if (direction === 'n') movement = { start: 'up', complete: 'upStanding', angle: 270 };
    if (direction === 's') movement = { start: 'down', complete: 'downStanding', angle: 90 };
    if (direction === 'e') movement = { start: 'right', complete: 'rightStanding', angle: 0 };
    if (direction === 'w') movement = { start: 'left', complete: 'leftStanding', angle: 180 };

    this.tweens.add({
      targets: movingPlayer,
      x: data.x * 16,
      y: data.y * 16,
      duration: data.move_time,
      ease: 'Linear',
      onStart: () => {
        if (!push) {
          movingPlayer.lastMove = Date.now();
          movingPlayer.firingAngle = movement.angle;
          movingPlayer.direction = direction;
          movingPlayer.animation = movement.start;
          movingPlayer.playAnimation();
        }
      },
      onComplete: () => {
        if (lost) {
          movingPlayer.animation = 'death';
        } else if (!push && Date.now() - movingPlayer.lastMove > 50) {
          movingPlayer.animation = movement.complete;
        }

        movingPlayer.playAnimation();

        if (lost) {
          movingPlayer.die();
          this.playersGroup.remove(movingPlayer);
          this.otherPlayers.remove(movingPlayer);
        }
      },
    });
  }

  colorFromString(string, saturation = 1.0) {
    const hsv = Phaser.Display.Color.HSVColorWheel(saturation);

    return hsv[Math.abs(this.hashCode(string, 360))].color;
  }

  hashCode(string, tableSize) {
    let hash = 0; const len = string.length; let i; let
      c;

    if (len === 0) return hash;

    for (i = 0; i < len; i++) {
      c = string.charCodeAt(i);
      hash = ((hash << 5) - hash) + c; // eslint-disable-line
      // Convert to 32bit integer
      hash &= hash; // eslint-disable-line
    }

    return tableSize ? hash % tableSize : hash;
  }
}
