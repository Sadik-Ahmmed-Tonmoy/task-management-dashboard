
import { baseApi } from "../../api/baseApi";

const manageTrainerApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllClasses: builder.query({
            query: () => ({
                url: "class",
                method: "GET",
            }),
            providesTags: ["Classes"],
        }),
        // getSingleUser: builder.query({
        //     query: (id) => ({
        //         url: `user/${id}`,
        //         method: "GET",
        //     }),
        //     // providesTags: ["Trainers"],
        // }),
        addClass: builder.mutation({
            query: (data) => {
                return {
                    url: `class`,
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
        deleteClass: builder.mutation({
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

export const { useGetAllClassesQuery, useAddClassMutation} = manageTrainerApi;
