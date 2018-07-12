import Phaser from 'phaser'
import marioTiles from '../../assets/images/super-mario.png';

export default class extends Phaser.Scene {
  constructor () {
    super({ key: 'Boot' })
  }

  preload () {
    const progress = this.add.graphics()

    this.load.on('fileprogress', (file, value) => {
      progress.clear()
      progress.fillStyle(0xffffff, 0.75)
      progress.fillRect(700 - (value * 600), 250, value * 600, 100)
    })

    this.load.image('mario-tiles', marioTiles);
  }

  create () {
    this.scene.start('Game')
  }
}
