'use client';
import StatusBadge from '@/app/(defaults)/components/StatusBadge';
import { useGetAllPaymentsHistoryQuery, usePaymentStatusApproveMutation, usePaymentStatusRejectMutation } from '@/redux/features/payment/paymentApi';
import { Tooltip } from 'antd';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import moment from 'moment';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IoIosCheckmarkCircleOutline, IoMdCloseCircleOutline } from 'react-icons/io';
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

const ComponentsDashboardAllPayment = () => {
    // const { data, isLoading } = useGetAllPaymentsHistoryQuery(undefined);
    const [paymentStatusApproveMutation] = usePaymentStatusApproveMutation();
    const [paymentStatusRejectMutation] = usePaymentStatusRejectMutation();

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
    const handleRejectPayment = async (id: string) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, reject it!',
            });

            if (result.isConfirmed) {
                const res = await paymentStatusRejectMutation(id).unwrap();
                console.log(res);
                await Swal.fire({
                    title: 'Rejected!',
                    text: res?.message,
                    icon: 'success',
                });
            }
        } catch (error) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Failed to update task',
                text: (error as any)?.data?.success === false && (error as any)?.data?.errorSources[0]?.message,
                showConfirmButton: true,
            });
        }
    };

    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);

    const { data, error, isLoading, isSuccess } = useGetAllPaymentsHistoryQuery({ page, pageSize });

    const [initialRecords, setInitialRecords] = useState<TPaymentRequest[]>([]);
    const [recordsData, setRecordsData] = useState<TPaymentRequest[]>([]);

    console.log('recordsData', recordsData);
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // This effect will update the `initialRecords` and `recordsData` only when the data is available
    useEffect(() => {
        if (isSuccess && data?.data) {
            setInitialRecords(data?.data);
            setRecordsData(data?.data); // Update records based on pageSize
        }
    }, [data, pageSize, isLoading]);

    useEffect(() => {
        setPage(1);
    }, [pageSize]);

    // useEffect(() => {
    //     const from = (page - 1) * pageSize;
    //     const to = from + pageSize;
    //     setRecordsData([...initialRecords.slice(from, to)]);
    // }, [page, pageSize, initialRecords]);

    // useEffect(() => {
    //     const data = sortBy(initialRecords, sortStatus.columnAccessor);
    //     setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
    //     setPage(1);
    // }, [sortStatus]);

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
            </div>
        );
    }

    return (
        // <div>
        //     <div className="flex items-center justify-between">
        //         <div></div>
        //         <h3 className="my-3 text-center text-3xl">All Payments</h3>

        //          <Link href={"/payment/pending"}>
        //          <button className="btn-primary mr-2 rounded px-4 py-2 cursor-pointer text-white">Pending Payments</button>
        //          </Link>

        //     </div>
        //     <table className="min-w-full border-collapse border">
        //         <thead>
        //             <tr className="border-b bg-gray-100">
        //                 <th className="p-4 text-left">PayPal Email</th>
        //                 <th className="p-4 text-left">Points</th>
        //                 <th className="p-4 text-left">Amount ($)</th>
        //                 <th className="p-4 text-left">Status</th>
        //                 <th className="p-4 text-left">Created At</th>
        //                 <th className="p-4 text-left">Actions</th>
        //             </tr>
        //         </thead>
        //         <tbody>
        //             {data?.data?.length > 0 &&
        //                 data?.data.map((request: TPaymentRequest) => (
        //                     <tr key={request._id} className="border-b">
        //                         <td className="p-4">{request.paypalEmail}</td>
        //                         <td className="p-4">{request.points}</td>
        //                         <td className="p-4">${request.amount}</td>
        //                         <td className="p-4">
        //                             <StatusBadge status={request.status} />
        //                         </td>
        //                         <td className="p-4">
        //                             {new Date(request.createdAt).toLocaleDateString()} {new Date(request.createdAt).toLocaleTimeString()}
        //                         </td>
        //                         <td className="p-4">
        //                             <button onClick={() => handleApprovePayment(request?._id)} className="mr-2 rounded bg-green-500 px-4 py-2 text-white">
        //                                 Approve
        //                             </button>
        //                             <button onClick={() => handleRejectPayment(request?._id)} className="rounded bg-red-500 px-4 py-2 text-white">Reject</button>
        //                         </td>
        //                     </tr>
        //                 ))}
        //         </tbody>
        //     </table>
        // </div>
        <div className="panel mt-6">
            <div className="flex items-center justify-between">
                <div></div>
                <h3 className="my-3 text-center text-3xl">All Payments</h3>

                <Link href={'/payment/pending'}>
                    <button className="btn-primary mr-2 cursor-pointer rounded px-4 py-2 text-white">Pending Payments</button>
                </Link>
            </div>
            <div className="datatables">
                {isSuccess && (
                    <DataTable
                        noRecordsText="No results match your search query"
                        highlightOnHover
                        className="table-hover whitespace-nowrap"
                        records={recordsData}
                        columns={[
                            {
                                accessor: 'paypalEmail',
                                title: 'Paypal Email',
                                sortable: false,

                                render: (record: TPaymentRequest) => (
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">{record.paypalEmail}</div>
                                    </div>
                                ),
                            },

                            {
                                accessor: 'points',
                                title: 'Points',
                                sortable: false,
                                render: (record: TPaymentRequest) => (
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">{record.points}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'amount',
                                title: 'amount',
                                sortable: false,
                                render: (record: TPaymentRequest) => (
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">{record.amount}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'status',
                                title: 'Status',
                                sortable: false,
                                render: (record: TPaymentRequest) => (
                                    <div className="flex items-center gap-2">
                                        {/* <div className="font-semibold">{record.status}</div> */}
                                        <StatusBadge status={record.status} />
                                    </div>
                                ),
                            },
                            {
                                accessor: 'createdAt',
                                title: 'Created At',
                                sortable: false,
                                render: (record: TPaymentRequest) => (
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">{moment(record.createdAt).format('MMMM Do, YYYY [at] h:mm A')}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'action',
                                title: 'Action',
                                titleClassName: '!text-center',
                                render: (record: TPaymentRequest) => (
                                    <div className="mx-auto flex w-max items-center gap-4">
                                        <Tooltip title="Approve">
                                            <IoIosCheckmarkCircleOutline onClick={() => handleApprovePayment(record?._id)} size={30} className="cursor-pointer text-green-500" />
                                        </Tooltip>

                                        <Tooltip title="Reject">
                                            <IoMdCloseCircleOutline size={30} onClick={() => handleRejectPayment(record?._id)} className="cursor-pointer text-red-500" />
                                        </Tooltip>
                                    </div>
                                ),
                            },
                        ]}
                        totalRecords={data?.meta?.total}
                        recordsPerPage={pageSize}
                        page={page}
                        onPageChange={(p) => setPage(p)}
                        recordsPerPageOptions={PAGE_SIZES}
                        onRecordsPerPageChange={setPageSize}
                        sortStatus={sortStatus}
                        onSortStatusChange={setSortStatus}
                        minHeight={200}
                        paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
                    />
                )}
            </div>
        </div>
    );
};

export default ComponentsDashboardAllPayment;
