import * as SecureStore from "expo-secure-store";

// Save token and email
export const saveAuthData = async (token, email) => {
  await SecureStore.setItemAsync("accessToken", token);
  await SecureStore.setItemAsync("userEmail", email);
};

// Get token
export const getToken = async () => {
  return await SecureStore.getItemAsync("accessToken");
};

// Get email
export const getEmail = async () => {
  return await SecureStore.getItemAsync("userEmail");
};

// Delete all auth data
export const deleteAuthData = async () => {
  await SecureStore.deleteItemAsync("accessToken");
};

const REVIEW_KEY = "user_review_info";

// Save review info
export const setReviewInfo = async (value) => {
  try {
    await SecureStore.setItemAsync(REVIEW_KEY, JSON.stringify(value));
  } catch (e) {
 
  }
};

// Get review info
export const getReviewInfo = async () => {
  try {
    const result = await SecureStore.getItemAsync(REVIEW_KEY);
    return result ? JSON.parse(result) : null;
  } catch (e) {
 
    return null;
  }
};

// ===================== SUBSCRIPTION =====================

// Save last subscription view time
export const saveSubscriptionViewTime = async () => {
  try {
    const timestamp = new Date().getTime(); // current time in ms
    await SecureStore.setItemAsync(
      "subscriptionTimestamp",
      timestamp.toString()
    );
  } catch (error) {

  }
};

// Get last subscription view time
export const getSubscriptionViewTime = async () => {
  try {
    const ts = await SecureStore.getItemAsync("subscriptionTimestamp");
    return ts ? parseInt(ts, 10) : null;
  } catch (error) {
    return null;
  }
};
