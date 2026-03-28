import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { initSocket } from "../../lib/socket";
import { useSessionStatus } from "../../hooks/Session/sessionHooks";

export default function WaitingPage() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const socket = initSocket();

  const { data, refetch } = useSessionStatus(sessionId!);

  useEffect(() => {
    if (!socket) return;

    socket.emit("session:request-join", { sessionId });
  }, [sessionId]);

  useEffect(() => {
    if (!socket) return;

    socket.emit("session:join", sessionId);

    socket.on("session:approved", () => {
      navigate(`/video/${sessionId}`);
    });

    return () => {
      socket.off("session:approved");
    };
  }, [sessionId, socket, navigate]);

  // fallback polling
  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!data) return;

    if (data.role === "allowed" || data.role === "host") {
      navigate(`/video/${sessionId}`);
    }
  }, [data, navigate, sessionId]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h2 className="text-xl font-semibold mb-2">
        Waiting for host approval...
      </h2>
      <p className="text-gray-400">Please wait</p>
    </div>
  );
}
