import { BsPencilSquare } from "react-icons/bs";

function ActivityDetailedChat() {
  return (
    <div className="rounded-lg relative overflow-hidden bg-base-200 shadow-lg shadow-gray-300 inset-ring inset-ring-gray-300 mb-4">
      <div className="text-center py-4 bg-accent text-white">Chat about this event</div>
      <div className="chat chat-start ms-2">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="User"
              src="/assets/user.png"
            />
          </div>
        </div>
        <div className="chat-header">
          Obi-Wan Kenobi
          <time className="text-xs opacity-50">12:45</time>
        </div>
        <div className="chat-bubble">You were the Chosen One!</div>
        <div className="chat-footer opacity-50">Delivered</div>
      </div>
      <div className="chat chat-end me-2">
        <div className="chat-image avatar">
          <div className="w-10 rounded-full">
            <img
              alt="User"
              src="/assets/user.png"
            />
          </div>
        </div>
        <div className="chat-header">
          Anakin
          <time className="text-xs opacity-50">12:46</time>
        </div>
        <div className="chat-bubble">I hate you!</div>
        <div className="chat-footer opacity-50">Seen at 12:46</div>
      </div>
      <div className="p-3">
        <textarea className="textarea w-full"></textarea>
        <button className="btn btn-accent mt-2 btn-sm">
          <BsPencilSquare />
          Add Reply
        </button>
      </div>
    </div>
  );
}

export default ActivityDetailedChat;
