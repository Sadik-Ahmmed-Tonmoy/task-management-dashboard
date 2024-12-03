'use client';
import { useApproveDonationMutation, useGetAllDonationQuery, useRejectDonationMutation } from '@/redux/features/donation/donationApi';
import { useDeleteSupportMutation, useGetAllSupportQuery, useUpdateSupportMutation } from '@/redux/features/support/supportApi';
import React from 'react';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';

interface Support {
    _id: string;
    email: string;
    status: string;
    message: string;
}

const ComponentsDashboardSupport = () => {
    const { data: getAllSupportQuery, isLoading } = useGetAllSupportQuery(undefined);
    const [updateSupportMutation] = useUpdateSupportMutation();
    const [deleteSupportMutation] = useDeleteSupportMutation();

    const handleResolve = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            // text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, resolve it!',
        });

        if (result.isConfirmed) {
            try {
                const res = await updateSupportMutation(id).unwrap();
                if (res.success) {
                    Swal.fire('Resolved!', res.message || 'Donation approved successfully', 'success');
                } else {
                    Swal.fire('Error!', 'Failed', 'error');
                }
            } catch (e) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed',
                    text: (e as any)?.data?.success === false && (e as any)?.data?.errorSources[0]?.message,
                    showConfirmButton: true,
                });
            }
        }
    };
    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!',
        });

        if (result.isConfirmed) {
            try {
                const res = await deleteSupportMutation(id).unwrap();
                if (res.success) {
                    Swal.fire('Rejected!', res.message || 'Donation rejected successfully', 'success');
                } else {
                    Swal.fire('Error!', 'Failed', 'error');
                }
            } catch (e) {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed',
                    text: (e as any)?.data?.success === false && (e as any)?.data?.errorSources[0]?.message,
                    showConfirmButton: true,
                });
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <ReactLoading type="bars" color="#4361ee" height="5%" width="5%" className="mx-auto" />
            </div>
        );
    }
    return (
        <>
            <h3 className="my-3 text-center text-3xl">Donations</h3>
            <div className="slim-scroll container mx-auto overflow-hidden overflow-x-auto">
                <table className="min-w-full border border-gray-300 bg-white dark:bg-[#121e31]">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2 text-center">Email</th>
                            <th className="border-b px-4 py-2 text-center">Status</th>
                            <th className="border-b px-4 py-2 text-center">Message</th>
                            <th className="border-b px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllSupportQuery?.data?.map((item: Support) => (
                            <tr key={item._id}>
                                <td className="border-b px-4 py-2 text-center">{item?.email}</td>
                                <td className="border-b px-4 py-2 text-center">{item.status}</td>
                                <td className="border-b px-4 py-2 text-center">{item.message}</td>

                                <td className="border-b px-4 py-2 text-center ">
                                    <div className="flex items-center justify-center gap-2  text-center">
                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <button onClick={() => handleResolve(item._id)} className="mr-2 rounded bg-blue-500 px-3 py-1 text-white">
                                                Resolve
                                            </button>
                                            <button onClick={() => handleDelete(item._id)} className="rounded bg-red-500 px-3 py-1 text-white">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default ComponentsDashboardSupport;
