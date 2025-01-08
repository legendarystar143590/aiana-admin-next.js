import Markdown from "react-markdown"
import remarkGfm from 'remark-gfm'
import rehypeKatex from 'rehype-katex'
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

interface LinkProps {
  href?: string;
  children?:React.ReactNode;
}

const component = {
  a: ({href, children}: LinkProps) => {
    console.log(href);
    console.log(children);
    // Check if URL ends with image extensions
    const isImage = href?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    
    if (isImage) {
      return (
        <>
          <img 
            src={href} 
            alt={children?.toString() || 'Chat image'} 
            className="max-w-[200px] rounded-lg my-2"
          />
          <a 
            href={href} 
            className="underline text-blue-700" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            {children}
          </a>
        </>
      );
    }
    
    return (
      <a 
        href={href} 
        className="underline text-blue-700" 
        target="_blank" 
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }
}

const Messages = ({ message, avatarPreview }: OutputMessageProps) => 
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
          ? "bg-gray-200 text-[#070E0B] border rounded-md border-gray-300"
          : "flex-row-reverse bg-gray-100 text-black border rounded-md border-gray-300"
      }`}
    >
      <Markdown
        className="flex-grow max-w-[250px]"
        rehypePlugins={[rehypeKatex]}
        remarkPlugins={[remarkGfm]}
        components={component}
      >
        {message.text}
      </Markdown>
      {/* <div
        className="flex-grow"
        style={{ textAlign: message.isBot ? "left" : "right", overflowWrap: "break-word" }}
        dangerouslySetInnerHTML={{ __html: message.text }}
      /> */}
    </div>
  </div>

export default Messages