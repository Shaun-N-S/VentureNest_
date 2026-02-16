import { useNavigate, useLocation } from "react-router-dom";
import { useInfiniteConversations } from "../../hooks/Chat/chatHooks";
import type { ConversationPreview } from "../../types/chat";
import { Search, MessageSquarePlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ConversationList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteConversations();

  const conversations: ConversationPreview[] =
    data?.pages.flatMap((page) => page.conversations) ?? [];

  return (
    <div className="h-full flex flex-col bg-white w-full">
      {/* Header */}
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Chats
          </h1>
          {/* <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
            <MessageSquarePlus size={22} />
          </button> */}
        </div>

        {/* Search Bar */}
        {/* <div className="relative group">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
          <input
            type="text"
            placeholder="Search messages..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100/70 border-none rounded-2xl text-sm font-medium focus:bg-white focus:ring-2 focus:ring-indigo-500/20 text-slate-700 placeholder:text-slate-400 transition-all outline-none"
          />
        </div> */}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.map((conversation) => {
          const isActive = location.pathname === `/chat/${conversation.id}`;

          return (
            <div
              key={conversation.id}
              onClick={() => navigate(`/chat/${conversation.id}`)}
              className={`
                flex items-center gap-4 px-5 py-3.5 cursor-pointer transition-all duration-200
                ${isActive ? "bg-indigo-50" : "hover:bg-slate-50"}
              `}
            >
              <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                <AvatarImage
                  src={conversation.otherUser.profileImg}
                  className="object-cover"
                />
                <AvatarFallback className="bg-slate-200 text-slate-500 font-bold">
                  {conversation.otherUser.userName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0 border-b border-slate-50 pb-3.5 pt-1">
                <div className="flex justify-between items-center mb-1">
                  <span
                    className={`font-bold truncate text-[15px] ${isActive ? "text-indigo-900" : "text-slate-900"}`}
                  >
                    {conversation.otherUser.userName}
                  </span>
                  {/* Mock Time - You can replace with real date if available */}
                  <span className="text-[11px] text-slate-400 font-medium">
                    Now
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  <p
                    className={`text-sm truncate w-full ${isActive ? "text-indigo-600 font-medium" : "text-slate-500"}`}
                  >
                    {conversation.lastMessage?.text ?? "No messages yet"}
                  </p>
                  {/* Unread Indicator (Optional Mock) */}
                  {/* <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" /> */}
                </div>
              </div>
            </div>
          );
        })}

        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full py-4 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-wider"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ConversationList;
