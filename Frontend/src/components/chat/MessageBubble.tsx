import type { ChatMessage } from "../../types/chat";
import { useSelector } from "react-redux";
import type { Rootstate } from "../../store/store";
import { deleteMessage } from "@/services/Chat/chatService";

interface Props {
  message: ChatMessage;
}

const MessageBubble = ({ message }: Props) => {
  const currentUserId = useSelector((state: Rootstate) => state.authData.id);

  const handleDelete = async (id: string) => {
    await deleteMessage(id);
  };

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
          {message.isDeleted ? (
            <span className="italic text-slate-400">
              This message was deleted
            </span>
          ) : (
            <>
              {message.messageType === "TEXT" && <span>{message.content}</span>}

              {message.messageType === "IMAGE" && message.fileUrl && (
                <img
                  src={message.fileUrl}
                  className="rounded-xl max-h-60 object-cover mt-1"
                />
              )}

              {/* {message.messageType === "FILE" && message.fileUrl && (
                <a
                  href={message.fileUrl}
                  target="_blank"
                  className="underline text-blue-500"
                >
                  📎 {message.fileName}
                </a>
              )} */}
            </>
          )}

          {message.messageType === "IMAGE" && message.fileUrl && (
            <img
              src={message.fileUrl}
              className="rounded-xl max-h-60 object-cover mt-1"
            />
          )}

          {message.messageType === "FILE" && message.fileUrl && (
            <a
              href={message.fileUrl}
              target="_blank"
              className="underline text-blue-500"
            >
              📎 {message.fileName}
            </a>
          )}
        </p>

        <div
          className={`
            text-[10px] mt-1.5 flex items-center justify-end gap-1
            ${isMine ? "text-indigo-100/70" : "text-slate-400"}
        `}
        >
          {new Date(message.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          {isMine && !message.isDeleted && (
            <span>
              {message.status === "SENT" && "✓"}
              {message.status === "DELIVERED" && "✓✓"}
              {message.status === "READ" && (
                <span className="text-blue-300">✓✓</span>
              )}
            </span>
          )}
        </div>
        {isMine && !message.isDeleted && (
          <button
            onClick={() => handleDelete(message._id)}
            className="absolute top-1 right-2 text-xs opacity-0 group-hover:opacity-100"
          >
            🗑
          </button>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
