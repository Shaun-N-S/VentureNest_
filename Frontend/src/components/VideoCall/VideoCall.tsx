import { useEffect, useRef, useState } from "react";
import { initSocket } from "../../lib/socket";
import { registerVideoSocket } from "../../sockets/video.socket";
import {
  useApproveUser,
  useSessionStatus,
} from "../../hooks/Session/sessionHooks";
import { useNavigate } from "react-router-dom";
import type { Socket } from "socket.io-client";

const servers = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

interface Props {
  sessionId: string;
}

export default function VideoCall({ sessionId }: Props) {
  const [waitingUsers, setWaitingUsers] = useState<string[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const localStreamRef = useRef<MediaStream | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const startedRef = useRef(false);

  const { mutate: approveUserApi } = useApproveUser();
  const { data } = useSessionStatus(sessionId);

  const navigate = useNavigate();
  const isHost = data?.role === "host";

  /* ------------------ INIT SOCKET ------------------ */
  useEffect(() => {
    const socket = initSocket();
    if (!socket) return;

    socketRef.current = socket;

    return () => {
      socket.off("session:user-waiting");
    };
  }, []);

  /* ------------------ ACCESS CONTROL ------------------ */
  useEffect(() => {
    if (!data) return;

    if (data.role !== "host" && data.role !== "allowed") {
      navigate(`/waiting/${sessionId}`);
    }
  }, [data, navigate, sessionId]);

  /* ------------------ JOIN ROOM ------------------ */
  useEffect(() => {
    if (!socketRef.current) return;

    socketRef.current.emit("session:join", sessionId);
  }, [sessionId]);

  /* ------------------ WEBRTC ------------------ */
  useEffect(() => {
    if (!socketRef.current || startedRef.current) return;

    startedRef.current = true;

    const socket = socketRef.current;

    if (!peerConnectionRef.current) {
      peerConnectionRef.current = new RTCPeerConnection(servers);
    }

    const peerConnection = peerConnectionRef.current;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          if (peerConnection.signalingState !== "closed") {
            peerConnection.addTrack(track, stream);
          }
        });

        peerConnection.ontrack = (event) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            socket.emit("video:ice-candidate", {
              sessionId,
              candidate: event.candidate,
            });
          }
        };

        registerVideoSocket(socket, peerConnection, sessionId);

        socket.on("video:user-joined", async () => {
          if (!isHost) return;

          await new Promise((r) => setTimeout(r, 300));

          if (peerConnection.signalingState !== "stable") return;

          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);

          socket.emit("video:offer", { sessionId, offer });
        });
      } catch (err) {
        console.error("Media error:", err);
      }
    };

    start();

    return () => {
      localStreamRef.current?.getTracks().forEach((t) => t.stop());

      socket.off("video:offer");
      socket.off("video:answer");
      socket.off("video:ice-candidate");
      socket.off("video:user-joined");
    };
  }, [sessionId]);

  /* ------------------ WAITING USERS ------------------ */
  useEffect(() => {
    if (!socketRef.current) return;

    const socket = socketRef.current;

    const listHandler = ({ waitingUsers }: { waitingUsers: string[] }) => {
      setWaitingUsers(waitingUsers);
    };

    socket.on("session:waiting-list-updated", listHandler);

    return () => {
      socket.off("session:waiting-list-updated", listHandler);
    };
  }, []);

  /* ------------------ ACTIONS ------------------ */

  const approveUser = (userId: string) => {
    approveUserApi(
      { sessionId, userId },
      {
        onSuccess: () => {
          setWaitingUsers((prev) => prev.filter((id) => id !== userId));
        },
      },
    );
  };

  const toggleMute = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getAudioTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsMuted((prev) => !prev);
  };

  const toggleCamera = () => {
    if (!localStreamRef.current) return;

    localStreamRef.current.getVideoTracks().forEach((track) => {
      track.enabled = !track.enabled;
    });

    setIsCameraOff((prev) => !prev);
  };

  const leaveCall = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());

    socketRef.current?.emit("session:leave", { sessionId });

    navigate("/sessions");
  };

  /* ------------------ UI ------------------ */

  return (
    <div className="h-screen bg-gray-900 text-white flex flex-col">
      {/* VIDEO */}
      <div className="flex-1 grid grid-cols-2 gap-4 p-4">
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="rounded-xl bg-black w-full h-full object-cover"
        />
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="rounded-xl bg-black w-full h-full object-cover"
        />
      </div>

      {/* HOST PANEL */}
      {isHost && (
        <div className="bg-gray-800 p-3">
          <h3 className="mb-2 font-semibold">Waiting Users</h3>

          {waitingUsers.length === 0 && (
            <p className="text-gray-400">No users waiting</p>
          )}

          {waitingUsers.map((userId) => (
            <div
              key={userId}
              className="flex justify-between items-center mb-2 bg-gray-700 px-3 py-2 rounded"
            >
              <span>User {userId.slice(-4)}</span>

              <button
                onClick={() => approveUser(userId)}
                className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded"
              >
                Allow
              </button>
            </div>
          ))}
        </div>
      )}

      {/* CONTROLS */}
      <div className="bg-gray-800 p-4 flex justify-center gap-6">
        <button
          onClick={toggleMute}
          className="bg-gray-600 px-4 py-2 rounded-full"
        >
          {isMuted ? "Unmute" : "Mute"}
        </button>

        <button
          onClick={toggleCamera}
          className="bg-gray-600 px-4 py-2 rounded-full"
        >
          {isCameraOff ? "Camera On" : "Camera Off"}
        </button>

        <button
          onClick={leaveCall}
          className="bg-red-600 px-4 py-2 rounded-full"
        >
          Leave
        </button>
      </div>
    </div>
  );
}
