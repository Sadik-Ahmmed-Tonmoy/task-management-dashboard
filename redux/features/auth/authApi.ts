import { baseApi } from '../../api/baseApi';

type TQueryParam = {
    name: string;
    value: any;
};

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
            query: (query) => {
                const params = new URLSearchParams();

                if (query) {
                    query.forEach((item: TQueryParam) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: `users`,
                    method: 'GET',
                    params: params,
                };
            },
            providesTags: ['User'],
        }),
        updateUser: builder.mutation({
            query: (userInfo) => {
                return {
                    url: `admin/update-user-profile/${userInfo._id}`,
                    method: 'PATCH',
                    body: userInfo,
                };
            },
            invalidatesTags: ['User'],
        }),
        deleteUser: builder.mutation({
            query: (id) => {
                return {
                    url: `admin/delete-user/${id}`,
                    method: 'DELETE',
                    // body: userInfo,
                };
            },
            invalidatesTags: ['User'],
        }),
    }),
});

export const { useLoginMutation, useRegisterMutation, useGetUserDataQuery, useGetAllUsersQuery, useUpdateUserMutation, useDeleteUserMutation } = authApi;
