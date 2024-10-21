import { baseApi } from '../../api/baseApi';

const authApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (userInfo) => {
                return {
                    url: 'auth/login',
                    method: 'POST',
                    body: userInfo,
                };
            },
            invalidatesTags: ['User'],
        }),

        register: builder.mutation({
            query: (userInfo) => {
                return {
                    url: 'users/register',
                    method: 'POST',
                    body: userInfo,
                };
            },
            invalidatesTags: ['User'],
        }),
        getUserData: builder.query({
            query: () => ({
                url: 'users/get-me',
                method: 'GET',
            }),
            providesTags: ['User'],
        }),
       getAllUsers: builder.query({
        query: ({ page, pageSize }) => ({
            url: `users?page=${page}&limit=${pageSize}`,
            method: 'GET',
        }),
        providesTags: ['User'],
    }),
        updateUser: builder.mutation({
            query: (userInfo) => {
                return {
                    url: 'users/update-my-profile',
                    method: 'PATCH',
                    body: userInfo,
                };
            },
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetUserDataQuery, useGetAllUsersQuery, useUpdateUserMutation } = authApi;
