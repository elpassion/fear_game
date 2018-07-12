import Keyboard from '../utils/keyboard';

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
    this.create();
  }

  create() {
    // this.body.setCollideWorldBounds(true); // we can add it, but our bounds are within tilemap
  }

  update() {
    this.controls.update();
    this.anims.play(this.animation, true);
  }
}

export default Player;
