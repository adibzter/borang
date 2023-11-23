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

export const getFormData = async (formId) => {
  const response = await fetch(`/api/forms/${formId}`);

  return await response.json();
};

export const deleteFormData = async (formId) => {
  const response = await fetch(`/api/forms/${formId}`, { method: 'DELETE' });

  return await response.json();
};
