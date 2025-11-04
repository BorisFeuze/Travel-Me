import {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";
// import profile_martin from "../../assets/images/Chat/profile_martin.png";
import arrow_icon from "../../assets/images/Chat/arrow_icon.png";
import help_icon from "../../assets/images/Chat/help_icon.png";
import logo_icon from "../../assets/images/Chat/logo_icon.svg";
import avatar_icon from "../../assets/images/Chat/avatar_icon.png";
// import gallery_icon from "../../assets/images/Chat/gallery_icon.svg";
// import send_button from "../../assets/images/Chat/send_button.svg";
import { formatMessageTime } from "@/utils";
import { getUserDetails } from "@/data";
// import { useAuth } from "@/context";
import { Send } from "lucide-react";

type ChatContainerType = {
  selectedUser: User;
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
  messages: ChatType[];
  sendMessage: (
    selectedUserId: string,
    messageData: ChatInputType
  ) => Promise<void>;
  onlineUsers: string[];
  user: User;
};

const ChatContainer = ({
  selectedUser,
  setSelectedUser,
  messages,
  sendMessage,
  onlineUsers,
  user,
}: ChatContainerType) => {
  const scrollEnd = useRef<HTMLDivElement | null>(null);
  const [input, setInput] = useState("");
  const [info, setInfo] = useState<UserProfileData | null>(null);
  const [userInfo, setUserInfo] = useState<UserProfileData | null>(null);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserDetails(selectedUser?._id);

        if (data) {
          const userInfo = data.userProfiles[0];

          // console.log(userInfo);

          setInfo(userInfo);
        }
      } catch {
        setError("Error fetching userProfile of selectedUser");
      }
    })();
  }, [selectedUser]);

  // console.log(selectedUser);
  // console.log(user);

  useEffect(() => {
    (async () => {
      try {
        const data = await getUserDetails(user?._id);

        if (data) {
          // console.log(data);

          const userInfo = data.userProfiles[0];

          // console.log(userInfo);

          setUserInfo(userInfo);
        }
      } catch {
        setError("Error fetching userProfile of Host");
      }
    })();
  }, [messages]);

  // Handle sending a message
  const handleSendMessage = async (
    e:
      | React.MouseEvent<HTMLImageElement>
      | React.KeyboardEvent<HTMLInputElement>
  ): Promise<null | undefined> => {
    e.preventDefault();
    if (input.trim() === "") return null;
    // console.log(input);
    await sendMessage(selectedUser?._id, {
      message: input.trim(),
    });
    setInput("");
  };

  // //Handle sending an image
  // const handleSendImage = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !file.type.startWith("image/")) {
  //     console.error("select an image file");
  //     return;
  //   }
  //   const reader = new FileReader();
  //   reader.onloadend = async () => {
  //     await sendMessage(selectedUser._id, { image: reader.result });
  //     e.target.value = "";
  //   };
  //   reader.readAsDataURL(file);
  // };

  useEffect(() => {
    if (scrollEnd.current && messages) {
      scrollEnd.current?.lastElementChild?.scrollIntoView({
        behavior: "smooth",
      });
    }
  }, [messages]);

  return selectedUser ? (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="flex items-center gap-3 h-16 px-4 md:px-6 border-b border-gray-200">
        <img
          src={(info?.pictureURL || avatar_icon) as string}
          alt=""
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex-1 min-w-0">
          <p className="text-base md:text-lg text-gray-900 truncate">
            {selectedUser?.firstName} {selectedUser?.lastName}
          </p>
          <div className="flex items-center gap-2">
            {onlineUsers.includes(selectedUser._id) && (
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
            )}
            <span className="text-xs text-gray-500">
              {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <img
          onClick={() => setSelectedUser(null)}
          src={arrow_icon}
          alt=""
          className="md:hidden w-6 h-6 cursor-pointer"
        />
        <img
          src={help_icon}
          alt=""
          className="max-md:hidden w-5 h-5 opacity-70"
        />
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => {
          const isMe = msg.senderId === user?._id;
          const avatarSrc = (
            isMe
              ? userInfo?.pictureURL || avatar_icon
              : info?.pictureURL || avatar_icon
          ) as string;

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${isMe ? "justify-end" : "justify-start"}`}
            >
              {!isMe && (
                <img
                  src={avatarSrc}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}

              <div
                className={`max-w-[75%] flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt=""
                    className={`max-w-60 border rounded-xl overflow-hidden ${
                      isMe ? "border-pink-200" : "border-gray-200"
                    }`}
                  />
                ) : (
                  <p
                    className={`px-3 py-2 text-sm leading-relaxed rounded-2xl break-all ${
                      isMe
                        ? "bg-pink-600 text-white rounded-br-sm"
                        : "bg-slate-100 text-slate-900 rounded-bl-sm"
                    }`}
                  >
                    {msg.message}
                  </p>
                )}
                <span className="mt-1 text-[10px] text-gray-500">
                  {formatMessageTime(msg.createdAt)}
                </span>
              </div>

              {isMe && (
                <img
                  src={avatarSrc}
                  alt=""
                  className="w-7 h-7 rounded-full object-cover"
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd} />
      </div>

      {/* Composer (send only) */}
      <div className="border-t border-gray-200 p-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-full px-3 py-2">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" ? handleSendMessage(e) : null
            }
            type="text"
            placeholder="Write a message…"
            className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400"
          />
          <button
            type="button"
            onClick={(e) => handleSendMessage(e as any)}
            className="p-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white transition"
            aria-label="Send"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-500 bg-white">
      {/* Logo visibile solo da md in su */}
      <img
        src={logo_icon}
        alt="Chat logo"
        className="hidden md:block w-16 h-16"
      />
      <p className="text-base md:text-lg font-medium">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
