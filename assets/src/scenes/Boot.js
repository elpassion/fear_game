import Phaser from 'phaser'
import marioTiles from '../../assets/images/super-mario.png';
import backgroundStarsNebula from '../../assets/images/background/stars-nebula.jpg'
import backgroundStarsSmall from '../../assets/images/background/stars-small.png'
import backgroundStarsLarge from '../../assets/images/background/stars-large.png'

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

    this.load.image('background-stars-nebula', backgroundStarsNebula);
		this.load.image('background-stars-small', backgroundStarsSmall);
    this.load.image('background-stars-large', backgroundStarsLarge);
    
    this.load.image('mario-tiles', marioTiles);
  }

  create () {
    this.scene.start('Game')
  }
}
