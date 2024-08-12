import React from "react";
import { ChatData } from "../context/ChatContext";

const Header = () => {
  const { chats } = ChatData();
  return (
    <div>
      <p className="text-lg mb-6">Ask RACON about your business</p>
      {chats && chats.length === 0 && (
        <p className="text-lg mb-6">Create new chat to continue</p>
      )}
    </div>
  );
};

export default Header;
