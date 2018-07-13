class CatBullet extends Phaser.GameObjects.Sprite {
  constructor(scene) {
    super(scene, 0, 0, 'catBullet');
    this.scene = scene;
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'catBullet');

    this.scene.add.existing(this);


    this.setOrigin(0.5);
    scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(1);

    this.speed = 100;
    this.lifespan = 3000;
    this.animation = 'catFly';
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

  hide() {
    this.setActive(false);
    this.setVisible(false);
    this.body.stop();
  }

  hit() {
    this.destroy();
  }

  playAnimation() {
    console.log(this);
    this.anims.play(this.animation, true);
  }
}

export default CatBullet;
