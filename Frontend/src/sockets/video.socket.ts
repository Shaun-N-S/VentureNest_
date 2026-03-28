import type { Socket } from "socket.io-client";

export const registerVideoSocket = (
  socket: Socket,
  peerConnection: RTCPeerConnection,
  sessionId: string,
) => {
  socket.on("video:offer", async ({ offer }) => {
    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    // ✅ FIXED
    socket.emit("video:answer", { sessionId, answer });
  });

  socket.on("video:answer", async ({ answer }) => {
    await peerConnection.setRemoteDescription(answer);
  });

  socket.on("video:ice-candidate", async ({ candidate }) => {
    if (candidate) {
      await peerConnection.addIceCandidate(candidate);
    }
  });
};
