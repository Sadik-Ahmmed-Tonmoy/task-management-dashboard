import { TQueryParam } from '@/types/types';
import { baseApi } from '../../api/baseApi';

const pointsDistributionApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPointsDistribution: builder.query({
            query: () => {
                return {
                    url: `admin/point-distribution`,
                    method: 'GET',
                };
            },
            // providesTags: ['Statistics'],
        }),
        // getWeeklyStatistics: builder.query({
        //     query: (query) => {
        //         const params = new URLSearchParams();

        //         if (query) {
        //             query.forEach((item: TQueryParam) => {
        //                 params.append(item.name, item.value as string);
        //             });
        //         }
        //         return {
        //             url: `statistics/weekly`,
        //             method: 'GET',
        //             params: params,
        //         };
        //     },
        //     providesTags: ['Statistics'],
        // }),
        // getMonthlyStatistics: builder.query({
        //     query: (query) => {
        //         const params = new URLSearchParams();

        //         if (query) {
        //             query.forEach((item: TQueryParam) => {
        //                 params.append(item.name, item.value as string);
        //             });
        //         }
        //         return {
        //             url: `statistics/monthly`,
        //             method: 'GET',
        //             params: params,
        //         };
        //     },
        //     providesTags: ['Statistics'],
        // }),
       
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

export const { useGetPointsDistributionQuery } = pointsDistributionApi;
