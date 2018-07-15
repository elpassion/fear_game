import Phaser from 'phaser';
import player from '../../assets/sprites/player.png';
import catBullet from '../../assets/sprites/cat_missle2.png';
import catFart from '../../assets/sprites/cats_farts.png';
import bang from '../../assets/sprites/bang.png';
import map from '../../assets/sprites/map.png';
import backgroundStarsNebula from '../../assets/images/background/stars-nebula.jpg';
import backgroundStarsSmall from '../../assets/images/background/stars-small.png';
import backgroundStarsLarge from '../../assets/images/background/stars-large.png';
import miau1 from '../../assets/sounds/miau1.mp3';
import miau2 from '../../assets/sounds/miau2.mp3';
import miau3 from '../../assets/sounds/miau3.mp3';
import miau4 from '../../assets/sounds/miau4.mp3';
import music from '../../assets/sounds/music.mp3';

export default class extends Phaser.Scene {
  constructor() {
    super({ key: 'Boot' });
  }

  preload() {
    const progress = this.add.graphics();

    // PROGRESS OF LOADING FILES
    this.load.on('fileprogress', (file, value) => {
      progress.clear();
      progress.fillStyle(0xffffff, 0.75);
      progress.fillRect(700 - (value * 600), 250, value * 600, 100);
    });

    // BACKGROUND
    this.load.image('background-stars-nebula', backgroundStarsNebula);
    this.load.image('background-stars-small', backgroundStarsSmall);
    this.load.image('background-stars-large', backgroundStarsLarge);

    // SPRITES
    this.load.spritesheet('player', player, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('catBullet', catBullet, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('catFart', catFart, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('bang', bang, { frameWidth: 16, frameHeight: 16 });
    this.load.spritesheet('map', map, { frameWidth: 16, frameHeight: 16 });

    // AURIO
    this.load.audio('miau1', miau1);
    this.load.audio('miau2', miau2);
    this.load.audio('miau3', miau3);
    this.load.audio('miau4', miau4);
    this.load.audio('music', music);
  }

  create() {
    this.scene.start('Game');
  }
}
