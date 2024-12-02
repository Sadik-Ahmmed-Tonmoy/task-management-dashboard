import { RootState } from "@/store";
import { addTokenToLocalStorage, getTokenFromLocalStorage } from "@/utils/tokenHandler";
import { createApi, fetchBaseQuery,BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://gutter-clean.vercel.app/api/",
    credentials: "include",
    prepareHeaders: (headers) => {
        const token = getTokenFromLocalStorage();
        headers.set("accept", "application/json");
        if (token) {
            headers.set("authorization", `${token}`);
        }
        return headers;
    },
});

const baseQueryWithRefreshToken: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
    args,
    api,
    extraOptions
  ) => {
    let result = await baseQuery(args, api, extraOptions);
  
    if (result.error?.status === 401) {
      try {
        const res = await fetch("https://gutter-clean.vercel.app/api/auth/refresh-token", {
          method: "POST",
          // credentials: "include", // Sends cookies with the request
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        const data = await res.json();
  
        if (data?.data?.accessToken) {
       
          addTokenToLocalStorage( data.data.accessToken)
  
          // Retry the original query with the new token
          result = await baseQuery(args, api, extraOptions);
        } else {
         
          console.error("Failed to obtain a new access token");
        }
      } catch (error) {
        console.error("Error during token refresh:", error);
      }
    }
  
    return result;
  };
  
  

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQueryWithRefreshToken,
    tagTypes: ["User", "Blog", "NewsLetter", "support", "serviceArea"],	
    endpoints: () => ({}),
});