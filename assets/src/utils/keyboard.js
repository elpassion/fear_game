import { gameChannel } from '../client';

class PlayerKeyboard {
  constructor(player, scene) {
    this.player = player;
    this.scene = scene;
    // game.input.keyboard.createCursorKeys()
    // creates object with keys codes as follows:
    // 16: true | shift
    // 32: true | spacebar
    // 37: true | left arrow
    // 38: true | up arrow
    // 39: true | right arrow
    // 40: true | down arrow
    // so we have to disable every other input exept arrows
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keyboard = scene.input.keyboard;
    scene.input.keyboard.removeKey(16);
    scene.input.keyboard.removeKey(32);
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      gameChannel.push('move', { dir: 'w' });
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      gameChannel.push('move', { dir: 'e' });
    } else {
      // this.player.body.setVelocityX(0);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      // this.player.body.setVelocityY(100);
      gameChannel.push('move', { dir: 's' });
    } else if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      // this.player.body.setVelocityY(-100);
      gameChannel.push('move', { dir: 'n' });
    } else this.player.body.setVelocityY(0);
  }
}

export default PlayerKeyboard;
