import { useParams } from "react-router-dom";
import VideoCall from "../../components/VideoCall/VideoCall";

export default function VideoPage() {
  const { sessionId } = useParams();

  return <VideoCall sessionId={sessionId!} />;
}
