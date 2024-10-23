'use client';
import StatusBadge from '@/app/(defaults)/components/StatusBadge';
import { useGetAllUsersQuery } from '@/redux/features/auth/authApi';
import { AudioOutlined } from '@ant-design/icons';
import type { GetProps } from 'antd';
import { Input, Modal } from 'antd';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { FaCheck, FaSearch } from 'react-icons/fa';
import ReactLoading from 'react-loading';
import { BiFilterAlt } from 'react-icons/bi';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LiaLevelUpAltSolid } from 'react-icons/lia';
import { VscDebugBreakpointLogUnverified } from 'react-icons/vsc';

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

// Zod schema for extreme validation
const formSchema = z.object({
    level: z.string().optional(),
    myPoints: z.string().optional(),
    isActive: z.boolean().optional(),
});

// Type inference for form values from the schema
type FormData = z.infer<typeof formSchema>;

const TableForAllUsers = () => {
    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [inputValue, setInputValue] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isActiveUser, setIsActiveUser] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const [queryObj, setQueryObj] = useState([
        { name: 'page', value: page },
        { name: 'limit', value: pageSize },
        { name: 'search', value: inputValue },
    ]);

    useEffect(() => {
        setQueryObj([
            { name: 'page', value: page },
            { name: 'limit', value: pageSize },
            { name: 'search', value: inputValue },
        ]);
    }, [page, pageSize, inputValue]);

    const { data, error, isLoading, isSuccess, isFetching } = useGetAllUsersQuery(queryObj);

    const [initialRecords, setInitialRecords] = useState<UserRecord[]>([]);
    const [recordsData, setRecordsData] = useState<UserRecord[]>([]);

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

    useEffect(() => {
        const data = sortBy(initialRecords, sortStatus.columnAccessor);
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    console.log(isActiveUser);
    const handleFilter = async (formData: FieldValues) => {
        // Construct the query object with form data
        const newQueryObj = [
            { name: 'page', value: page },
            { name: 'limit', value: pageSize },
            { name: 'search', value: inputValue },
            { name: 'level', value: formData.level }, // Filter field
            { name: 'myPoints', value: formData.myPoints }, // Another filter field
            { name: 'isActive', value: formData.isActive }, // Checkbox filter|
        ];

        if (formData.isActive) {
            setIsActiveUser(true);
        } else {
            setIsActiveUser(false);
        }

        // Filter out any object where value is an empty string
        const filteredQueryObj = newQueryObj.filter((item) => item.value !== '');

        // Update the queryObj state
        setQueryObj(filteredQueryObj);
        setIsModalOpen(false);
        reset();
    };
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
                    <Modal title="Filter" open={isModalOpen} onCancel={handleCancel} footer={false} className="">
                        <form className="space-y-3 dark:text-white" onSubmit={handleSubmit(handleFilter)}>
                            <div className="">
                                <label htmlFor="userLevel" className="dark:text-black">
                                    Level <span className="text-xs text-slate-400">(Number)</span>
                                </label>
                                <div className="relative text-white-dark">
                                    <input type="number" {...register('level')} placeholder="User Level" className="form-input ps-10 placeholder:text-white-dark dark:bg-white" />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <LiaLevelUpAltSolid />
                                    </span>
                                </div>
                                {errors.level && <span className="text-red-500">{errors.level.message}</span>}
                            </div>
                            <div className="">
                                <label htmlFor="myPoints" className="dark:text-black">
                                    Points <span className="text-xs text-slate-400">(Number)</span>
                                </label>
                                <div className="relative text-white-dark">
                                    <input type="number" {...register('myPoints')} placeholder="Points" className="form-input ps-10 placeholder:text-white-dark dark:bg-white" />
                                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                        <VscDebugBreakpointLogUnverified />
                                    </span>
                                </div>
                                {errors.myPoints && <span className="text-red-500">{errors.myPoints.message}</span>}
                            </div>
                            <div className="dark:text-black ">
                                <p>Show User Activity</p>
                                {/* active inactive */}
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        {isActiveUser ? <FaCheck className="" /> : <div className='p-[6.5px]'></div>}
                                        <div
                                            onClick={() => {
                                                setValue('isActive', true);
                                                setIsActiveUser(true);
                                            }}
                                            className={`rounded-md bg-green-500 px-3 py-1 text-white cursor-pointer ${isActiveUser ? 'scale-105 shadow-2xl' : ''}`}
                                        >
                                            <p>Active User</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        {isActiveUser ? <div className='p-[6.5px]'></div> : <FaCheck className="" />}
                                        <div
                                            onClick={() => {
                                                setValue('isActive', false);
                                                setIsActiveUser(false);
                                            }}
                                            className={`rounded-md bg-red-500 px-3 py-1 text-white cursor-pointer ${isActiveUser ? '' : 'scale-105 shadow-2xl'}`}	
                                        >
                                            <p>Inactive User</p>
                                        </div>
                                    </div>
                                </div>
                                {errors.isActive && <span className="text-red-500">{errors.isActive.message}</span>}
                            </div>
                            {/* <div className="flex flex-col">
                                <label htmlFor="isActive" className="whitespace-nowrap dark:text-black">
                                    Active
                                </label>
                                <input type="checkbox" {...register(`isActive`)} className="form-checkbox" />
                                {errors.isActive && <span className="text-red-500">{errors.isActive.message}</span>}
                            </div> */}

                            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                                Filter
                            </button>
                        </form>
                    </Modal>
                </div>
            </div>
            {isFetching ? (
                <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                    <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
                </div>
            ) : (
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
            )}
        </div>
    );
};

export default TableForAllUsers;
