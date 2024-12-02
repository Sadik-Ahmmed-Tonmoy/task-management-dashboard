import { baseApi } from '../../api/baseApi';

type TQueryParam = {
    name: string;
    value: any;
};

const newsLetterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllNewsLetterSubscription: builder.query({
            query: (data) => {
                return {
                    url: `subScriptions?page=${data?.page}&limit=${data?.limit}`,
                    method: 'GET',
                };
            },
            providesTags: ['NewsLetter'],
        }),
        
        sendMailToAllUsers: builder.mutation({
            query: (data) => {
                return {
                    url: 'subScriptions/send-mail',
                    method: 'POST',
                    body: data,
                };
            },
            invalidatesTags: ['NewsLetter'],
        }),
    }),
});

export const { 
useGetAllNewsLetterSubscriptionQuery,
useSendMailToAllUsersMutation
 } = newsLetterApi;
