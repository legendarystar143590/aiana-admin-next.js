
import Avatar from "../Avatar"

interface Message {
  id: string;
  isBot: boolean;
  text: string;
}

interface OutputMessageProps {
  message: Message;
  avatarPreview: string | null;
}

const OutputMessage = ({ message, avatarPreview }: OutputMessageProps) => 
  <div
    key={message.id}
    className={`p-2 flex gap-3 ${message.isBot ? "" : "justify-end"}`}
    style={{
      maxWidth: "90%",
      alignSelf: message.isBot ? "flex-start" : "flex-end",
    }}
  >
    <Avatar
      src={message.isBot ? avatarPreview || "/images/logo_short_black.png" : "/images/logo_short_black.png"}
      name="avatar"
      className={`rounded-full size-12 ${!message.isBot && "hidden"}`}
    />

    <div
      className={`flex gap-2 p-2 rounded-lg break-words ${
        message.isBot
          ? "bg-[#EBEBEB] text-[#070E0B]"
          : "flex-row-reverse bg-[#A536FA] text-white"
      }`}
    >
      <div
        className="flex-grow"
        style={{ textAlign: message.isBot ? "left" : "right", overflowWrap: "break-word" }}
        dangerouslySetInnerHTML={{ __html: message.text }}
      />
    </div>
  </div>

export default OutputMessage