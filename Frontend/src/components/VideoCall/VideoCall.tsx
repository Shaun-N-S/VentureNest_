import { useEffect, useRef } from "react";
import { initSocket } from "../../lib/socket";
import { registerVideoSocket } from "../../sockets/video.socket";

const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

interface Props {
  sessionId: string;
}

export default function VideoCall({ sessionId }: Props) {
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const socket = initSocket();
    if (!socket) return;

    const peerConnection = new RTCPeerConnection(servers);
    let localStream: MediaStream;

    const start = async () => {
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localVideoRef.current!.srcObject = localStream;

      localStream.getTracks().forEach((track) => {
        peerConnection.addTrack(track, localStream);
      });

      peerConnection.ontrack = (event) => {
        remoteVideoRef.current!.srcObject = event.streams[0];
      };

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("video:ice-candidate", {
            sessionId,
            candidate: event.candidate,
          });
        }
      };

      socket.emit("session:join", sessionId);

      registerVideoSocket(socket, peerConnection, sessionId);

      socket.on("video:user-joined", async ({ userId }) => {
        if (socket.id! < userId) return;

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);

        socket.emit("video:offer", { sessionId, offer });
      });
    };

    start();

    return () => {
      peerConnection.close();
      localStream?.getTracks().forEach((track) => track.stop());

      socket.off("video:offer");
      socket.off("video:answer");
      socket.off("video:ice-candidate");

      socket.disconnect();
    };
  }, [sessionId]);

  return (
    <div className="flex gap-4">
      <video ref={localVideoRef} autoPlay playsInline muted width={300} />
      <video ref={remoteVideoRef} autoPlay playsInline width={300} />
    </div>
  );
}
