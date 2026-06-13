import { jwtDecode } from "jwt-decode";

export const getUserFromToken = async (token) => {
  try {
    if (!token) return null;

    return jwtDecode(token);
  } catch (err) {
    console.log("Invalid token");

    return null;
  }
};
