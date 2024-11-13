import { baseApi } from '../../api/baseApi';

const couponApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // getAllPaymentsHistory: builder.query({
        //     query: () => ({
        //         url: 'payment/history',
        //         method: 'GET',
        //     }),
        //     providesTags: ['Payment'],
        // }),
        getAllCoupon: builder.query({
            query: () => ({
                url: 'admin/coupons',
                method: 'GET',
            }),
            providesTags: ['Coupon'],
        }),
        createCoupon: builder.mutation({
            query: (data) => {
                return {
                    url: `admin/create-coupon`,
                    method: 'POST',
                    body: data,
                };
            },
            invalidatesTags: ['Coupon'],
        }),
        updateCoupon: builder.mutation({
            query: (data) => {
                return {
                    url: `admin/update-coupon/${data._id}`,
                    method: 'PATCH',
                    body: data,
                };
            },
            invalidatesTags: ['Coupon'],
        }),
        deleteCoupon: builder.mutation({
            query: (id) => {
                return {
                    url: `admin/delete-coupon/${id}`,
                    method: 'DELETE',
                    // body: data,
                };
            },
            invalidatesTags: ['Coupon'],
        }),
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

export const { useGetAllCouponQuery, useCreateCouponMutation, useUpdateCouponMutation, useDeleteCouponMutation } = couponApi;
