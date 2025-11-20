import React, { useState, useEffect, use } from "react";
import { useSelector } from "react-redux";
import Appwrite from "../appwrite/Appwrite";
import Conf from "../conf/Conf";
import { Client } from "appwrite";
import { Smile, Send, Search, Phone, MoreVertical, Clock, User } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function Chats() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [userIds, setUserIds] = useState([]);
  const [usernames, setUsernames] = useState([]);
  const [userImages, setUserImages] = useState([]);
  const [messages, setMessages] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const [currentusername, setCurrentUsername] = useState("");
  const [userImageUrl, setUserImageUrl] = useState("");
  const [newname, setnewname] = useState("");
  const [newimage, setnewimage] = useState("");
  const navigate = useNavigate();

  const userImage = useSelector((state) => state.infos?.imageurl);

  useEffect(() => {
    const file = async () => {
      try {
        if (userImage) await Appwrite.showfile(userImage);
      } catch (error) {
        console.error(error);
      }
    };
    file();
  }, [userImage]);

  const userdata = async () => {
    try {
      const users = await Appwrite.showuserdata();
      if (users?.documents?.length > 0) {
        setUserIds(users.documents.map((user) => user.useris));
        setUsernames(users.documents.map((user) => user.username));
        setUserImages(users.documents.map((user) => user.imageurl));
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    userdata();
    const client = new Client().setEndpoint(Conf.appwriteurl).setProject(Conf.projectid);

    const unsubscribe = client.subscribe(
      `databases.${Conf.databaseid}.collections.${Conf.textcollectionid}.documents`,
      async (response) => {
        const msg = response.payload;
        if (
          msg &&
          selectedUser &&
          ((msg.senderid === currentUserId && msg.reciverid === selectedUser.userid) ||
            (msg.senderid === selectedUser.userid && msg.reciverid === currentUserId))
        ) {
          await currentuserss();
        }
      }
    );

    return () => unsubscribe();
  }, [selectedUser, currentUserId]);

  const users = userIds.map((id, idx) => ({
    userid: id,
    userName: usernames[idx],
    userImage: userImages[idx],
  }));

  const onhandelsubmit = async () => {
    if (!messages.trim() || !selectedUser) return;
    try {
      await Appwrite.textdata({ reciverid: selectedUser.userid, text: messages });
      setMessages("");
      await currentuserss();
    } catch (error) {
      console.error(error);
    }
  };

  const currentuserss = async () => {
    try {
      const currentUser = await Appwrite.currentuser();
      if (currentUser) {
        setCurrentUserId(currentUser.$id);
        setCurrentUsername(currentUser.name);
        setUserImageUrl(currentUser.imageUrl);

        const result = await Appwrite.showtextdata();
        const filteredMessages = result.documents.filter(
          (msg) =>
            (msg.senderid === currentUser.$id && msg.reciverid === selectedUser?.userid) ||
            (msg.senderid === selectedUser?.userid && msg.reciverid === currentUser.$id)
        );
        setChatMessages(filteredMessages);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (selectedUser) currentuserss();
  }, [selectedUser, messages]);

 

  const showimage = async () => {
    try {
      const currentusernamess = await Appwrite.currentuser();
      const userss = await Appwrite.showuserdata();

      const userData = userss.documents.find(user => user.useris === currentusernamess.$id);
      if (userData) {
        setnewname(userData.username);
        setnewimage(userData.imageurl);
      }
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    showimage();
  }, [newname]);

 const handleLogout = async () => {
    try {
      await Appwrite.logout();
      console.log("User logged out");
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="flex h-screen bg-[#ECE5DD] text-gray-900">
      {/* Sidebar */}
      <div className={`${selectedUser ? "hidden md:flex" : "flex"} flex-col w-full md:w-1/3 lg:w-1/4 border-r border-gray-300 bg-white transition-all`}>
        {/* Header */}
        <div className="flex items-center justify-between p-3 bg-[#075E54] text-white">
          <div className="flex items-center gap-2">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-7 h-7"/>
            <span className="font-semibold text-lg">WhatsApp</span>
          </div>
          <div className="flex items-center gap-4 text-xl">
            <Clock size={20} className="hover:text-gray-200"/>
            <Send size={20} className="hover:text-gray-200"/>
            <MoreVertical size={20} className="hover:text-gray-200"/>
            {/* Profile image always visible */}
            <div
              onClick={() => setShowProfile(true)}
              className="w-10 h-10 rounded-full bg-gray-200 cursor-pointer flex items-center justify-center overflow-hidden"
            >
              {newimage ? (
                <img src={newimage} alt="Profile" className="w-full h-full object-cover"/>
              ) : (
                <User size={20} className="text-gray-600"/>
              )}
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="p-2 bg-gray-100">
          <input
            type="text"
            placeholder="Search or start new chat"
            className="w-full px-3 py-2 rounded-full bg-white  text-sm focus:outline-none border border-gray-300"
          />
        </div>

        {/* User List */}
        <div className="overflow-y-auto flex-1">
          {users.map((user, idx) => (
            <div
              key={user.userid || idx}
              onClick={() => setSelectedUser(user)}
              className="flex items-center gap-3 p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-200 transition"
            >
              <img src={user.userImage || "https://via.placeholder.com/50"} alt={user.userName || "Unknown User"} className="w-12 h-12 rounded-full object-cover"/>
              <div className="flex-1">
                <div className="font-semibold">{user.userName || "Unnamed User"}</div>
                <div className="text-sm text-gray-500">Tap to chat</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`${selectedUser ? "flex" : "hidden md:flex"} flex-col flex-1`}>
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between gap-3 p-3 bg-[#075E54] text-white relative">
              <div className="flex items-center gap-3">
                <button className="md:hidden text-white" onClick={() => setSelectedUser(null)}>←</button>
                <img src={selectedUser.userImage || "https://via.placeholder.com/40"} alt={selectedUser.userName || "Unknown"} className="w-10 h-10 rounded-full object-cover"/>
                <div>
                  <div className="font-semibold">{selectedUser.userName}</div>
                  <div className="text-xs text-gray-200">online</div>
                </div>
              </div>
            </div>

            {/* Profile Modal */}
            {showProfile && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                <div className="bg-white dark:bg-gray-800 rounded-2xl w-11/12 md:w-1/2 p-6 relative">
                  <button
                    className="absolute top-4 right-4 text-gray-500 text-xl"
                    onClick={() => setShowProfile(false)}
                  >
                    ×
                  </button>

                  <div className="flex flex-col items-center gap-4 mt-4">
                    <div className="w-24 h-24 rounded-full border-2 border-gray-300 bg-gray-200 overflow-hidden flex items-center justify-center">
                      <img src={newimage} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <p className="text-lg font-semibold text-white">{newname}</p>
                    <p className="text-sm text-gray-600 text-center">
                      This is your WhatsApp profile. You can see your username, profile picture, and manage your account permissions here.
                    </p>
                    <button
                      onClick={() => {handleLogout()}}
                      className="mt-4 w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ backgroundColor: "#ECE5DD" }}>
              <div className="max-w-lg mx-auto space-y-3">
                {chatMessages.length > 0 ? chatMessages.map((msg, idx) => {
                  const isSender = msg.senderid === currentUserId;
                  return (
                    <div key={msg.$id || idx} className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
                      <div className={`p-3 rounded-2xl shadow-md max-w-xs break-words relative ${isSender ? "bg-gradient-to-r from-[#dcf8c6] to-[#b2f2bb]" : "bg-white dark:bg-gray-700"}`}>
                        <p className="text-sm leading-snug">{msg.text}</p>
                        <p className="text-[10px] text-white mt-1 text-right">
                          {new Date(msg.timespan).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                }) : <p className="text-center text-gray-500">No messages yet.</p>}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-3 bg-[#F0F0F0] flex items-center gap-3 border-t border-gray-300">
              <button className="text-xl text-gray-600 hover:text-green-600"><Smile size={22}/></button>
              <input
                type="text"
                value={messages}
                onChange={(e) => setMessages(e.target.value)}
                placeholder="Type a message"
                className="flex-1 p-2 rounded-full border border-gray-300 focus:outline-none text-sm bg-white"
              />
              <button className="bg-[#25D366] hover:bg-[#20b358] text-white px-4 py-2 rounded-full shadow-md" onClick={onhandelsubmit}>
                <Send size={20}/>
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-gray-500 bg-[#f0f2f5]">
            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp Logo" className="w-20 h-20 mb-4 opacity-60"/>
            <h2 className="text-2xl font-semibold mb-2 text-gray-700">WhatsApp Web</h2>
            <p className="text-gray-500 text-sm">Send and receive messages without keeping your phone online.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chats;
