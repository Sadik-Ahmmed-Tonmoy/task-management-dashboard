import { TQueryParam } from '@/types/types';
import { baseApi } from '../../api/baseApi';

const statisticsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getDailyStatistics: builder.query({
            query: (query) => {
                const params = new URLSearchParams();

                if (query) {
                    query.forEach((item: TQueryParam) => {
                        params.append(item.name, item.value as string);
                    });
                }
                return {
                    url: `statistics/daily`,
                    method: 'GET',
                    params: params,
                };
            },
            providesTags: ['Statistics'],
        }),
        getWeeklyStatistics: builder.query({
            query: () => {
                return {
                    url: `statistics/weekly`,
                    method: 'GET',
                };
            },
            providesTags: ['Statistics'],
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

export const { useGetDailyStatisticsQuery, useGetWeeklyStatisticsQuery } = statisticsApi;
