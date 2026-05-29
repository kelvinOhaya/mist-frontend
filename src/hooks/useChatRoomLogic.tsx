import { useEffect, useRef, useState, useCallback } from "react";
import {
  changeRoomName as changeRoomNameRequest,
  createGroup as createGroupRequest,
  fetchChatRoomInfo,
  findUser as findUserRequest,
  joinRoom as joinRoomRequest,
  leaveRoom as leaveRoomRequest,
  loadMessages as loadMessagesRequest,
  updateCurrentRoom as updateCurrentRoomRequest,
  verifyJoinCode as verifyJoinCodeRequest,
} from "@api/chatRoomApi";
import { uploadProfilePicture } from "@api/uploadApi";
import useAuth from "@contexts/auth/useAuth";
import useSocket from "@contexts/socket/useSocket";

function useChatRoomLogic() {
  const { user, setUser } = useAuth();
  const { socket } = useSocket();
  const [isCreator, setIsCreator] = useState<any>(null);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const [currentChatId, setCurrentChatId] = useState<any>(null);
  const [messages, setMessages] = useState<any>(null);
  const [messagesCache, setMessagesCache] = useState<any>(null);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1010);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 798);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);

  const currentChat =
    chatRooms?.find((room) => currentChatId === room._id) || null;
  const prevRoomId = useRef<any>();

  useEffect(() => {
    const handleResize = () => {
      setIsTablet(window.innerWidth < 1010);
      setIsMobile(window.innerWidth < 798);
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(
    () => console.log(`Is it Tablet?: ${isTablet}\nIs it Mobile?: ${isMobile}`),
    [isTablet, isMobile],
  );

  const updateMessagesCache = (roomId: any, nextMessages: any) => {
    setMessagesCache((prev: any) => ({
      ...prev,
      [roomId]: nextMessages,
    }));
  };

  const activateChat = async (element: any) => {
    if (!user) return;
    prevRoomId.current = currentChatId;
    setMessages(null);
    setCurrentChatId(element._id);
    setIsCreator(user._id === element.creator);
    await updateCurrentRoomRequest(element._id, socket.id);
  };

  const loadChatRooms = useCallback(async () => {
    try {
      const data = await fetchChatRoomInfo();
      setChatRooms(data.chatRooms);
      setCurrentChatId(data.currentChat._id);
    } catch (_error: any) {
      if (_error.response && _error.response.status == 401) {
        // ignore unauthorized load errors here
      }
    }
  }, []);

  useEffect(() => {
    if (!currentChat) return;
    socket.emit("join-room", {
      prevRoom: prevRoomId.current,
      newRoom: currentChat._id,
    });
  }, [currentChat, socket]);

  const clearAllCache = () => {
    setMessagesCache(null);
  };

  useEffect(() => {
    if (!socket) return;

    const handleReceiveMessage = (message: any) => {
      const newMessage = { ...message, createdAt: Date.now() };
      setMessages((prev: any) => (prev ? [...prev, newMessage] : [newMessage]));

      setMessagesCache((prevCache: any) => {
        if (!prevCache || !prevCache[currentChatId]) return prevCache;

        return {
          ...prevCache,
          [currentChatId]: [...prevCache[currentChatId], newMessage],
        };
      });
    };

    const handleUpdateRoomName = (data: any) => {
      const { roomId, newName } = data;
      console.log(
        `Data from the change name socket event: \n ${JSON.stringify(
          data,
          null,
          2,
        )}
        )}`,
      );
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? {
                ...room,
                name: newName,
              }
            : room,
        ),
      );
    };

    const handleUpdateProfilePicture = async (data: any) => {
      const { foundUserId, newProfilePicture } = data;

      console.log(
        `Data from the update-profile-picture socket event\nFound user ID: ${foundUserId}\nNew Profile Picture Object: ${newProfilePicture}`,
      );

      setChatRooms((prev) =>
        prev.map((room) =>
          room.isDm && room.otherUser._id === foundUserId
            ? {
                ...room,
                otherUser: {
                  ...room.otherUser,
                  profilePicture: newProfilePicture,
                },
              }
            : room,
        ),
      );

      if (user?._id === foundUserId) {
        setUser((prev: any) =>
          prev ? { ...prev, profilePicture: newProfilePicture } : prev,
        );
      }

      setMessages((prev: any[]) =>
        prev.map((message) =>
          message.sender._id === foundUserId
            ? {
                ...message,
                sender: {
                  ...message.sender,
                  profilePicture: newProfilePicture,
                },
              }
            : message,
        ),
      );
    };

    const updateGroupProfilePicture = async (data: any) => {
      const { roomId, newProfilePicture } = data;
      console.log(
        "Data for new profile picture: \n",
        JSON.stringify(data, null, 2),
      );
      setChatRooms((prev) => {
        return prev.map((room) =>
          room._id === roomId
            ? { ...room, profilePicture: newProfilePicture }
            : room,
        );
      });
      setCurrentChatId(roomId);
    };

    const handlePrintSuccess = () => {
      // no-op
    };

    const handleIncreaseMemberCount = (data: any) => {
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === data.updatedRoomId
            ? { ...room, memberCount: room.memberCount + 1 }
            : room,
        ),
      );
    };

    const handleDecreaseMemberCount = (data: any) => {
      const { roomId } = data;
      setChatRooms((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? { ...room, memberCount: room.memberCount - 1 }
            : room,
        ),
      );
    };

    const handleAddRoom = (data: any) => {
      const { updatedRoom } = data;
      setChatRooms((prev) => [...prev, updatedRoom]);
    };

    socket.on("receive-message", handleReceiveMessage);
    socket.on("print-success", handlePrintSuccess);
    socket.on("update-room-name", handleUpdateRoomName);
    socket.on("update-profile-picture", handleUpdateProfilePicture);
    socket.on("receive-group-photo-update", updateGroupProfilePicture);
    socket.on("increase-member-count", handleIncreaseMemberCount);
    socket.on("add-room", handleAddRoom);
    socket.on("decrease-member-count", handleDecreaseMemberCount);

    return () => {
      socket.off("print-success", handlePrintSuccess);
      socket.off("receive-message", handleReceiveMessage);
      socket.off("update-room-name", handleUpdateRoomName);
      socket.off("update-profile-picture", handleUpdateProfilePicture);
      socket.off("receive-group-photo-update", updateGroupProfilePicture);
      socket.off("add-room", handleAddRoom);
      socket.off("increase-member-count", handleIncreaseMemberCount);
      socket.off("decrease-member-count", handleDecreaseMemberCount);
    };
  }, [socket, user, chatRooms, messages, currentChatId]);

  useEffect(() => {
    if (!currentChat) return;

    const getLoadedMessages = async () => {
      try {
        const loadedMessages = await loadMessagesRequest(currentChatId);
        setMessages(loadedMessages);
        updateMessagesCache(currentChatId, loadedMessages);
      } catch {
        // ignore load errors
      }
    };

    getLoadedMessages();
  }, [currentChat, currentChatId]);

  useEffect(() => {
    if (!currentChat) return;
    setIsCreator(user?._id === currentChat.creator);
  }, [currentChat, user]);

  const verifyJoinCode = async (joinCode: any) => {
    try {
      return await verifyJoinCodeRequest(joinCode);
    } catch {
      return undefined;
    }
  };

  const checkIfRoomExists = (joinCode: any) => {
    const roomExists = chatRooms.find((room) => room.joinCode === joinCode);
    return roomExists ? true : false;
  };

  const checkIfDmExists = (joinCode: any) => {
    const dmExists = chatRooms.find(
      (room) => room.otherUser?.joinCode === joinCode && room.isDm === true,
    );
    return dmExists ? true : false;
  };

  const joinRoom = async (joinCode: any) => {
    try {
      const newRoom = await joinRoomRequest(joinCode);
      setChatRooms((prev) => (prev ? [...prev, newRoom] : [newRoom]));
    } catch {
      // ignore join errors
    }
  };

  const createGroup = async (groupName: any) => {
    if (!user) return;
    const newRoom = await createGroupRequest(user._id, groupName);
    if (chatRooms != null) {
      setChatRooms([...chatRooms, newRoom]);
    } else {
      setChatRooms([newRoom]);
    }
    setCurrentChatId(newRoom._id);
  };

  const leaveChatRoom = async () => {
    if (!currentChatId) return;
    try {
      await leaveRoomRequest(currentChatId);
      socket.emit("leave-room", { currentRoomId: currentChatId });
      setChatRooms((prev) => prev.filter((room) => room._id != currentChatId));
      setCurrentChatId(null);
      setMessages(null);
    } catch {
      // ignore leave errors
    }
  };

  const sendMessage = (chatRoomId: any, content: any) => {
    socket.emit("send-message", {
      chatRoomId,
      content,
      sender: user,
    });
  };

  const changeName = async (newName: any) => {
    try {
      const foundChatRoom = await changeRoomNameRequest(
        newName,
        currentChat._id,
      );
      socket.emit("change-room-name", foundChatRoom);
    } catch {
      // ignore change name errors
    }
  };

  const findUser = async (joinCode: any) => {
    const newRoom = await findUserRequest(joinCode, socket.id);
    setChatRooms((prev) => [...prev, newRoom]);
  };

  const updateProfilePicture = async (file: File) => {
    if (!user) return;

    const formData = new FormData();
    formData.append("image", file);

    const newProfilePicture = await uploadProfilePicture(formData);

    setUser((prev: any) =>
      prev ? { ...prev, profilePicture: newProfilePicture } : prev,
    );

    setChatRooms((prev) =>
      prev.map((room) =>
        room.isDm && room.otherUser?._id === user._id
          ? {
              ...room,
              otherUser: {
                ...room.otherUser,
                profilePicture: newProfilePicture,
              },
            }
          : room,
      ),
    );

    setMessages((prev: any[]) =>
      Array.isArray(prev)
        ? prev.map((message) =>
            message.sender?._id === user._id
              ? {
                  ...message,
                  sender: {
                    ...message.sender,
                    profilePicture: newProfilePicture,
                  },
                }
              : message,
          )
        : prev,
    );

    socket.emit("update-profile-picture", {
      foundUserId: user._id,
      newProfilePicture,
    });
  };

  return {
    messagesCache,
    setMessagesCache,
    updateMessagesCache,
    updateProfilePicture,
    clearAllCache,
    chatRooms,
    setChatRooms,
    messages,
    setMessages,
    currentChat,
    currentChatId,
    setCurrentChatId,
    isCreator,
    setIsCreator,
    createGroup,
    verifyJoinCode,
    joinRoom,
    windowWidth,
    setWindowWidth,
    isMobile,
    setIsMobile,
    isTablet,
    setIsTablet,
    checkIfRoomExists,
    checkIfDmExists,
    activateChat,
    leaveChatRoom,
    findUser,
    loadChatRooms,
    sendMessage,
    changeName,
    sidebarIsOpen,
    setSidebarIsOpen,
  };
}

export default useChatRoomLogic;
