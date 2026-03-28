import type { Socket } from "socket.io-client";

export const registerVideoSocket = (
  socket: Socket,
  peerConnection: RTCPeerConnection,
  sessionId: string,
) => {
  const pendingCandidates: RTCIceCandidateInit[] = [];

  /* ---------- OFFER ---------- */
  socket.on("video:offer", async ({ offer }) => {
    await peerConnection.setRemoteDescription(offer);

    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("video:answer", { sessionId, answer });

    // ✅ process buffered ICE
    pendingCandidates.forEach((c) =>
      peerConnection.addIceCandidate(new RTCIceCandidate(c)),
    );
    pendingCandidates.length = 0;
  });

  /* ---------- ANSWER ---------- */
  socket.on("video:answer", async ({ answer }) => {
    await peerConnection.setRemoteDescription(answer);

    // ✅ process buffered ICE
    pendingCandidates.forEach((c) =>
      peerConnection.addIceCandidate(new RTCIceCandidate(c)),
    );
    pendingCandidates.length = 0;
  });

  /* ---------- ICE ---------- */
  socket.on("video:ice-candidate", async ({ candidate }) => {
    if (!candidate) return;

    if (peerConnection.remoteDescription) {
      await peerConnection.addIceCandidate(candidate);
    } else {
      // 🔥 buffer until remote description is ready
      pendingCandidates.push(candidate);
    }
  });
};
