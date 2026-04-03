import { create } from 'zustand';

// Safely parse user from localStorage
const getStoredUser = () => {
  try {
    const storedUser = localStorage.getItem('user');
    return storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;
  } catch (error) {
    console.error("Error parsing user from localStorage:", error);
    return null;
  }
};

const initialUser = getStoredUser();

const useAuthStore = create((set) => ({
  user: initialUser,
  isAuthenticated: !!initialUser,

  login: (userData) => {
    try {
      localStorage.setItem('user', JSON.stringify(userData));
      set({ user: userData, isAuthenticated: true });
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    // Also remove any possible tokens managed by the frontend if any (e.g. cookies are HTTP only but checking)
    set({ user: null, isAuthenticated: false });
  }
}));

export default useAuthStore;
