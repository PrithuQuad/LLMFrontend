import { IoIosCloseCircle } from "react-icons/io";
import { ChatData } from "../context/ChatContext";
import { MdDelete } from "react-icons/md";
import { LoadingSpinner } from "./Loading";
import { UserData } from "../context/UserContext";
import { Link, Outlet } from "react-router-dom";


const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { chats, createChat, createLod, setSelected, deleteChat } = ChatData();

  const { logoutHandler } = UserData();

  const deleteChatHandler = (id) => {
    if (confirm("are you sure you want to delete this chat")) {
      deleteChat(id);
    }
  };

  const clickEvent = (id) => {
    setSelected(id);
    toggleSidebar();
  };
  return (
    <div
      className={`fixed inset-0 bg-gray-950 p-4 transition-transform transform md:relative md:translate-x-0 md:w-1/4 md:block ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <button
        className="md:hidden p-2 mb-4 bg-gray-700 rounded text-2xl"
        onClick={toggleSidebar}
      >
        <IoIosCloseCircle />
      </button>

      {/* <div className="text-2xl font-semibold mb-6">ChatBot</div> */}
              <Link to="/" className="logo">
          <img src="/logo.png" alt="" />
          <span>RACON</span>
        </Link>
      <div className="mb-4">
        <button
          onClick={createChat}
          className="w-full py-2 bg-cyan-900 hover:bg-gray-600 rounded-xl"
        >
          {createLod ? <LoadingSpinner /> : "New Chat +"}
        </button>
      </div>
      <div>
        <p className="text-sm text-gray-400 mb-2">Recent</p>

<div className="max-h-[470px] overflow-y-auto mb-50 md:pb-0 below-500:pb-0 thinn-scrollbar">
          {chats && chats.length > 0 ? (
            chats.map((e) => (
              <button
                key={e._id}
                className="w-11/12 text-left py-2 px-2 bg-gray-700 hover:bg-gray-600 rounded-xl mt-2 flex justify-between items-center"
                onClick={() => clickEvent(e._id)}
              >
                <span>{e.latestMessage.slice(0, 38)}...</span>
                <button
                  className="bg-cyan-600 text-white text-xl px-3 py-2 rounded-lg hover:bg-red-500"
                  onClick={() => deleteChatHandler(e._id)}
                >
                  <MdDelete />
                </button>
              </button>
            ))
          ) : (
            <p>No chats yet</p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 mb-6 w-full ">
        <button
          className="bg-cyan-600 text-white text-xl px-3 py-2 rounded-xl hover:bg-red-500"
          onClick={logoutHandler}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
