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
import {
  uploadProfilePicture,
  uploadGroupProfilePicture,
} from "@api/uploadApi";
import useAuth from "@contexts/auth/useAuth";
import useSocket from "@contexts/socket/useSocket";
import { ChatRoom } from "src/types";

const isSameId = (left: unknown, right: unknown) =>
  String(left) === String(right);
const appendUniqueRoom = (rooms: any[], nextRoom: any) =>
  rooms.some((room) => isSameId(room._id, nextRoom?._id))
    ? rooms
    : [...rooms, nextRoom];

const replaceRoomById = (
  rooms: any[],
  roomId: any,
  updater: (room: any) => any,
) => rooms.map((room) => (isSameId(room._id, roomId) ? updater(room) : room));

const updateRoomMemberCount = (rooms: any[], roomId: any, delta: number) =>
  replaceRoomById(rooms, roomId, (room) => ({
    ...room,
    memberCount: Math.max((room.memberCount ?? 0) + delta, 0),
  }));

const updateMessageSenderProfile = (
  prevMessages: any,
  userId: any,
  newProfilePicture: any,
) =>
  Array.isArray(prevMessages)
    ? prevMessages.map((message) =>
        isSameId(message.sender?._id, userId)
          ? {
              ...message,
              sender: {
                ...message.sender,
                profilePicture: newProfilePicture,
              },
            }
          : message,
      )
    : prevMessages;

