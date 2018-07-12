import Phaser from 'phaser'
import { Boot, Game } from 'scenes'
import client from './client';

const config = {
  type: Phaser.AUTO,
  parent: 'fear-game',
  width: 800,
  height: 600,
  physics: {
  default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: [
    Boot,
    Game
  ]
}

const game = new Phaser.Game(config) // eslint-disable-line no-unused-vars
