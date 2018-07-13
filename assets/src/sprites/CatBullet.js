class CatBullet extends Phaser.GameObjects.Image {
  constructor(scene) {
    super(scene);
    this.scene = scene;
    Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

    this.setOrigin(0.5);
    scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setScale(0.5);

    this.speed = 200;
  }

  fire(gun) {
    this.setActive(true);
    this.setVisible(true);
    this.rotation = gun.firingAngle;

    this.setPosition(gun.x + 8, gun.y + 8);
    const angle = Phaser.Math.DegToRad(gun.firingAngle);
    this.scene.physics.velocityFromRotation(angle, this.speed, this.body.velocity);
    this.angle = gun.firingAngle;
  }

  hide() {
    this.setActive(false);
    this.setVisible(false);
    this.body.stop();
  }

  hit() {
    // this.hide();
    this.destroy();
  }
}

export default CatBullet;
