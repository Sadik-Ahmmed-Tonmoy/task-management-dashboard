'use client';
import StatusBadge from '@/app/(defaults)/components/StatusBadge';
import { useGetAllPendingPaymentsQuery, usePaymentStatusApproveMutation } from '@/redux/features/payment/paymentApi';
import Link from 'next/link';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';

interface TPaymentRequest {
    _id: string;
    userId: string;
    points: number;
    amount: number;
    paypalEmail: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const ComponentsDashboardAllPendingPayment = () => {
    const { data, isLoading } = useGetAllPendingPaymentsQuery(undefined);
    const [paymentStatusApproveMutation] = usePaymentStatusApproveMutation();

    const handleApprovePayment = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, approve it!',
            });

            if (result.isConfirmed) {
                const res = await paymentStatusApproveMutation(id).unwrap();
                console.log(res);
                await Swal.fire({
                    title: 'Approved!',
                    text: res?.message,
                    icon: 'success',
                });
            }
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Failed to create task',
                text: (error as any)?.data?.success === false && (error as any)?.data?.errorSources[0]?.message,
                showConfirmButton: true,
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between">
                <div></div>
                <h3 className="my-3 text-center text-3xl">Pending Payments</h3>

                <Link href={'/payment'}>
                    <button className="btn-primary mr-2 cursor-pointer rounded px-4 py-2 text-white">All Payments</button>
                </Link>
            </div>
            <table className="min-w-full border-collapse border">
                <thead>
                    <tr className="border-b bg-gray-100">
                        <th className="p-4 text-left">PayPal Email</th>
                        <th className="p-4 text-left">Points</th>
                        <th className="p-4 text-left">Amount ($)</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Created At</th>
                        <th className="p-4 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.data?.length > 0 &&
                        data?.data.map((request: TPaymentRequest) => (
                            <tr key={request._id} className="border-b">
                                <td className="p-4">{request.paypalEmail}</td>
                                <td className="p-4">{request.points}</td>
                                <td className="p-4">${request.amount}</td>
                                <td className="p-4">
                                    <StatusBadge status={request.status} />
                                </td>
                                <td className="p-4">
                                    {new Date(request.createdAt).toLocaleDateString()} {new Date(request.createdAt).toLocaleTimeString()}
                                </td>
                                <td className="p-4">
                                    <button onClick={() => handleApprovePayment(request?._id)} className="mr-2 rounded bg-green-500 px-4 py-2 text-white">
                                        Approve
                                    </button>
                                    <button className="rounded bg-red-500 px-4 py-2 text-white">Reject</button>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

export default ComponentsDashboardAllPendingPayment;
