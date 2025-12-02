import { getItem, saveItem } from "./asyncStorage";

const USER_KEY = "users";

export const getUsers = async () => {
  return (await getItem(USER_KEY)) || [];
};

export const addUser = async (user) => {
  const users = await getUsers();
  const newList = [...users, user];
  await saveItem(USER_KEY, newList);
  return newList;
};

export const updateUser = async (id, updated) => {
  const users = await getUsers();
  const newList = users.map((u) => (u.id === id ? { ...u, ...updated } : u));
  await saveItem(USER_KEY, newList);
  return newList;
};

export const deleteUser = async (id) => {
  const users = await getUsers();
  const newList = users.filter((u) => u.id !== id);
  await saveItem(USER_KEY, newList);
  return newList;
};