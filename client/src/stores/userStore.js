import { create } from 'zustand';

export const useUserStore = create((set) => ({
  userEmail: null,
  userDisplayName: null,
  userPhotoUrl: null,

  setUserEmail: (userEmail) => set(() => ({ userEmail: userEmail })),
  setUserDisplayName: (userDisplayName) =>
    set(() => ({ userDisplayName: userDisplayName })),
  setUserPhotoUrl: (userPhotoUrl) =>
    set(() => ({ userPhotoUrl: userPhotoUrl })),
}));
