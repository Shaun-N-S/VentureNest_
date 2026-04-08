import type { Socket } from "socket.io-client";

export const registerVideoSocket = (
  socket: Socket,
  peerConnection: RTCPeerConnection,
  sessionId: string,
) => {
  const pendingCandidates: RTCIceCandidateInit[] = [];

  /* ---------- OFFER ---------- */
  socket.on("video:offer", async ({ offer }) => {
    try {
      console.log("📩 Received offer");

      await peerConnection.setRemoteDescription(offer);

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit("video:answer", { sessionId, answer });

      // ✅ APPLY buffered ICE
      pendingCandidates.forEach((c) =>
        peerConnection.addIceCandidate(new RTCIceCandidate(c)),
      );
      pendingCandidates.length = 0;
    } catch (err) {
      console.log("Offer handling error:", err);
    }
  });

  /* ---------- ANSWER ---------- */
  socket.on("video:answer", async ({ answer }) => {
    try {
      console.log("📩 Received answer");

      await peerConnection.setRemoteDescription(answer);

      // ✅ APPLY buffered ICE
      pendingCandidates.forEach((c) =>
        peerConnection.addIceCandidate(new RTCIceCandidate(c)),
      );
      pendingCandidates.length = 0;
    } catch (err) {
      console.log("Answer handling error:", err);
    }
  });

  /* ---------- ICE ---------- */
  socket.on("video:ice-candidate", async ({ candidate }) => {
    try {
      if (!candidate) return;

      // ✅ IF remote not ready → buffer
      if (!peerConnection.remoteDescription) {
        pendingCandidates.push(candidate);
        return;
      }

      await peerConnection.addIceCandidate(candidate);
    } catch (err) {
      console.log("ICE ERROR:", err);
    }
  });
};
