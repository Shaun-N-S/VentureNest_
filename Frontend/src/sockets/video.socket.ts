import type { Socket } from "socket.io-client";

export const registerVideoSocket = (
  socket: Socket,
  peerConnection: RTCPeerConnection,
  sessionId: string,
) => {
  const pendingCandidates: RTCIceCandidateInit[] = [];

  /* ---------- OFFER ---------- */
  socket.on("video:offer", async ({ offer, from }) => {
    console.log("Offer from:", from);
    try {
      console.log("📩 Received offer");

      await peerConnection.setRemoteDescription(offer);

      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);

      socket.emit("video:answer", { sessionId, answer });

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
    console.log("❄️ ICE RECEIVED:", candidate);

    try {
      if (!candidate) return;

      if (!peerConnection.remoteDescription) {
        console.log("⏳ Queueing ICE");
        pendingCandidates.push(candidate);
        return;
      }

      console.log("✅ Adding ICE");
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
    } catch (err) {
      console.log("ICE ERROR:", err);
    }
  });
};
