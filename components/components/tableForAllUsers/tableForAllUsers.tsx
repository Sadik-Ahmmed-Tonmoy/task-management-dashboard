'use client';
import StatusBadge from '@/app/(defaults)/components/StatusBadge';
import { useGetAllUsersQuery } from '@/redux/features/auth/authApi';
import { AudioOutlined } from '@ant-design/icons';
import type { GetProps } from 'antd';
import { Input, Modal } from 'antd';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import ReactLoading from 'react-loading';
import { BiFilterAlt } from 'react-icons/bi';

interface UserRecord {
    _id: number;
    username: string;
    email: string;
    role: string;
    level: number;
    isActive: boolean;
    lastClaimDate: string;
    createdAt: string;
}

const TableForAllUsers = () => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const queryObj = [
        {
            name: 'page',
            value: page,
        },
        {
            name: 'limit',
            value: pageSize,
        },
        {
            name: 'search',
            value: inputValue,
        },
    ];
    const { data, error, isLoading, isSuccess } = useGetAllUsersQuery(queryObj);

    const [initialRecords, setInitialRecords] = useState<UserRecord[]>([]);
    const [recordsData, setRecordsData] = useState<UserRecord[]>([]);

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

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    // const randomColor = () => {
    //     const color = ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f', '#2196f3'];
    //     const random = Math.floor(Math.random() * color.length);
    //     return color[random];
    // };

    // const randomStatusColor = () => {
    //     const color = ['primary', 'secondary', 'success', 'danger', 'warning', 'info'];
    //     const random = Math.floor(Math.random() * color.length);
    //     return color[random];
    // };

    // const randomStatus = () => {
    //     const status = ['PAID', 'APPROVED', 'FAILED', 'CANCEL', 'SUCCESS', 'PENDING', 'COMPLETE'];
    //     const random = Math.floor(Math.random() * status.length);
    //     return status[random];
    // };
    // const getRandomNumber = (min: number, max: number) => {
    //     return Math.floor(Math.random() * (max - min + 1)) + min;
    // };

    // const getCountry = () => {
    //     const random = Math.floor(Math.random() * countryList.length);
    //     return countryList[random];
    // };

    // const chart_options = () => {
    //     let option = {
    //         chart: { sparkline: { enabled: true } },
    //         stroke: { curve: 'smooth', width: 2 },
    //         markers: { size: [4, 7], strokeWidth: 0 },
    //         colors: [randomColor()],
    //         grid: { padding: { top: 5, bottom: 5 } },
    //         tooltip: {
    //             x: { show: false },
    //             y: {
    //                 title: {
    //                     formatter: () => {
    //                         return '';
    //                     },
    //                 },
    //             },
    //         },
    //     };
    //     return option;
    // };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
            </div>
        );
    }

    return (
        <div className="panel mt-6">
            <div className="flex items-center justify-between">
                <div></div>
                <h3 className="my-3 text-center text-3xl">All Users</h3>
                <div className="flex items-center gap-3">
                    {' '}
                    <Input
                        placeholder=""
                        className="dark:bg-[#1a2941] dark:text-white dark:placeholder:text-red-500"
                        style={{ width: 200 }}
                        value={inputValue}
                        onChange={(event) => setInputValue(event.target.value)}
                        suffix={
                            <FaSearch
                                style={{
                                    fontSize: 16,
                                }}
                                className="dark:text-white"
                            />
                        }
                    />
                    <div>
                        <BiFilterAlt size={25} onClick={showModal} className="cursor-pointer" />
                    </div>
                    <Modal title="Basic Modal" open={isModalOpen} onCancel={handleCancel} footer={false}>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                        <p>Some contents...</p>
                    </Modal>
                </div>
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
                                accessor: 'username',
                                title: 'User Name',
                                sortable: false,
                                render: ({ username }: { username: string }) => (
                                    <div className="flex items-center gap-2">
                                        <div className="font-semibold">{username}</div>
                                    </div>
                                ),
                            },

                            {
                                accessor: 'email',
                                title: 'Email',
                                sortable: false,
                                render: (record: UserRecord) => (
                                    <a href={`mailto:${record.email}`} className="text-primary hover:underline">
                                        {record.email}
                                    </a>
                                ),
                            },
                            {
                                accessor: 'role',
                                title: 'Role',
                                sortable: false,
                                render: (record: UserRecord) => (
                                    <div className="flex items-center gap-2">
                                        <div>{record?.role}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'level',
                                title: 'Level',
                                sortable: false,
                                render: (record: UserRecord) => (
                                    <div className="flex items-center gap-2">
                                        <div>{record?.level}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'isActive',
                                title: 'Active',
                                sortable: false,
                                render: (record: UserRecord) => (
                                    <div className="flex items-center gap-2">
                                        <StatusBadge isActive={record?.isActive} />
                                    </div>
                                ),
                            },
                            {
                                accessor: 'lastClaimDate',
                                title: 'Last Claim Date',
                                sortable: false,
                                render: (record: UserRecord) => (
                                    <div className="flex items-center gap-2">
                                        <div>{record?.lastClaimDate}</div>
                                    </div>
                                ),
                            },
                            {
                                accessor: 'createdAt',
                                title: 'Created At',
                                sortable: false,
                                render: (record: UserRecord) => (
                                    <div className="flex items-center gap-2">
                                        <div>{record?.createdAt}</div>
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

export default TableForAllUsers;
