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
import send_button from "../../assets/images/Chat/send_button.svg";
import { formatMessageTime } from "@/library";
import { getUserDetails } from "@/data";
// import { useAuth } from "@/context";

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
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/*-------header-------*/}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={(info?.pictureURL || avatar_icon) as string}
          alt=""
          className="w-8 rounded-full"
        />
        <p className="flex-1 text-lg text-black flex items-center gap-2">
          {selectedUser?.firstName} {selectedUser?.lastName}
          {onlineUsers.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={arrow_icon}
          alt=""
          className="md:hidden max-w-7"
        />
        <img src={help_icon} alt="" className="max-md:hidden max-w-5" />
      </div>
      {/*------chat area-------*/}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify ${msg.senderId === user?._id && "flex-row-reverse"}`}
          >
            <div className="text-center text-xs">
              <img
                src={
                  (msg.senderId === user?._id
                    ? userInfo?.pictureURL || avatar_icon
                    : info?.pictureURL || avatar_icon) as string
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 breal-all bg-violet-500/30 text-black ${msg.senderId !== user?._id ? "rounded-bl-none" : "rounded-br-none"}`}
              >
                {msg.message}
              </p>
            )}
          </div>
        ))}
        <div ref={scrollEnd}></div>
      </div>
      {/*-------bottom area------ */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3 ">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            onChange={(e) => setInput(e.target.value)}
            value={input}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
              e.key === "Enter" ? handleSendMessage(e) : null
            }
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-black
             placeholder-gray-400"
          />
          {/* <input
            onChange={handleSendImage}
            type="file"
            id="image"
            accept="'image/png , image/jpeg"
            hidden
          />
          <label htmlFor="image">
            <img
              src={gallery_icon}
              alt=""
              className="w-5 mr-2 bg-black cursor-pointer"
            />
          </label> */}
        </div>
        <img
          onClick={handleSendMessage}
          src={send_button}
          alt=""
          className="w-7 cursor-pointer"
        />
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden">
      <img src={logo_icon} alt="" className="max-w-16" />
      <p className="text-lg font-medium text-whrite">Chat anytime, anywhere</p>
    </div>
  );
};

export default ChatContainer;
