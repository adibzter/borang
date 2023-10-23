import { create } from 'zustand';

export const useUserStore = create((set) => ({
  userEmail: null,
  userDisplayName: null,
  userPhotoUrl: null,
  isSignInLoading: null,
  badges: null,

  setUserEmail: (userEmail) => set(() => ({ userEmail: userEmail })),
  setUserDisplayName: (userDisplayName) =>
    set(() => ({ userDisplayName: userDisplayName })),
  setUserPhotoUrl: (userPhotoUrl) =>
    set(() => ({ userPhotoUrl: userPhotoUrl })),
  setIsSignInLoading: (isSignInLoading) =>
    set(() => ({ isSignInLoading: isSignInLoading })),
  setBadges: (badges) => set(() => ({ badges: badges })),
}));
