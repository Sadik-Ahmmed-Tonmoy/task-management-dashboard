import { baseApi } from '../../api/baseApi';

const donationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllDonation: builder.query({
            query: () => ({
                url: 'admin/get-all-donation',
                method: 'GET',
            }),
            providesTags: ['Donation'],
        }),
        approveDonation: builder.mutation({
            query: (id) => {
                return {
                    url: `admin/send-notification/${id}`,
                    method: 'POST',
                    // body: data,
                };
            },
            invalidatesTags: ['Donation'],
        }),
        rejectDonation: builder.mutation({
            query: (id) => {
                return {
                    url: `admin/reject/${id}`,
                    method: 'PATCH',
                    // body: data,
                };
            },
            invalidatesTags: ['Donation'],
        }),
    }),
});

export const { useGetAllDonationQuery, useApproveDonationMutation, useRejectDonationMutation } = donationApi;
