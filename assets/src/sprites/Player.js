import Keyboard from '../utils/keyboard';

class Player extends Phaser.GameObjects.Sprite {
  constructor(config) {
    super(config.scene, config.x, config.y, config.key);
    this.scene = config.scene;
    config.scene.physics.world.enable(this);
    this.scene.add.existing(this);

    // this.cameraCenter = {
    //   y: this.scene.cameras.main.height / 2,
    //   x: this.scene.cameras.main.width / 2,
    // };
    this.controls = new Keyboard(this, this.scene);
    this.animation = 'stand';
    this.create();
  }

  create() {
    // this.body.setCollideWorldBounds(true); // we can add it, but our bounds are within tilemap
  }

  update() {
    this.controls.update();
    this.anims.play(this.animation, true);
    this.animations();
  }

  animations() {
    if (this.body.velocity.x === 0 && this.body.velocity.y === 0)
      this.animation = 'stand';
    if (this.body.velocity.x > 0 && (this.body.velocity.y >= 0 || this.body.velocity.y < 0))
      this.animation = 'right';
    if (this.body.velocity.x < 0 && (this.body.velocity.y >= 0 || this.body.velocity.y < 0))
      this.animation = 'left';
    if (this.body.velocity.x === 0 && this.body.velocity.y > 0)
      this.animation = 'down';
    if (this.body.velocity.x === 0 && this.body.velocity.y < 0)
      this.animation = 'up';
  }
}

export default Player;
