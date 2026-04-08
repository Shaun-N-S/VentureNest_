import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { initSocket } from "../../lib/socket";
import {
  useJoinSession,
  useSessionStatus,
} from "../../hooks/Session/sessionHooks";

export default function WaitingPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const socket = initSocket();

  const { data, refetch } = useSessionStatus(sessionId!);
  const { mutate: joinSession } = useJoinSession();

  const isHost = data?.role === "host";

  // ✅ prevent multiple joins
  const hasJoinedRef = useRef(false);

  /* ------------------ JOIN SESSION (ONLY ONCE) ------------------ */
  useEffect(() => {
    if (!sessionId || hasJoinedRef.current) return;

    // 🚫 don't rejoin if already allowed
    if (data?.role === "allowed") return;

    hasJoinedRef.current = true;

    joinSession(sessionId);
  }, [sessionId, data, joinSession]);

  /* ------------------ SOCKET JOIN ------------------ */
  useEffect(() => {
    if (!socket || !sessionId) return;

    socket.emit("session:join", sessionId);

    const approvedHandler = () => {
      navigate(`/video/${sessionId}`);
    };

    socket.on("session:approved", approvedHandler);

    return () => {
      socket.off("session:approved", approvedHandler);
    };
  }, [sessionId, socket, navigate]);

  /* ------------------ POLLING (BACKUP SYNC) ------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, [refetch]);

  /* ------------------ AUTO NAVIGATION ------------------ */
  useEffect(() => {
    if (!data) return;

    if (data.role === "allowed" || data.role === "host") {
      navigate(`/video/${sessionId}`);
    }
  }, [data, navigate, sessionId]);

  /* ------------------ UI ------------------ */
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      {/* Host not joined */}
      {!data?.hostJoined && !isHost && (
        <div className="absolute top-6 bg-yellow-500 text-black px-4 py-2 rounded-lg shadow">
          Waiting for host to join...
        </div>
      )}

      {/* Main Loader */}
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>

        <h2 className="text-xl font-semibold">Waiting for approval...</h2>

        <p className="text-gray-400 text-sm">
          Please wait while the host allows you into the meeting
        </p>
      </div>
    </div>
  );
}
