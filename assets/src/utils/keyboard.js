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

    this.turnFlag = false;
    this.lastSend = Date.now();
  }

  update() {
    if (Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.player.fireCat();
    }

    if (Date.now() - this.lastSend < this.player.move_time) return;

    if (!this.turnFlag) {
      if (this.keyboard.checkDown(this.cursors.left, this.player.move_time)) {
        this.lastSend = Date.now();
        if (this.player.direction !== 'w') {
          this.player.direction = 'w';
          this.player.animation = 'leftStanding';
          this.player.playAnimation();
          gameChannel.push('turn', {dir: 'w'});
        } else {
          gameChannel.push('move', { dir: 'w' });
        }
      } else if (this.keyboard.checkDown(this.cursors.right, this.player.move_time)) {
        this.lastSend = Date.now();
        if (this.player.direction !== 'e') {
          this.player.direction = 'e';
          this.player.animation = 'rightStanding';
          this.player.playAnimation();
          gameChannel.push('turn', {dir: 'e'});
        } else {
          gameChannel.push('move', { dir: 'e' });
        }
      }

      if (this.keyboard.checkDown(this.cursors.down, this.player.move_time)) {
        this.lastSend = Date.now();
        if (this.player.direction !== 's') {
          this.player.direction = 's';
          this.player.animation = 'downStanding';
          this.player.playAnimation();
          gameChannel.push('turn', {dir: 's'});
        } else {
          gameChannel.push('move', { dir: 's' });
        }
      } else if (this.keyboard.checkDown(this.cursors.up, this.player.move_time)) {
        this.lastSend = Date.now();
        if (this.player.direction !== 'n') {
          this.player.direction = 'n';
          this.player.animation = 'upStanding';
          this.player.playAnimation();
          gameChannel.push('turn', {dir: 'n'});
        } else {
          gameChannel.push('move', { dir: 'n' });
        }
      }
    }
  }
}

export default PlayerKeyboard;
