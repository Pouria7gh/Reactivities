import { observer } from "mobx-react-lite"
import type { Comment } from "../../../../models/Comment"
import { formatDistanceToNow } from "date-fns"


interface props {
    comment: Comment
}

function ChatBubble({comment}: props) {
  return (
    <div className={`chat m-2 ${comment.isCurrentUser ? "chat-end" : "chat-start"}`}>
      <div className="chat-image avatar self-start mt-3">
        <div className="w-10 rounded-full">
          <img
              alt="User"
              src={comment.image || "/assets/user.png"}
          />
        </div>
      </div>
      <div className={`chat-header ${comment.isCurrentUser ? "flex-row-reverse" : ""}`}>
        {comment.displayName}
        <time className="text-xs opacity-50 mx-2">{formatDistanceToNow(comment.createdAt)}</time>
      </div>
      <div className="chat-bubble whitespace-pre-wrap break-all">{comment.body}</div>
    </div>
  )
}

export default observer(ChatBubble)