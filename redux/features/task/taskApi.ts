import { baseApi } from '../../api/baseApi';

const taskApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllTasks: builder.query({
            query: () => ({
                url: 'task',
                method: 'GET',
            }),
            providesTags: ['Task'],
        }),
        getSingleTask: builder.query({
            query: (id) => ({
                url: `task/${id}`,
                method: 'GET',
            }),
            providesTags: ['Task'],
        }),
        createTask: builder.mutation({
            query: (userInfo) => {
                return {
                    url: 'task/create-task',
                    method: 'POST',
                    body: userInfo,
                };
            },
            invalidatesTags: ['Task'],
        }),
        updateTask: builder.mutation({
            query: (data) => {
                return {
                    url: `task/${data?.id}`,
                    method: 'PUT',
                    body: data,
                };
            },
            invalidatesTags: ['Task'],
        }),
        deleteTask: builder.mutation({
            query: (id) => {
                console.log("id", id);
                return {
                    url: `task/${id}`,
                    method: 'DELETE',
                    // body: data,
                };
            },
            invalidatesTags: ['Task'],
        }),
    }),
});

export const {  useGetAllTasksQuery, useGetSingleTaskQuery, useCreateTaskMutation, useUpdateTaskMutation, useDeleteTaskMutation } = taskApi;
