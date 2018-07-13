import Keyboard from '../utils/keyboard';
import { CatBullet } from '../sprites';
import { gameChannel } from '../client';

class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);

    this.shootSounds = [
      this.scene.sound.add('miau1', { loop: false }),
      this.scene.sound.add('miau2', { loop: false }),
      this.scene.sound.add('miau3', { loop: false })
    ];

    this.scene = config.scene;
    this.name = config.name;
    this.setOrigin(0.0);
    config.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(1);

    this.controls = new Keyboard(this, this.scene);
    this.animation = 'downStanding';
    this.firingAngle = 270;
    this.alive = true;
    this.catBullets = [];
    this.body.immovable = true;
    this.body.moves = false;
    this.direction = '';
    this.on('animationcomplete', this.animComplete, this);
    this.create();
  }

  create() {
    this.catBullets = this.scene.physics.add.group({
      classType: CatBullet,
      maxSize: 10,
    });
  }

  fireCat() {
    this.shootSounds[Math.floor(Math.random() * this.shootSounds.length)].play();

    const bullet = new CatBullet(this.scene);
    this.catBullets.add(bullet);
    bullet.fire(this);

    gameChannel.push('fire', { dir: this.direction, x: Math.floor(this.x / 16), y: Math.floor(this.y / 16) });
    setTimeout(() => bullet.hit(), bullet.lifespan);
  }

  update() {
    this.controls.update();
  }

  playAnimation() {
    this.anims.play(this.animation, true);
  }

  animComplete() {
    !this.alive && this.destroy();
  }

  die() {
    this.alive = false;
  }
}

export default Player;
