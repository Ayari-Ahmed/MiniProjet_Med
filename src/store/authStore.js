import { create } from "zustand";
import { getUsers } from "../api/userService";
import { saveItem, getItem } from "../api/asyncStorage";
import initialUsers from '../data/initialUsers.json';

const CURRENT_USER_KEY = "currentUser";

export const useAuthStore = create((set, get) => ({
  currentUser: null,
  isLoading: true,

  initializeAuth: async () => {
    const user = await getItem(CURRENT_USER_KEY);
    set({ currentUser: user, isLoading: false });
  },

  login: async (email, password) => {
    // Simple login: find user by email, assume password is name or something
    let users = await getUsers();
    if (users.length === 0) {
      // Load initial data if not present
      await saveItem('users', initialUsers);
      users = initialUsers;
    }
    const user = users.find(u => u.email === email);
    if (user) {
      await saveItem(CURRENT_USER_KEY, user);
      set({ currentUser: user });
      return true;
    }
    return false;
  },

  logout: async () => {
    await saveItem(CURRENT_USER_KEY, null);
    set({ currentUser: null });
  },

  updateUser: async (userId, updates) => {
    const users = await getUsers();
    const updatedUsers = users.map(user =>
      user.id === userId ? { ...user, ...updates } : user
    );
    await saveItem('users', updatedUsers);

    // Update current user if it's the one being updated
    const currentUser = get().currentUser;
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, ...updates };
      await saveItem(CURRENT_USER_KEY, updatedUser);
      set({ currentUser: updatedUser });
    }
  }
}));