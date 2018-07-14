class CatFart extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'catFart');
    this.scene = scene;
    Phaser.GameObjects.Image.call(this, scene, x, y, 'catFart');

    this.scene.add.existing(this);

    this.setOrigin(0.5);
    // scene.physics.world.enable(this);
    this.scene.add.existing(this);
    this.setDepth(1);

    this.animation = 'catFart';
    this.playAnimation();
    this.on('animationcomplete', () => this.destroy(), this);
  }

  playAnimation() {
    this.anims.play(this.animation, true);
  }
}

export default CatFart;
