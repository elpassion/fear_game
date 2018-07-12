import Phaser from 'phaser'
import client from '../client';
import Player from '../sprites/Player';
import makeAnimations from '../utils/animations';

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'Game' })
  }

  create () {

    this.player = new Player({
      scene: this,
      x: 0,
      y: 0,
      key: 'player',
    });
    client.push('get_map')
      .receive("ok", (level) => {
        this.generateMap(level.data);
      } );
    makeAnimations(this);

    this.addBackground();
  }

  update () {
    this.updateBackground();
    this.player.update();
    this.anims.play(this.animation, true);
  }

  addBackground() {
    let width = this.sys.game.config.width * 2; // TODO: Why do we have to multiply those values by 2? :/
    let height = this.sys.game.config.height * 2;

    this.backgrounds = [
      this.add.tileSprite(0, 0, width, height, 'background-stars-nebula'),
      this.add.tileSprite(0, 0, width, height, 'background-stars-small').setAlpha(0.25),
      this.add.tileSprite(128, 128, width, height, 'background-stars-small').setAlpha(0.5),
      this.add.tileSprite(0, 0, width, height, 'background-stars-large').setAlpha(0.5),
      this.add.tileSprite(128, 128, width, height, 'background-stars-large').setAlpha(0.75)
    ]
  }

  generateMap(levelData) {
    const map = this.make.tilemap({ data: levelData, tileWidth: 16, tileHeight: 16 });
    const tiles = map.addTilesetImage('mario-tiles');
    const layer = map.createStaticLayer(0, tiles, 0, 0);
  }

  updateBackground() {
    this.backgrounds.forEach((background, index) => { background.tilePositionX -= 0.15 * (index + 1) });
  }

}
