
import { baseApi } from "../../api/baseApi";

const manageTrainerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTrainers: builder.query({
            query: () => ({
                url: "user/trainer",
                method: "GET",
            }),
            providesTags: ["Trainers"],
        }),
        getSingleUser: builder.query({
            query: (id) => ({
                url: `user/${id}`,
                method: "GET",
            }),
            // providesTags: ["Trainers"],
        }),
        addTrainer: builder.mutation({
            query: (data) => {
                return {
                    url: `user/create-trainer`,
                    method: "POST",
                    body: data,
                }
            },
            invalidatesTags: ["Trainers"],
        }),
        updateTrainer: builder.mutation({
            query: (data) => {
                return {
                    url: `user/${data.id}`,
                    method: "PATCH",
                    body: data,
                }
            },
            invalidatesTags: ["Trainers"],
        }),
        deleteTrainer: builder.mutation({
            query: (id) => {
                return {
                    url: `user/${id}`,
                    method: "DELETE",
                    // body: data,
                }
            },
            invalidatesTags: ["Trainers"],
        }),
    }),
});

export const { useGetAllTrainersQuery, useGetSingleUserQuery, useAddTrainerMutation, useUpdateTrainerMutation, useDeleteTrainerMutation} = manageTrainerApi;
