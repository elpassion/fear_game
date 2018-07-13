class CatBullet extends Phaser.GameObjects.Image {
  constructor(scene) {
    super(scene);
    this.scene = scene;
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'catBullet');

    this.setOrigin(0.5);
    scene.physics.world.enable(this);
    this.scene.add.existing(this);

    this.speed = 200;
    this.lifespan = 3000;
  }

  fire(gun) {
    this.setActive(true);
    this.setVisible(true);
    this.rotation = gun.firingAngle;

    const catPosition = {
      x: gun.x + 8 + (Math.floor(Math.random() * 5) - 5),
      y: gun.y + 8 + (Math.floor(Math.random() * 5) - 5),
    };

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
}

export default CatBullet;
