import type { ChatMessage } from "../../types/chat";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";

interface Props {
  message: ChatMessage;
}

const MessageBubble = ({ message }: Props) => {
  const currentUserId = useSelector((state: Rootstate) => state.authData.id);

  const isMine = message.senderId === currentUserId;

  return (
    <div
      className={`flex w-full ${isMine ? "justify-end" : "justify-start"} mb-2 group`}
    >
      <div
        className={`
          relative max-w-[75%] sm:max-w-[60%] px-5 py-3 text-sm shadow-sm
          ${
            isMine
              ? "bg-gradient-to-br from-indigo-600 to-blue-600 text-white rounded-2xl rounded-tr-sm"
              : "bg-white text-slate-700 border border-slate-100 rounded-2xl rounded-tl-sm"
          }
        `}
      >
        <p
          className={`leading-relaxed ${isMine ? "text-white/95" : "text-slate-800"}`}
        >
          {message.content}
        </p>

        <div
          className={`
            text-[10px] mt-1.5 flex items-center justify-end
            ${isMine ? "text-indigo-100/70" : "text-slate-400"}
        `}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
