import { useEffect, useRef } from "react";
import profile_martin from "../../assets/images/Chat/profile_martin.png";
import arrow_icon from "../../assets/images/Chat/arrow_icon.png";
import help_icon from "../../assets/images/Chat/help_icon.png";
import logo_icon from "../../assets/images/Chat/logo_icon.svg";
import avatar_icon from "../../assets/images/Chat/avatar_icon.png";
import gallery_icon from "../../assets/images/Chat/gallery_icon.svg";
import send_button from "../../assets/images/Chat/send_button.svg";
import { formatMessageTime } from "@/library";

const ChatContainer = ({ selectedUser, setSelectedUser }) => {
  const scrollEnd = useRef();

  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/*-------header-------*/}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img src={profile_martin} alt="" className="w-8 rounded-full" />
        <p className="flex-1 text-lg text-black flex items-center gap-2">
          Martin Johnson
          <span className="w-2 h-2 rounded-full bg-green-500"></span>
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
        {/* {messageDummydata.map((msg, index) => (
          <div
            key={index}
            className={`flex items-end gap-2 justify ${msg.senderId !== "68f9e453e86c20bf01756be8" && "flex-row-reverse"}`}
          >
            {msg.image ? (
              <img
                src={msg.image}
                alt=""
                className="max-w-[230px] border border-gray-700 rounded-lg overflow-hidden mb-8"
              />
            ) : (
              <p
                className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 breal-all bg-violet-500/30 text-white ${msg.senderId === "68f9e453e86c20bf01756be8" ? "rounded-br-none" : "rounded-bl-none"}`}
              >
                {msg.chat}
              </p>
            )}
            <div className="text-center text-xs">
              <img
                src={
                  msg.senderId === "68f9e453e86c20bf01756be8"
                    ? avatar_icon
                    : profile_martin
                }
                alt=""
                className="w-7 rounded-full"
              />
              <p className="text-gray-500">
                {formatMessageTime(msg.createdAt)}
              </p>
            </div>
          </div>
        ))} */}
        <div ref={scrollEnd}></div>
      </div>
      {/*-------bottom area------ */}
      <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
        <div className="flex-1 flex items-center bg-gray-100/12 px-3 rounded-full">
          <input
            type="text"
            placeholder="Send a message"
            className="flex-1 text-sm p-3 border-none rounded-lg outline-none text-black
             placeholder-gray-400"
          />
          <input
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
          </label>
        </div>
        <img src={send_button} alt="" className="w-7 cursor-pointer" />
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
