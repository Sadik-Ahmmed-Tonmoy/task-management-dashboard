import { baseApi } from '../../api/baseApi';

const paymentApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllPaymentsHistory: builder.query({
            query: () => ({
                url: 'payment/history',
                method: 'GET',
            }),
            providesTags: ['Payment'],
        }),
        getAllPendingPayments: builder.query({
            query: () => ({
                url: 'payment',
                method: 'GET',
            }),
            providesTags: ['Payment'],
        }),
        paymentStatusApprove: builder.mutation({
            query: (id) => {
                return {
                    url: `payment/approved/${id}`,
                    method: 'POST',
                    // body: data,
                };
            },
            invalidatesTags: ['Payment'],
        }),
        paymentStatusReject: builder.mutation({
            query: (id) => {
                return {
                    url: `payment/reject/${id}`,
                    method: 'POST',
                    // body: data,
                };
            },
            invalidatesTags: ['Payment'],
        }),
        // getSingleTask: builder.query({
        //     query: (id) => ({
        //         url: `task/${id}`,
        //         method: 'GET',
        //     }),
        //     providesTags: ['Task'],
        // }),
        // createTask: builder.mutation({
        //     query: (userInfo) => {
        //         return {
        //             url: 'task/create-task',
        //             method: 'POST',
        //             body: userInfo,
        //         };
        //     },
        //     invalidatesTags: ['Task'],
        // }),
        // updateTask: builder.mutation({
        //     query: (data) => {
        //         return {
        //             url: `task/${data?.id}`,
        //             method: 'PUT',
        //             body: data,
        //         };
        //     },
        //     invalidatesTags: ['Task'],
        // }),
        // deleteTask: builder.mutation({
        //     query: (id) => {
        //         return {
        //             url: `task/${id}`,
        //             method: 'DELETE',
        //             // body: data,
        //         };
        //     },
        //     invalidatesTags: ['Task'],
        // }),
    }),
});

export const { useGetAllPaymentsHistoryQuery, useGetAllPendingPaymentsQuery, usePaymentStatusApproveMutation, usePaymentStatusRejectMutation } = paymentApi;