function useChatRoomLogic() {
  const { user, setUser } = useAuth();
  const { socket } = useSocket();
  const [isCreator, setIsCreator] = useState<any>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [currentChatId, setCurrentChatId] = useState<any>(null);
  const [messages, setMessages] = useState<any>(null);
  const [messagesCache, setMessagesCache] = useState<any>(null);
  const [isTablet, setIsTablet] = useState(window.innerWidth < 1010);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 798);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [isInChatView, setIsInChatView] = useState(false);

  const currentChat =
    chatRooms.find((room) => isSameId(room._id, currentChatId)) || null;
  const prevRoomId = useRef<any>();
  const currentChatIdRef = useRef<any>(null);

  useEffect(() => {
    currentChatIdRef.current = currentChatId;
  }, [currentChatId]);

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

  const updateMessagesCache = (roomId: any, nextMessages: any) => {
    setMessagesCache((prev: any) => ({
      ...prev,
      [roomId]: nextMessages,
    }));
  };

  const activateChat = async (element: any) => {
    if (!user || !socket?.id || !element?._id) return;
    prevRoomId.current = currentChatId;
    setMessages(null);
    setCurrentChatId(element._id);
    setIsCreator(isSameId(user._id, element.creator));
    await updateCurrentRoomRequest(element._id, socket.id);
  };

  const loadChatRooms = useCallback(async () => {
    try {
      const data = await fetchChatRoomInfo();
      setChatRooms(data?.chatRooms ?? []);
      setCurrentChatId(data?.currentChat?._id ?? null);
    } catch (_error: any) {
      if (_error?.response?.status === 401) return;
    }
  }, []);

  useEffect(() => {
    if (!socket || !currentChat) return;
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
        const activeChatId = currentChatIdRef.current;
        if (!prevCache || !activeChatId || !prevCache[activeChatId])
          return prevCache;

        return {
          ...prevCache,
          [activeChatId]: [...prevCache[activeChatId], newMessage],
        };
      });
    };

    const handleUpdateRoomName = (data: any) => {
      const { roomId, newName } = data;
      setChatRooms((prev) =>
        replaceRoomById(prev, roomId, (room) => ({
          ...room,
          name: newName,
        })),
      );
    };

    const handleUpdateProfilePicture = async (data: any) => {
      const { foundUserId, newProfilePicture } = data;

      setChatRooms((prev) => {
        const result: ChatRoom[] = prev.map((room) =>
          room.isDm && isSameId(room.otherUser?._id, foundUserId)
            ? {
                ...room,
                otherUser: {
                  ...room.otherUser,
                  profilePicture: newProfilePicture,
                },
              }
            : room,
        );
        return result;
      });

      if (isSameId(user?._id, foundUserId)) {
        setUser((prev: any) =>
          prev ? { ...prev, profilePicture: newProfilePicture } : prev,
        );
      }

      setMessages((prev: any[]) =>
        updateMessageSenderProfile(prev, foundUserId, newProfilePicture),
      );
    };

    const updateGroupProfilePicture = async (data: any) => {
      const { roomId, newProfilePicture } = data;
      setChatRooms((prev) =>
        replaceRoomById(prev, roomId, (room) => ({
          ...room,
          profilePicture: newProfilePicture,
        })),
      );
      setCurrentChatId(roomId);
    };

    const handlePrintSuccess = () => {
      // no-op
    };

    const handleIncreaseMemberCount = (data: any) => {
      setChatRooms((prev) =>
        updateRoomMemberCount(prev, data.updatedRoomId, 1),
      );
    };

    type DecreaseMemberCountType = {
      roomId: string;
      memberId: string;
      msg: any;
    };
    const handleDecreaseMemberCount = (data: DecreaseMemberCountType) => {
      const { roomId, memberId, msg } = data;
      console.log(
        `${data}\nPayload ID matches the current ID: ${isSameId(currentChatId, roomId)}`,
      );
      setChatRooms((prev) =>
        prev.map((room) => {
          if (isSameId(roomId, room._id)) {
            room.members.filter((member) => member._id === memberId);
          }
          return room;
        }),
      );
      if (isSameId(roomId, currentChatId)) {
        setMessages((prev: unknown[]) => [...prev, msg]);
      }
    };

    const handleAddRoom = (data: any) => {
      const { updatedRoom } = data;
      setChatRooms((prev) => appendUniqueRoom(prev, updatedRoom));
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
  }, [socket, user, setUser]);

  useEffect(() => {
    if (!currentChatId || !currentChat) return;

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
    setIsCreator(isSameId(user?._id, currentChat.creator));
  }, [currentChat, user]);

  const verifyJoinCode = async (joinCode: any) => {
    try {
      return await verifyJoinCodeRequest(joinCode);
    } catch {
      return undefined;
    }
  };

  const checkIfRoomExists = (joinCode: any) => {
    return chatRooms.some((room) => room.joinCode === joinCode);
  };

  const checkIfDmExists = (joinCode: any) => {
    return chatRooms.some(
      (room) => room.otherUser?.joinCode === joinCode && room.isDm === true,
    );
  };

  const joinRoom = async (joinCode: any) => {
    try {
      const newRoom = await joinRoomRequest(joinCode);
      setChatRooms((prev) => appendUniqueRoom(prev, newRoom));
    } catch {
      // ignore join errors
    }
  };

  const createGroup = async (groupName: any) => {
    if (!user) return;
    try {
      const newRoom = await createGroupRequest(user._id, groupName);
      setChatRooms((prev) => appendUniqueRoom(prev, newRoom));
      setCurrentChatId(newRoom._id);
      setIsCreator(true);
    } catch {
      // ignore create errors
    }
  };

  const leaveChatRoom = async () => {
    if (!currentChatId) return;
    try {
      await leaveRoomRequest(currentChatId);
      setChatRooms((prev) =>
        prev.filter((room) => !isSameId(room._id, currentChatId)),
      );
      setCurrentChatId(null);
      setMessages(null);
      setIsCreator(null);
    } catch {
      // ignore leave errors
    }
  };

  const sendMessage = (chatRoomId: any, content: any) => {
    socket?.emit("send-message", {
      chatRoomId,
      content,
      sender: user,
    });
  };

  const changeName = async (newName: any) => {
    if (!currentChat?._id) return;
    try {
      const foundChatRoom = await changeRoomNameRequest(
        newName,
        currentChat._id,
      );
      socket?.emit("change-room-name", foundChatRoom);
    } catch {
      // ignore change name errors
    }
  };

  const updateGroupProfilePicture = async (file: File) => {
    if (!currentChat?._id) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("roomId", String(currentChat._id));

    try {
      const newProfilePicture = await uploadGroupProfilePicture(formData);

      setChatRooms((prev) =>
        replaceRoomById(prev, currentChat._id, (room) => ({
          ...room,
          profilePicture: newProfilePicture,
        })),
      );

      setCurrentChatId(currentChat._id);
      socket?.emit("receive-group-photo-update", {
        roomId: currentChat._id,
        newProfilePicture,
      });
    } catch (err) {
      // ignore errors
    }
  };

  const findUser = async (joinCode: any) => {
    if (!socket?.id) return;

    try {
      const newRoom = await findUserRequest(joinCode, socket.id);
      setChatRooms((prev) => appendUniqueRoom(prev, newRoom));
    } catch {
      // ignore find-user errors
    }
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
        room.isDm && isSameId(room.otherUser?._id, user._id)
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

    socket?.emit("update-profile-picture", {
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
    updateGroupProfilePicture,
    sidebarIsOpen,
    setSidebarIsOpen,
    isInChatView,
    setIsInChatView,
  };
}

export default useChatRoomLogic;
