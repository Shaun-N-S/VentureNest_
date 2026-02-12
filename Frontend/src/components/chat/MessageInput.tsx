import { useEffect, useState } from "react";
import { useSendMessage } from "../../hooks/Chat/chatHooks";
import { MESSAGE_TYPE } from "../../types/messageType";
import { getSocket } from "../../lib/socket";
import { SendHorizontal, Paperclip, Smile } from "lucide-react";

interface Props {
  conversationId: string;
}

const MessageInput = ({ conversationId }: Props) => {
  const [text, setText] = useState<string>("");
  const sendMessage = useSendMessage();

  const socket = getSocket();

  const handleSend = () => {
    if (!text.trim()) return;

    sendMessage.mutate({
      conversationId,
      content: text,
      messageType: MESSAGE_TYPE.TEXT,
    });

    setText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    if (!text) return;

    const timeout = setTimeout(() => {
      socket?.emit("chat:stop-typing", { conversationId });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [text, conversationId]);

  return (
    <div className="max-w-4xl mx-auto flex items-center gap-3">
      {/* Decorative attachment buttons */}
      {/* <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
        <Paperclip size={20} />
      </button> */}

      <div className="flex-1 relative">
        <input
          value={text}
          onKeyDown={handleKeyDown}
          onChange={(e) => {
            setText(e.target.value);
            socket?.emit("chat:typing", { conversationId });
          }}
          className="w-full bg-slate-100 border-none rounded-full px-5 py-3.5 pl-5 pr-12 text-sm text-slate-800 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-inner"
          placeholder="Type a message..."
        />
        {/* Emoji Button inside input */}
        {/* <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-amber-500 transition-colors">
          <Smile size={18} />
        </button> */}
      </div>

      <button
        onClick={handleSend}
        disabled={!text.trim()}
        className={`
            p-3.5 rounded-full shadow-lg transition-all duration-200 flex items-center justify-center
            ${
              text.trim()
                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 hover:shadow-indigo-500/30"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }
        `}
      >
        <SendHorizontal size={20} className={text.trim() ? "ml-0.5" : ""} />
      </button>
    </div>
  );
};

export default MessageInput;
