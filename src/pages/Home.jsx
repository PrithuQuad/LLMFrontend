import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { GiHamburgerMenu } from "react-icons/gi";
import Header from "../components/Header";
import { ChatData } from "../context/ChatContext";
import { IoMdSend } from "react-icons/io";
import { LoadingBig, LoadingSmall } from "../components/Loading";
import Markdown from "react-markdown";
import * as XLSX from "xlsx";
import ApiCalls from "../helpers/apiCalls";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fileData, setFileData] = useState(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const {
    fetchResponse,
    messages = [], // Ensure messages is initialized as an empty array if undefined
    prompt,
    setPrompt,
    newRequestLoading,
    loading,
    chats,
  } = ChatData();

  const submitHandler = (e) => {
    e.preventDefault();

    if (fileData) {
      const reader = new FileReader();

      reader.onload = async (event) => {
        const fileContent = event.target.result;

        // Process Excel or Text File
        let processedData;
        if (fileData.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
          const workbook = XLSX.read(fileContent, { type: "binary" });
          const sheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[sheetName];
          processedData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
        } else {
          processedData = fileContent.split("\n").map(line => line.trim()).filter(line => line);
        }

        // Convert processed data to a string format
        const formattedData = processedData.join("\n");

        // Call fetchResponse with the formatted data
        fetchResponse(formattedData);
      };

      reader.readAsBinaryString(fileData);
    } else {
      fetchResponse();
    }
  };

  const messagecontainerRef = useRef();

  useEffect(() => {
    if (messagecontainerRef.current) {
      messagecontainerRef.current.scrollTo({
        top: messagecontainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div className="flex flex-1 flex-col">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-4 bg-gray-800 text-2xl"
        >
          <GiHamburgerMenu />
        </button>

        <div className="flex-1 p-6 mb-20 md:mb-0">
          <Header />

          {loading ? (
            <LoadingBig />
          ) : (
            <div
              className="flex-1 p-6 max-h-[600px] overflow-y-auto mb-20 md:mb-0 thin-scrollbar"
              ref={messagecontainerRef}
            >
              {messages && messages.length > 0 ? (
                messages.map((e, i) => (
                  <div key={i}>
                    <div className="mb-4 flex justify-end">
                      <div
                        className="p-4 rounded-2xl bg-gray-700 text-white"
                        style={{
                          maxWidth: '70%',
                          minWidth: '300px',
                        }}
                      >
                        <div className="whitespace-normal">
                          {e.question}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4 flex justify-start">
                      <div
                        className="p-4 rounded-2xl bg-sky-900 text-white"
                        style={{
                          maxWidth: '70%',
                          minWidth: '300px',
                        }}
                      >
                        <div className="whitespace-normal">
                          <Markdown>{e.answer}</Markdown>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p>No chat yet</p>
              )}

              {newRequestLoading && <LoadingSmall />}
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 right-0 left-auto p-4 bg-gray-900 w-full md:w-[75%]">
        <form
          onSubmit={submitHandler}
          className="flex justify-center items-center"
        >
          <input
            className="flex-grow p-4 bg-gray-700 rounded-l text-white outline-none"
            type="text"
            placeholder="Enter a prompt here"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            required
          />
          <button className="p-4 bg-gray-700 rounded-r text-2xl text-white">
            <IoMdSend />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Home;
