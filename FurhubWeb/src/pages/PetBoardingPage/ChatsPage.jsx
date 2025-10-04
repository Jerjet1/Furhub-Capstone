import React, { useState } from "react";
import { UserLayoutPage } from "../../components/Layout/UserLayoutPage";
import { Search, Send } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ChatsPage = () => {
  // Example chat data
  // const [chats, setChats] = useState([]);
  const [chats, setChats] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "",
      lastMessage: "Max is doing great! Here's a photo...",
      time: "2m",
      online: true,
      messages: [
        {
          from: "provider",
          text: "Good morning Sarah! Max had a great night and is enjoying his breakfast.",
          time: "9:15 AM",
        },
        {
          from: "owner",
          text: "Thank you so much! He looks so happy. How is he eating?",
          time: "9:22 AM",
        },
      ],
    },
    {
      id: 2,
      name: "John Doe",
      avatar: "",
      lastMessage: "See you tomorrow!",
      time: "5h",
      online: false,
      messages: [
        {
          from: "provider",
          text: "Hello John, reminder for tomorrow!",
          time: "7:00 PM",
        },
      ],
    },
  ]);

  const [selectedChat, setSelectedChat] = useState(chats[0] || null);

  return (
    <UserLayoutPage>
      <div className="w-full h-full rounded-lg flex shadow-sm">
        {/* Chat list */}
        <div className="w-80 border-r border-[#a09e9e] bg-neutral-200 flex flex-col overflow-hidden rounded-l-lg">
          <div className="p-4 border-b border-[#E0E0E0]">
            <h2 className="text-lg font-semibold text-[#212121] mb-3">
              Messages
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#9E9E9E]" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 border-[#E0E0E0] focus:border-[#4285F4] bg-[#FAFAFA]"
              />
            </div>
          </div>

          {/* Chat list items or empty state */}
          <div className="flex-1 overflow-y-auto bg-neutral-100">
            {chats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-[#757575] p-4">
                <p className="text-sm">No conversations yet</p>
                <p className="text-xs">
                  Start a chat when someone messages you
                </p>
              </div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-[#E0E0E0] cursor-pointer hover:bg-[#FAFAFA] ${
                    selectedChat?.id === chat.id ? "bg-white" : ""
                  }`}>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-[#4285F4] text-white">
                        {chat.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-[#212121] truncate">
                          {chat.name}
                        </h3>
                        <span className="text-xs text-[#757575]">
                          {chat.time}
                        </span>
                      </div>
                      <p className="text-sm text-[#757575] truncate">
                        {chat.lastMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Chat window */}
        <div className="flex-1 flex flex-col h-full">
          {selectedChat ? (
            <>
              {/* Chat header */}
              <div className="p-4 border-b border-[#E0E0E0] bg-neutral-200 rounded-tr-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedChat.avatar} />
                    <AvatarFallback className="bg-[#4285F4] text-white">
                      {selectedChat.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-[#212121]">
                      {selectedChat.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedChat.online ? "bg-[#4CAF50]" : "bg-gray-400"
                        }`}></div>
                      <span className="text-sm text-[#757575]">
                        {selectedChat.online ? "Online" : "Offline"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#d8d7d7]">
                {selectedChat.messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      msg.from === "owner" ? "justify-end" : "justify-start"
                    }`}>
                    <div className="max-w-xs lg:max-w-md">
                      <div
                        className={`rounded-lg p-3 shadow-sm ${
                          msg.from === "owner"
                            ? "bg-[#4285F4] text-white"
                            : "bg-white border border-[#E0E0E0] text-[#424242]"
                        }`}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                      <p
                        className={`text-xs text-[#9E9E9E] mt-1 ${
                          msg.from === "owner" ? "text-right" : ""
                        }`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message input */}
              <div className="p-4 border-t border-[#E0E0E0] rounded-br-lg bg-neutral-200">
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Input
                      placeholder="Type your message..."
                      className="pr-12 border-[#afacac] focus:border-[#4285F4] bg-white"
                    />
                    <Button
                      size="icon"
                      className="absolute right-0 top-1/2 transform -translate-y-1/2 h-full w-10 bg-[#4285F4] hover:bg-[#1976D2]">
                      <Send className="h-2 w-2" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-[#d8d7d7] rounded-r-lg">
              <p className="text-[#757575] text-center">
                No chat selected <br />
                Start a conversation by selecting a chat
              </p>
            </div>
          )}
        </div>
      </div>
    </UserLayoutPage>
  );
};
