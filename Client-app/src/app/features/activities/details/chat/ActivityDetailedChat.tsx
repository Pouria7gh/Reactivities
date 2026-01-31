import { useStore } from "../../../../stores/Store";
import { useEffect, useRef } from "react";
import ChatBubble from "./ChatBubble";
import { observer } from "mobx-react-lite";
import ChatForm from "./ChatForm";

interface props {
  activityId: string;
}

function ActivityDetailedChat({activityId}: props) {
  const {commentStore} = useStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const lastChatBubbleRef = useRef<HTMLDivElement>(null);
  const didScroll = useRef(false);

  useEffect(() => {
    commentStore.createHubConnection(activityId);
    return () => {
      commentStore.stopHubConnectionAndClearComments();
    }
  }, [commentStore, activityId]);


  useEffect(() => {
    if (!didScrollOnLoad()) {
      scrollToBottomWithDelay();
      updateDidScrollOnLoad();
    } else if (isLastCommentBlongToUser()) {
      scrollToBottom();
    } else if (isScrollAtBottom()) {
      scrollToBottomWithDelay();
    }
  }, [commentStore.comments.length]);

  function scrollToBottomWithDelay() {
    setTimeout(() => {
      containerRef.current!.scrollTop =
        containerRef.current!.scrollHeight;
    }, 500)
  }

  function didScrollOnLoad() {
    return didScroll.current;
  }

  function updateDidScrollOnLoad() {
    didScroll.current = true;
  }

  function isLastCommentBlongToUser() {
    const lastComment = commentStore.comments.at(-1);
    if (lastComment){
      return lastComment.isCurrentUser;
    }
    return false;
  }

  function scrollToBottom() {
    containerRef.current!.scrollTop =
      containerRef.current!.scrollHeight;
  }

  function isScrollAtBottom() {
    const container = containerRef.current;
    const lastChatBubble = lastChatBubbleRef.current;
    if (!container || !lastChatBubble)
      return false;

    const scrollBottom = container.scrollHeight - (container.scrollTop + container.offsetHeight);
    const lastChatBubbleHeight = lastChatBubble.offsetHeight + 50;

    return scrollBottom <= lastChatBubbleHeight;
  }

  return (
    <div className="rounded-lg relative overflow-hidden bg-base-200 shadow-lg shadow-gray-300 inset-ring inset-ring-gray-300 mb-4">
      <div className="text-center py-4 bg-accent text-white">Chat about this event</div>
      <div className="relative">
        <div ref={containerRef} className="h-80 overflow-auto">
          {commentStore.comments.map((comment, index) => {

            const isLastChatBubble = index === (commentStore.comments.length-1);
            
            return ( 
              <div key={comment.id} ref={isLastChatBubble ? lastChatBubbleRef : null }>
                <ChatBubble comment={comment}/>
              </div>
            );

          })}
        </div>
      </div>
      <div className="p-3">
        <ChatForm activityId={activityId} />
      </div>
    </div>
  );
}

export default observer(ActivityDetailedChat);
