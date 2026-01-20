import axiosInstance from "./axios";

  export const verifyAuthCSR = async () => {
    try {
      const response = await axiosInstance.get(`/agent/verify-auth`);
      console.log(response.data);
      return response.data; // 
    } catch (error) {
        return { authenticated: false };
    }
  }