import { getTokenFromLocalStorage } from "@/utils/tokenHandler";
import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
    baseUrl: "https://watch-points.vercel.app/api/",
    credentials: 'include',
    // tagTypes: ["User"],
    prepareHeaders: (headers) => {
         // const token = getState().auth.token;
        const token = getTokenFromLocalStorage();
        headers.set("accept", "application/json");
        if (token) {
            headers.set("authorization", `${token}`);
        }
        return headers;
    },
});

export const baseApi = createApi({
    reducerPath: "baseApi",
    baseQuery: baseQuery,
    tagTypes: ["User", "Task", "Payment"],
    endpoints: () => ({}),
});