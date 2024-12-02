'use client';
import { useDeleteQuoteMutation, useGetAllQuotationRequestQuery, useResolveQuoteMutation } from '@/redux/features/quoteOrSupport/quoteOrSupportApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { isNonEmptyArray } from '@/utils/isNonEmptyArray';
import { Pagination, PaginationProps, Select } from 'antd';
import { useState } from 'react';

const AllQuotation = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [status, setStatus] = useState('pending');

    const { data: getAllQuotationRequest } = useGetAllQuotationRequestQuery({ status, page, limit });
    const [resolveQuoteMutation] = useResolveQuoteMutation();
    const [deleteQuoteMutation] = useDeleteQuoteMutation();

    const handleSubmitResolve = async (id: number) => {
        try {
            const res = await handleAsyncWithToast(
                async () => {
                    // Replace this with your actual mutation or API call
                    return resolveQuoteMutation(id); // Or your custom mutation to handle form data
                },
                'Updating...',
                'Update successful!',
                'Update failed. Please try again.'
            );

            // Check if submission was successful
            if (res?.data?.success) {
                // reset();
                // setContent('');
                // router.push('/blog');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleDeleteQuote = async (id: number) => {
        try {
            const res = await handleAsyncWithToast(
                async () => {
                    // Replace this with your actual mutation or API call
                    return deleteQuoteMutation(id); // Or your custom mutation to handle form data
                },
                'Updating...',
                'Update successful!',
                'Update failed. Please try again.'
            );

            // Check if submission was successful
            if (res?.data?.success) {
                // reset();
                // setContent('');
                // router.push('/blog');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleChange = (value: string) => {
        setStatus(value);
    };

    const onChange: PaginationProps['onChange'] = (page) => {
        setPage(page);
    };

    if (getAllQuotationRequest?.isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
            <h4 className="text-center text-3xl">All Quote</h4>
            <div className="my-3 flex justify-end ">
                <Select
                    defaultValue={'pending'}
                    style={{ width: 120 }}
                    onChange={handleChange}
                    options={[
                        { value: 'pending', label: 'Pending' },
                        { value: 'resolved', label: 'Resolved' },
                    ]}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Email</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Phone</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Message</th>
                            <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Created At</th>
                            {status == 'resolved' ? null : <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Action</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {isNonEmptyArray(getAllQuotationRequest?.data) &&
                            getAllQuotationRequest?.data?.map((item: any) => (
                                <tr key={item._id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2 text-sm text-gray-800">{item.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{item.email}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{item.phone}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{item.status}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{item.message}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{new Date(item.createdAt).toLocaleString()}</td>

                                    {status == 'resolved' ? null : (
                                        <td className="flex items-center gap-3 px-4 py-2 text-sm text-gray-800">
                                            <button onClick={() => handleSubmitResolve(item?._id)} className="rounded bg-green-400 px-3 py-2 text-white">
                                                Resolved
                                            </button>
                                            <button onClick={() => handleDeleteQuote(item?._id)} className="rounded bg-red-500 px-3 py-2 text-white">
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {getAllQuotationRequest?.meta?.total < 1 && <p className="text-center text-lg text-red-500">No Data Found</p>}
            <div className="my-3 flex justify-center">
                <Pagination current={page} onChange={onChange} total={getAllQuotationRequest?.meta?.total} />
            </div>
        </div>
    );
};

export default AllQuotation;
