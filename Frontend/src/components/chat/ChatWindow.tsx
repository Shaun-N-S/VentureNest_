import { useParams, useNavigate } from "react-router-dom";
import {
  useInfiniteMessages,
  useInfiniteConversations,
} from "../../hooks/Chat/chatHooks";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { useEffect, useRef, useMemo } from "react";
import { getSocket } from "../../lib/socket";
import {
  MessageSquareDashed,
  ChevronLeft,
  // Phone,
  // Video,
  // MoreVertical,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ChatWindow = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const navigate = useNavigate();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 1. Fetch Messages
  const {
    data: messageData,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteMessages(conversationId ?? "");
  const messages =
    messageData?.pages.flatMap((page) => page.messages).reverse() ?? [];

  // 2. Fetch Conversations (to get the Header Details like Name/Image)
  // We use the existing cache key so this doesn't trigger a new network request usually
  const { data: conversationData } = useInfiniteConversations();

  // 3. Find the specific conversation details for the header
  const currentConversation = useMemo(() => {
    if (!conversationId || !conversationData) return null;
    const allConversations = conversationData.pages.flatMap(
      (p) => p.conversations,
    );
    return allConversations.find((c) => c.id === conversationId);
  }, [conversationId, conversationData]);

  // Socket Logic
  useEffect(() => {
    const socket = getSocket();
    if (!socket || !conversationId) return;
    socket.emit("conversation:join", conversationId);
    return () => {
      socket.emit("conversation:leave", conversationId);
    };
  }, [conversationId]);

  // Auto-scroll
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  if (!conversationId) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-50 text-slate-400">
        <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm mb-4">
          <MessageSquareDashed
            size={40}
            className="opacity-40 text-indigo-500"
          />
        </div>
        <p className="font-bold text-xl text-slate-700">Your Messages</p>
        <p className="text-slate-500 mt-2 text-center max-w-xs">
          Select a chat from the left to start messaging your connections.
        </p>
      </div>
    );
  }

  // Fallback if conversation data isn't loaded yet
  const otherUser = currentConversation?.otherUser || {
    userName: "User",
    profileImg: "",
  };

  return (
    <>
      {/* --- HEADER --- */}
      <div className="h-[72px] px-4 md:px-6 border-b border-slate-200 bg-white/90 backdrop-blur-md flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Back Button (Mobile Only) */}
          <button
            onClick={() => navigate("/chat")}
            className="md:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Profile Info */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border border-slate-100 shadow-sm">
              <AvatarImage
                src={otherUser.profileImg}
                className="object-cover"
              />
              <AvatarFallback className="bg-indigo-100 text-indigo-600 font-bold">
                {otherUser.userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="font-bold text-slate-800 text-sm md:text-base leading-tight">
                {otherUser.userName}
              </span>
              {/* <span className="text-xs text-green-600 font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Active now
              </span> */}
            </div>
          </div>
        </div>

        {/* Header Actions (Optional Decor) */}
        {/* <div className="flex items-center gap-1 md:gap-3 text-slate-400">
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors hidden sm:block">
            <Phone size={20} />
          </button>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors hidden sm:block">
            <Video size={20} />
          </button>
          <button className="p-2 hover:bg-slate-50 rounded-full transition-colors">
            <MoreVertical size={20} />
          </button>
        </div> */}
      </div>

      {/* --- MESSAGES AREA --- */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-slate-50/50"
      >
        {hasNextPage && (
          <div className="flex justify-center py-4">
            <button
              onClick={() => fetchNextPage()}
              className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-4 py-2 rounded-full hover:bg-indigo-100 transition-colors"
            >
              Load Older Messages
            </button>
          </div>
        )}

        <div className="flex flex-col gap-y-1 pb-2">
          {messages.map((message) => (
            <MessageBubble key={message._id} message={message} />
          ))}
        </div>
      </div>

      {/* --- INPUT AREA --- */}
      <div className="p-3 md:p-4 bg-white border-t border-slate-200">
        <MessageInput conversationId={conversationId} />
      </div>
    </>
  );
};

export default ChatWindow;
