import { baseApi } from '../../api/baseApi';

type TQueryParam = {
    name: string;
    value: any;
};

const blogApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllBlogs: builder.query({
            query: (data) => {
                return {
                    url: `blog?page=${data?.page}&limit=${data?.limit}`,
                    method: 'GET',
                };
            },
            providesTags: ['Blog'],
        }),
        getSingleBlog: builder.query({
            query: (id) => {
                return {
                    url: `blog/${id}`,
                    method: 'GET',
                };
            },
            providesTags: ['Blog'],
        }),

        createBlog: builder.mutation({
            query: (data) => {
                return {
                    url: 'blog/create',
                    method: 'POST',
                    body: data,
                };
            },
            invalidatesTags: ['Blog'],
        }),

        updateBlog: builder.mutation({
            query: (data) => {
                return {
                    url:    `blog/update/${data?.id}`,
                    method: 'PUT',
                    body: data?.formData,
                };
            },
            invalidatesTags: ['Blog'],
        }),
    }),
});

export const { 
useGetAllBlogsQuery,
useGetSingleBlogQuery,
useCreateBlogMutation,
useUpdateBlogMutation
 } = blogApi;
