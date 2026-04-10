import { useRef, useState } from "react";
import { useSendMessage } from "../../hooks/Chat/chatHooks";
import { MESSAGE_TYPE } from "../../types/messageType";
import { getSocket } from "../../lib/socket";
import { SendHorizontal, Smile, Paperclip } from "lucide-react";
import EmojiPicker, { type EmojiClickData } from "emoji-picker-react";

interface Props {
  conversationId: string;
}

const MessageInput = ({ conversationId }: Props) => {
  const [text, setText] = useState<string>("");
  const [showEmoji, setShowEmoji] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const sendMessage = useSendMessage();
  const socket = getSocket();

  const handleSend = () => {
    if (!text.trim()) return;

    const formData = new FormData();
    formData.append("conversationId", conversationId);
    formData.append("content", text);
    formData.append("messageType", MESSAGE_TYPE.TEXT);

    sendMessage.mutate(formData);

    setText("");
    setShowEmoji(false);
  };

  const handleFileUpload = (file: File) => {
    const formData = new FormData();

    formData.append("conversationId", conversationId);
    formData.append(
      "messageType",
      file.type.startsWith("image") ? "IMAGE" : "FILE",
    );
    formData.append("file", file);

    sendMessage.mutate(formData);
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="w-full bg-white border-t border-slate-200 px-4 py-3">
      <div className="max-w-4xl mx-auto flex items-center gap-3">
        {/* 📎 Attach */}
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition"
        >
          <Paperclip size={20} />
        </button>

        {/* Input Container */}
        <div className="flex-1 relative">
          <input
            value={text}
            onKeyDown={handleKeyDown}
            onChange={(e) => {
              const value = e.target.value;
              setText(value);

              socket?.emit("chat:typing", { conversationId });

              if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
              }

              typingTimeoutRef.current = setTimeout(() => {
                socket?.emit("chat:stop-typing", { conversationId });
              }, 1000);
            }}
            className="
              w-full bg-slate-100 rounded-full px-5 py-3 pr-12
              text-sm text-slate-800 placeholder:text-slate-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20
              transition-all
            "
            placeholder="Type a message..."
          />

          {/* 😀 Emoji Button */}
          <button
            type="button"
            onClick={() => setShowEmoji((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-yellow-500"
          >
            <Smile size={20} />
          </button>

          {/* 😀 Emoji Picker */}
          {showEmoji && (
            <div className="absolute bottom-14 right-0 z-50">
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>

        {/* 🚀 Send Button */}
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className={`
            p-3 rounded-full flex items-center justify-center transition-all
            ${
              text.trim()
                ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 shadow-md"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }
          `}
        >
          <SendHorizontal size={20} />
        </button>

        {/* Hidden File Input */}
        <input
          type="file"
          hidden
          ref={fileRef}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
        />
      </div>
    </div>
  );
};

export default MessageInput;
