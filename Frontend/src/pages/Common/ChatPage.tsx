import { useParams } from "react-router-dom";
import ChatWindow from "../../components/chat/ChatWindow";
import ConversationList from "../../components/chat/ConversationList";

const ChatPage = () => {
  const { conversationId } = useParams();

  return (
    <div className="flex w-full h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      

      <div 
        className={`
          w-full md:w-[340px] lg:w-[380px] border-r border-slate-100 bg-white flex-shrink-0 h-full
          ${conversationId ? "hidden md:flex" : "flex"}
        `}
      >
        <ConversationList />
      </div>

      <div 
        className={`
          flex-1 flex-col bg-slate-50/50 h-full relative
          ${!conversationId ? "hidden md:flex" : "flex"}
        `}
      >
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChatPage;