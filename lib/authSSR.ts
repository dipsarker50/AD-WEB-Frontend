import { cookies } from "next/headers";
import axios from "axios";

export const verifyAuthSSR = async () => {
  const cookieStore = cookies();
  
  const cookieHeader = (await cookieStore)
    .getAll()
    .map((cookie: { name: any; value: any; }) => `${cookie.name}=${cookie.value}`)
    .join('; ');
    
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/agent/verify-auth`,
      {
        headers: {
          Cookie: cookieHeader,
        },
      }
    );
    
    return response.data;
    
  } catch (error: any) {
    return { authenticated: false };
  }
};
