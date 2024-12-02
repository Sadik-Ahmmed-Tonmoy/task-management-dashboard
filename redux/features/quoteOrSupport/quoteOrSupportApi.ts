import { baseApi } from '../../api/baseApi';



const newsLetterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllQuotationRequest: builder.query({
            query: (data) => {
                return {
                    url: `support/get-all-support?status=${data?.status}&page=${data?.page}&limit=${data?.limit}`,
                    method: 'GET',
                };
            },
            providesTags: ['support'],
        }),
        
        resolveQuote: builder.mutation({
            query: (id) => {
                return {
                    url: `support/update-support/${id}`,
                    method: 'PATCH',
                };
            },
            invalidatesTags: ['support'],
        }),
        deleteQuote: builder.mutation({
            query: (id) => {
                return {
                    url: `support/delete-support/${id}`,
                    method: 'DELETE',
                };
            },
            invalidatesTags: ['support'],
        }),
    }),
});

export const { 
useGetAllQuotationRequestQuery,
useResolveQuoteMutation,
useDeleteQuoteMutation
 } = newsLetterApi;
