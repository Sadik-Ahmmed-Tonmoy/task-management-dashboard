
import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => {
                return {
                    url: "auth/login",
                    method: "POST",
                    body: userInfo,
                }
            },
              invalidatesTags: ["User"]
        }),
        updateUser: builder.mutation({
            query: (userInfo) => {
                return {
                    url: "user/me",
                    method: "PATCH",
                    body: userInfo,
                }
            },
            invalidatesTags: ["User"],
        }),
        register: builder.mutation({
            query: (userInfo) => {
                return {
                    url: "users/register",
                    method: "POST",
                    body: userInfo,
                }
            },
            invalidatesTags: ["User"],
        }),
        userData: builder.query({
            query: () => ({
                url: "user/me",
                method: "GET",
            }),
            providesTags: ["User"],
        }),
    }),
});

export const {useLoginMutation, useRegisterMutation, useUpdateUserMutation, useUserDataQuery} = authApi;
