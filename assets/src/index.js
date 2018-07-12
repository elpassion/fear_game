import Phaser from 'phaser'
import { Boot, Game } from 'scenes'
import { Socket } from 'phoenix';

const socket = new Socket("ws://0.0.0.0:4000/socket", {params: {username: "test" + Math.floor(Math.random() * 1000)}});
socket.connect();

const gameChannel = socket.channel("game:lobby");
gameChannel.join();

gameChannel.on("map", console.log);
gameChannel.on("user_joined", console.log);
gameChannel.on("self_joined", console.log);


const config = {
  type: Phaser.AUTO,
  parent: 'fear-game',
  width: 800,
  height: 600,
  scene: [
    Boot,
    Game
  ]
}

const game = new Phaser.Game(config) // eslint-disable-line no-unused-vars
