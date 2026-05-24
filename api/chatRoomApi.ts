import { api } from "./api";

export async function fetchChatRoomInfo() {
  const { data } = await api.get("/chatroom/send-info");
  return data;
}

export async function updateCurrentRoom(
  currentRoomId: string,
  socketId: string,
) {
  await api.put("/chatroom/update-current-room", {
    currentRoomId,
    socketId,
  });
}

export async function loadMessages(currentChatId: string) {
  const { data } = await api.post("/chatroom/load-messages", {
    currentChatId,
  });

  return data.messages;
}

export async function verifyJoinCode(joinCode: string) {
  const { data } = await api.post("/chatRoom/verify-join-code", {
    joinCode,
  });

  return data.isValid as boolean;
}

export async function joinRoom(joinCode: string) {
  const { data } = await api.post("/chatRoom/join", { joinCode });
  return data.newRoom;
}

export async function createGroup(senderId: string, name: string) {
  const { data } = await api.post("/chatroom/", {
    senderId,
    name,
  });

  return data.newRoom;
}

export async function leaveRoom(currentRoomId: string) {
  await api.delete("/chatroom/leave-room", {
    data: { currentRoomId },
  });
}

export async function changeRoomName(newName: string, currentRoomId: string) {
  const { data } = await api.put("/chatroom/change-name", {
    newName,
    currentRoomId,
  });

  return data.foundChatRoom;
}

export async function findUser(joinCode: string, socketId: string) {
  const { data } = await api.post("/chatroom/find-user", {
    joinCode,
    socketId,
  });

  return data.newRoom;
}