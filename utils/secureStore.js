import * as SecureStore from 'expo-secure-store';

// Save token and email
export const saveAuthData = async (token, email) => {
  await SecureStore.setItemAsync('accessToken', token);
  await SecureStore.setItemAsync('userEmail', email);
};

// Get token
export const getToken = async () => {
  return await SecureStore.getItemAsync('accessToken');
};

// Get email
export const getEmail = async () => {
  return await SecureStore.getItemAsync('userEmail');
};

// Delete all auth data
export const deleteAuthData = async () => {
  await SecureStore.deleteItemAsync('accessToken');
  await SecureStore.deleteItemAsync('userEmail');
};
