import { useNavigate } from "react-router";
import { useEffect, useState } from "react";
import { getUsers } from "@/data";
import { useChat, useUser, useAuth } from "@/context";
import logo from "../../assets/images/Chat/logo.png";
import menu_icon from "../../assets/images/Chat/menu_icon.png";
import search_icon from "../../assets/images/Chat/search_icon.png";
import { useRef } from "react";
import UserChat from "./UserChat";

const Sidebar = ({ users, selectedUser, setSelectedUser, unseenMessages }) => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");

  // const {
  //   selectedUser,
  //   setSelectedUser,
  //   handleGetusers,
  //   /* users,
  //   unseenMessages,*/
  //   setUnseenMessages,
  // } = useChat();

  const { onlineUsers } = useAuth();

  const navigate = useNavigate();

  const scrollEnd = useRef();

  // useEffect(() => {
  //   (async () => {
  //     try {
  //       // mock: fetch a bigger list and find by id
  //       const dataUsers = await getUsers();

  //       if (!dataUsers) setError("users not found.");
  //       console.log(dataUsers.users);
  //       setAllUsers(dataUsers.users);
  //     } catch {
  //       setError("Failed to load host details.");
  //     } finally {
  //       setLoading(false);
  //     }
  //   })();
  // }, []);

  // console.log(users);

  const filteredUsers = input
    ? users.filter((user) =>
        user.firstName.toLowerCase().includes(input.toLowerCase())
      )
    : users;

  // useEffect(() => {
  //   handleGetusers();
  // }, [onlineUsers]);

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""}`}
    >
      <div className="pd-5">
        {/* <div className="flex justify-between items-center">
          <img src={logo} alt="logo" className="max-w-40" />
          <div className="relative py-2 group">
            <img
              src={menu_icon}
              alt="Menu"
              className="max-h-5 cursor-pointer"
            />
            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border-gay-600 text-gray-100 hidden group-hover:block">
              <p
                onClick={() => navigate("/")}
                className="cursor-pointer text-sm"
              >
                Edit Profile
              </p>
              <hr className="my-2 border-t border-gray-500" />
              <p className="cursor-pointer text-sm">Logout</p>
            </div>
          </div>
        </div> */}
        <div className="bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5">
          <img src={search_icon} alt="Search" className="w-3" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
            placeholder="Search User..."
          />
        </div>
      </div>
      <div className="flex flex-col">
        {filteredUsers.map((user, index) => (
          <div
            key={index}
            onClick={() => {
              setSelectedUser(user);
            }}
            className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id && "bg-[#282142/50]"}`}
          >
            <UserChat
              id={user._id}
              firstName={user.firstName}
              index={index}
              lastName={user.lastName}
            />
            {/* <img
              src={user?.picture || avatar_icon}
              alt=""
              className="w-[35px] aspect-square rounded-full"
            />
            <div className="flex flex-col leading-5">
              <p>{user.fullName}</p>
              {index < 3 ? (
                <span className="text-green-400">Online</span>
              ) : (
                <span className="text-neutral-400">Offline</span>
              )}
            </div>
            {index > 2 && (
              <p className="absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50">
                {index}
              </p>
            )} */}
          </div>
        ))}
      </div>
      <div ref={scrollEnd}></div>
    </div>
  );
};

export default Sidebar;
