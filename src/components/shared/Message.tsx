import { forwardRef } from "react";
import type { Message as MessageType } from "../../types";
import ProfilePicture from "../profile/ProfilePicture";

export interface MessageProps {
  message: MessageType;
  isSender: boolean;
}

const Message = forwardRef<HTMLDivElement, MessageProps>(function Message(
  { message, isSender },
  ref,
) {
  return (
    <div
      className={`mt-5 min-w-[23%] w-fit  max-w-[60%] p-2 text-(--neutral-primary-text)  self-${isSender ? "end" : "start"} flex justify-${isSender ? "end" : "start"} gap-2 items-end`}
    >
      {!isSender && (
        <ProfilePicture
          size={24}
          src={message.sender.profilePicture?.url}
          alt={`${message.sender.username}'s profile picture`}
        />
      )}

      <div className="flex flex-col text-(--neutral-secondary-text) text-sm">
        {!isSender && <span className="ml-3">{message.sender.username}</span>}
        <div
          className={`relative w-fit max-w-full h-fit rounded-3xl text-left py-2 px-4 ${isSender ? "self-end bg-linear-to-b from-(--p500) to-(--p400)" : "bg-(--neutral-border) "} text-(--neutral-primary-text)`}
          ref={ref}
        >
          <p>{message.content}</p>
        </div>

        <span
          className={`flex flex-row justify-${isSender ? "end" : "start"} pr-2 text-sm ml-3 text-(--neutral-tertiary-text)  mt-1`}
        >
          {new Date(message.createdAt || Date.now())
            .toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
            .toLowerCase()}
        </span>
      </div>
    </div>
  );
});

export default Message;
