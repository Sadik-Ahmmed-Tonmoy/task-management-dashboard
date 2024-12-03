'use client';
import { useApproveDonationMutation, useGetAllDonationQuery, useRejectDonationMutation } from '@/redux/features/donation/donationApi';
import React from 'react';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';

interface User {
    _id: string;
    email: string;
    username: string;
    role: string;
    level: number;
    myPoints: number;
    isActive: boolean;
    lastClaimDate: string;
    lastWatchedDate: string;
    lastEntryDate: string;
    createdAt: string;
    updatedAt: string;
}

interface Organization {
    _id: string;
    name: string;
    logo: string;
    banner: string;
    email: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface UserOrganizationStatusForDonation {
    _id: string;
    userId: User;
    organizationId: Organization;
    status: string;
    points: number;
    createdAt: string;
    updatedAt: string;
}

const ComponentsDashboardDonation = () => {
    const { data: getAllDonationQuery, isLoading } = useGetAllDonationQuery(undefined);
    const [approveDonationMutation] = useApproveDonationMutation();
    const [rejectDonationMutation] = useRejectDonationMutation();

    const handleApprove = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            // text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, approve it!',
        });

        if (result.isConfirmed) {
            try {
                const res = await approveDonationMutation(id).unwrap();
                if (res.success) {
                    Swal.fire('Approved!', res.message || 'Donation approved successfully', 'success');
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
    const handleReject = async (id: string) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            // text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, reject it!',
        });

        if (result.isConfirmed) {
            try {
                const res = await rejectDonationMutation(id).unwrap();
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
                            <th className="border-b px-4 py-2 text-center">Donor user Name</th>
                            <th className="border-b px-4 py-2 text-center">Organization Name</th>
                            <th className="border-b px-4 py-2 text-center">Organization Email</th>
                            <th className="border-b px-4 py-2 text-center">Point</th>
                            <th className="border-b px-4 py-2 text-center">Status</th>
                            <th className="border-b px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllDonationQuery?.data?.map((item: UserOrganizationStatusForDonation) => (
                            <tr key={item._id}>
                                <td className="border-b px-4 py-2 text-center">{item?.userId?.username}</td>
                                <td className="border-b px-4 py-2 text-center">{item.organizationId?.name}</td>
                                <td className="border-b px-4 py-2 text-center">{item.organizationId?.email}</td>
                                <td className="border-b px-4 py-2 text-center">{item?.points}</td>
                                <td className="border-b px-4 py-2 text-center">{item?.status}</td>

                                <td className="border-b px-4 py-2 text-center ">
                                    <div className='flex items-center justify-center gap-2  text-center'>

                                    {item?.status === 'pending' ? (
                                        <div className="flex flex-col gap-3 sm:flex-row">
                                            <button onClick={() => handleReject(item._id)} className="rounded bg-red-500 px-3 py-1 text-white">
                                                Reject
                                            </button>
                                            <button onClick={() => handleApprove(item._id)} className="mr-2 rounded bg-blue-500 px-3 py-1 text-white">
                                                Approve
                                            </button>
                                        </div>
                                    ) : item?.status == 'approved' ? (
                                        <></>
                                    ) : item?.status == 'rejected' ? (
                                        <button onClick={() => handleApprove(item._id)} className="mr-2 rounded bg-blue-500 px-3 py-1 text-white">
                                            Approve
                                        </button>
                                    ) : (
                                        ''
                                    )}
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

export default ComponentsDashboardDonation;
