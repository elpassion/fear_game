import { Socket } from 'phoenix';

const socket = new Socket("ws://0.0.0.0:4000/socket", {params: {username: "test" + Math.floor(Math.random() * 1000)}});
socket.connect();

const gameChannel = socket.channel("game:lobby");
gameChannel.join();

export default gameChannel;
