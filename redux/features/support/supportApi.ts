import { baseApi } from '../../api/baseApi';

const supportApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllSupport: builder.query({
            query: () => ({
                url: 'support/get-all-support',
                method: 'GET',
            }),
            providesTags: ['Support'],
        }),
        updateSupport: builder.mutation({
            query: (_id) => {
                return {
                    url: `support/update-support/${_id}`,
                    method: 'PATCH',
                    // body: data?.formDataToSend,
                };
            },
            invalidatesTags: ['Support'],
        }),
        deleteSupport: builder.mutation({
            query: (id) => {
                return {
                    url: `support/delete-support/${id}`,
                    method: 'DELETE',
                    // body: data,
                };
            },
            invalidatesTags: ['Support'],
        }),
    }),
});

export const { useGetAllSupportQuery, useUpdateSupportMutation, useDeleteSupportMutation  } = supportApi;
