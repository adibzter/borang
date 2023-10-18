import { create } from 'zustand';

export const useUserStore = create((set) => ({
  userEmail: '',
  userDisplayName: '',
  userPhotoUrl: '',

  setUserEmail: (userEmail) => set(() => ({ userEmail: userEmail })),
  setUserDisplayName: (userDisplayName) =>
    set(() => ({ userDisplayName: userDisplayName })),
  setUserPhotoUrl: (userPhotoUrl) =>
    set(() => ({ userPhotoUrl: userPhotoUrl })),
}));
