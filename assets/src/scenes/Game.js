import Phaser from 'phaser'
import { Logo } from '../images'
import { Mushroom } from '../sprites'
import client from '../client';

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'Game' })

    this.levelData;
  }

  create () {
    client.push('get_map')
      .receive("ok", (level) => {
        this.levelData = level.data;

        const map = this.make.tilemap({ data: this.levelData, tileWidth: 16, tileHeight: 16 });
        const tiles = map.addTilesetImage('mario-tiles');
        const layer = map.createStaticLayer(0, tiles, 0, 0);
      } );

      this.cameras.main.zoom = 0.5;
  }

  update () {

  }
}
