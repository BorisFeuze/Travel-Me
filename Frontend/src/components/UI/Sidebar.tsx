// import { useNavigate } from "react-router";
import {
  /*useEffect,*/ useState,
  type Dispatch,
  type SetStateAction,
} from "react";
// import { getUsers } from "@/data";
// import { useAuth } from "@/context";
// import logo from "../../assets/images/Chat/logo.png";
// import menu_icon from "../../assets/images/Chat/menu_icon.png";
// import search_icon from "../../assets/images/Chat/search_icon.png";
// import { useRef } from "react";
import UserChat from "./UserChat";
import { Search } from "lucide-react";

type SidebarType = {
  users: User[];
  selectedUser: User;
  setSelectedUser: Dispatch<SetStateAction<User | null>>;
};

const Sidebar = ({
  users,
  selectedUser,
  setSelectedUser /*unseenMessages*/,
}: SidebarType) => {
  // const [allUsers, setAllUsers] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState("");

  // const {
  //   selectedUser,
  //   setSelectedUser,
  //   handleGetusers,
  //   /* users,
  //   unseenMessages,*/
  //   setUnseenMessages,
  // } = useChat();

  // const { onlineUsers } = useAuth();

  // const navigate = useNavigate();

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
      className={`h-full bg-gray-50 text-gray-900 border-r border-gray-200 px-4 py-4 md:px-5 md:py-5 overflow-y-auto ${selectedUser ? "max-md:hidden" : ""}`}
    >
      {/* Header + Search */}
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-gray-900 px-1">Messages</h2>
        <div className="mt-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Search user…"
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-gray-50 border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex flex-col gap-1">
        {filteredUsers.map((user, index) => {
          const active = selectedUser?._id === user._id;
          return (
            <button
              key={index}
              onClick={() => setSelectedUser(user)}
              className={`relative w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-xl transition cursor-pointer
               ${active ? "bg-indigo-100/70 border border-indigo-200" : "hover:bg-gray-100"}`}
            >
              <UserChat
                id={user._id}
                firstName={user.firstName}
                lastName={user.lastName}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;
