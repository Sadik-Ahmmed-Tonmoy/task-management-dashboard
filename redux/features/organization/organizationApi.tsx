import { baseApi } from '../../api/baseApi';

const organizationApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllOrganization: builder.query({
            query: () => ({
                url: 'organizations/get-all-organizations',
                method: 'GET',
            }),
            providesTags: ['Organization'],
        }),
        getSingleOrganization: builder.query({
            query: (id) => ({
                url: `organizations/get-single-organization/${id}`,
                method: 'GET',
            }),
            providesTags: ['Organization'],
        }),
        createOrganization: builder.mutation({
            query: (data) => {
                return {
                    url: `organizations`,
                    method: 'POST',
                    body: data,
                };
            },
            invalidatesTags: ['Organization'],
        }),
        updateOrganization: builder.mutation({
            query: (data) => {
                return {
                    url: `organizations/${data._id}`,
                    method: 'PATCH',
                    body: data?.formDataToSend,
                };
            },
            invalidatesTags: ['Organization'],
        }),
        deleteOrganization: builder.mutation({
            query: (id) => {
                return {
                    url: `organizations/delete-organization/${id}`,
                    method: 'DELETE',
                    // body: data,
                };
            },
            invalidatesTags: ['Organization'],
        }),
    }),
});

export const { useGetAllOrganizationQuery, useGetSingleOrganizationQuery, useCreateOrganizationMutation, useUpdateOrganizationMutation, useDeleteOrganizationMutation } = organizationApi;
