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

    gameChannel.on('user_joined', (data) => {
      console.log('user joined');
      this.addPlayer(data);
    });

    makeAnimations(this);

    this.addBackground();
  }

  update () {
    this.updateBackground();
    this.player && this.player.update();
    // Object.keys(this.players).map( key => {
    //   this.players[key].update();
    // });
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

  addPlayer(data) {
    this.players[data.name] = new Player({
      scene: this,
      x: data.x * 16,
      y: data.y * 16,
      key: 'player',
    });
  }

  updateBackground() {
    this.backgrounds.forEach((background, index) => { background.tilePositionX -= 0.15 * (index + 1) });
  }


  animateMove(data) {
    console.log('move', data);
    const movingPlayer = this.players[data.name];
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

    let movement = {};

    if(direction === 'n') movement = { start: 'up', complete: 'upStanding' };
    if(direction === 's') movement = { start: 'down', complete: 'downStanding' };
    if(direction === 'e') movement = { start: 'right', complete: 'rightStanding' };
    if(direction === 'w') movement = { start: 'left', complete: 'leftStanding' };

    const tween = this.tweens.add({
      targets: this.players[data.name],
      x: data.x * 16,
      y: data.y * 16,
      duration: data.move_time,
      ease: 'Linear',
      onStart: () => {
        this.players[data.name].animation = movement.start;
        this.players[data.name].update();
      },
      onComplete: () => {
        this.players[data.name].animation = movement.complete;
        this.players[data.name].update();
      }
    });
  }

}
