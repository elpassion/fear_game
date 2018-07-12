import { Socket, Presence } from 'phoenix';

const socket = new Socket("ws://0.0.0.0:4000/socket", {params: {username: "test" + Math.floor(Math.random() * 1000)}});
socket.connect();

const gameChannel = socket.channel("game:lobby");
gameChannel.join();

let presences = {} // client's initial empty presence state
// receive initial presence data from server, sent after join
gameChannel.on("presence_state", state => {
  presences = Presence.syncState(presences, state)
})
// receive "presence_diff" from server, containing join/leave events
gameChannel.on("presence_diff", diff => {
  presences = Presence.syncDiff(presences, diff)
})

export default gameChannel;
