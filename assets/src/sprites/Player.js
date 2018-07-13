import Keyboard from '../utils/keyboard';
import { CatBullet } from '../sprites';

class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    this.scene = config.scene;
    this.setOrigin(0.0);
    config.scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(1);

    this.controls = new Keyboard(this, this.scene);
    this.animation = 'downStanding';
    this.firingAngle = 270;
    this.alive = true;
    this.on('animationcomplete', this.animComplete, this);
    this.create();
  }

  create() {
    this.catBullets = this.scene.physics.add.group({
      classType: CatBullet,
    });

    // this.scene.input.on('pointermove', (pointer) => {
    //   const angle = ((Math.atan2(pointer.y, pointer.x) * 180) / Math.PI); // my player change position all the time with movement, so center of caemra is the same positiosn ans player's
    //   this.angle = parseInt(angle, 10);
    //   console.log(this.angle);
    // });
  }

  fireCat() {
    const bullet = new CatBullet(this.scene);
    this.catBullets.add(bullet);
    bullet.fire(this);
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
