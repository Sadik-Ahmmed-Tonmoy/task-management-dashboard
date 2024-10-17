
import { baseApi } from "../../api/baseApi";

const manageTraineeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // getAllTrainers: builder.query({
        //     query: () => ({
        //         url: "user/trainer",
        //         method: "GET",
        //     }),
        //     providesTags: ["Trainers"],
        // }),
        // getSingleUser: builder.query({
        //     query: (id) => ({
        //         url: `user/${id}`,
        //         method: "GET",
        //     }),
        //     // providesTags: ["Trainers"],
        // }),
        enrollToClass: builder.mutation({
            query: (data) => {
                return {
                    url: `class/${data.id}/enroll`,
                    method: "POST",
                    body: data,
                }
            },
            invalidatesTags: ["Classes"],
        }),
        removeTraineeFromClass: builder.mutation({
            query: (data) => {
                return {
                    url: `class/${data.id}/remove`,
                    method: "POST",
                    body: data,
                }
            },
            invalidatesTags: ["Classes"],
        }),
        // updateTrainer: builder.mutation({
        //     query: (data) => {
        //         return {
        //             url: `user/${data.id}`,
        //             method: "PATCH",
        //             body: data,
        //         }
        //     },
        //     invalidatesTags: ["Trainers"],
        // }),
        // deleteTrainer: builder.mutation({
        //     query: (id) => {
        //         return {
        //             url: `user/${id}`,
        //             method: "DELETE",
        //             // body: data,
        //         }
        //     },
        //     invalidatesTags: ["Trainers"],
        // }),
    }),
});

export const { useEnrollToClassMutation , useRemoveTraineeFromClassMutation} = manageTraineeApi;
