import Phaser from 'phaser'
import { Boot, Game } from 'scenes'

const config = {
  type: Phaser.AUTO,
  parent: 'fear-game',
  width: 272,
  height: 272,
  pixelArt: true,
  zoom: 1.5,
  antialias: false,
  physics: {
    default: 'arcade',
      arcade: {
        // debug: true,
      },
  },
  scene: [
    Boot,
    Game
  ]
}

const game = new Phaser.Game(config) // eslint-disable-line no-unused-vars
