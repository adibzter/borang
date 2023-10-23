import { getIdToken } from './firebase';

export const getUser = async (email) => {
  const tokenId = await getIdToken();
  const response = await fetch(`/api/users/${email}`, {
    headers: {
      Authorization: `Bearer ${tokenId}`,
    },
  });

  return await response.json();
};
