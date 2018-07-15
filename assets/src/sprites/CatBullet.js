import Fart from './Fart';
import Bang from './Bang';

class CatBullet extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'catBullet');
    this.scene = scene;
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'catBullet');

    this.scene.add.existing(this);


    this.setOrigin(0.5);
    scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(2);

    this.speed = 200;
    this.lifespan = 3000;
    this.animation = 'catFly';
    this.farts = null;

    this.create();
  }

  create() {
    this.farts = this.scene.physics.add.group({
      classType: Fart,
    });

    this.intervalFarts = setInterval(() => {
      this.farts.add(new Fart(this.scene, this.x, this.y));
    }, 200);

    this.destroyTimeout = setTimeout(() => this.hit(), this.lifespan);
  }

  fire(gun) {
    this.setActive(true);
    this.setVisible(true);
    this.rotation = gun.firingAngle;

    const catPosition = {
      x: gun.x + 8,
      y: gun.y + 8,
    };

    this.playAnimation();

    this.setPosition(catPosition.x, catPosition.y);
    const angle = Phaser.Math.DegToRad(gun.firingAngle);
    this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
    this.angle = gun.firingAngle + 90;
  }

  hit() {
    clearInterval(this.intervalFarts);
    clearTimeout(this.destroyTimeout);
    new Bang(this.scene, this.x, this.y); // eslint-disable-line
    this.destroy();
  }

  playAnimation() {
    this.anims.play(this.animation, true);
  }
}

export default CatBullet;
