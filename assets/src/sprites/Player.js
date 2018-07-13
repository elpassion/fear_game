import Keyboard from '../utils/keyboard';
import { CatBullet } from '../sprites';

class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
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
    const bullet = new CatBullet(this.scene);
    this.catBullets.add(bullet);
    bullet.fire(this);

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
