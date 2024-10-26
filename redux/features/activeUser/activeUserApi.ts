import { TQueryParam } from '@/types/types';
import { baseApi } from '../../api/baseApi';

const activeUserApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDailyActiveUser: builder.query({
            query: (query) => {
                const params = new URLSearchParams();

                if (query) {
                    query.forEach((item: TQueryParam) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: `admin/daily`,
                    method: 'GET',
                    params: params,
                };
            },
            providesTags: ['ActiveUser'],
        }),
        getWeeklyActiveUser: builder.query({
            query: (query) => {
                const params = new URLSearchParams();

                if (query) {
                    query.forEach((item: TQueryParam) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: `admin/weekly`,
                    method: 'GET',
                    params: params,
                };
            },
            providesTags: ['ActiveUser'],
        }),
        getMonthlyActiveUser: builder.query({
            query: (query) => {
                const params = new URLSearchParams();

                if (query) {
                    query.forEach((item: TQueryParam) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: `admin/monthly`,
                    method: 'GET',
                    params: params,
                };
            },
            providesTags: ['ActiveUser'],
        }),
       
        // getAllPendingPayments: builder.query({
        //     query: () => ({
        //         url: 'payment',
        //         method: 'GET',
        //     }),
        //     providesTags: ['Payment'],
        // }),
        // paymentStatusApprove: builder.mutation({
        //     query: (id) => {
        //         return {
        //             url: `payment/approved/${id}`,
        //             method: 'POST',
        //             // body: data,
        //         };
        //     },
        //     invalidatesTags: ['Payment'],
        // }),
        // paymentStatusReject: builder.mutation({
        //     query: (id) => {
        //         return {
        //             url: `payment/reject/${id}`,
        //             method: 'POST',
        //             // body: data,
        //         };
        //     },
        //     invalidatesTags: ['Payment'],
        // }),
    }),
});

export const { useGetDailyActiveUserQuery, useGetWeeklyActiveUserQuery, useGetMonthlyActiveUserQuery } = activeUserApi;
