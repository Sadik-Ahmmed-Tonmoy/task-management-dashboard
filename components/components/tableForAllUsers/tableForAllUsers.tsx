'use client';
import StatusBadge from '@/app/(defaults)/components/StatusBadge';
import MyFormCheckboxHTML from '@/components/MyForm/MyFormCheckboxHTML/MyFormCheckboxHTML';
import MyFormInputHTML from '@/components/MyForm/MyFormInput/MyFormInputHTML';
import MyFormWrapper from '@/components/MyForm/MyFormWrapper/MyFormWrapper';
import { useDeleteUserMutation, useGetAllUsersQuery, useUpdateUserMutation } from '@/redux/features/auth/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Modal } from 'antd';
import sortBy from 'lodash/sortBy';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { BiFilterAlt } from 'react-icons/bi';
import { FaSearch } from 'react-icons/fa';
import { LiaLevelUpAltSolid } from 'react-icons/lia';
import { PiCheckFatLight } from 'react-icons/pi';
import { VscDebugBreakpointLogUnverified } from 'react-icons/vsc';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';
import { z } from 'zod';

type UserRecord = {
    _id: number;
    username: string;
    email: string;
    role: string;
    level: number;
    myPoints: number;
    isActive: boolean;
    lastClaimDate: string;
    createdAt: string;
};

const userValidationSchema = z.object({
    // _id: z.number({
    //     required_error: '_id is required',
    // }),
    // username: z
    //     .string({
    //         required_error: 'Username is required',
    //     })
    //     .nonempty('Username cannot be empty'),
    // email: z
    //     .string({
    //         required_error: 'Email is required',
    //     })
    //     .email('Invalid email format'),
    // role: z
    //     .string({
    //         required_error: 'Role is required',
    //     })
    //     .nonempty('Role cannot be empty'),
    level: z
        .any({
            required_error: 'Level is required',
        })
        .transform((value) => {
            if (value === null || value === undefined || value === '') {
                return undefined; // Explicitly handle null, undefined, or empty string
            }
            const num = Number(value); // Convert the input to a number
            return Number.isNaN(num) ? undefined : num; // Return undefined if conversion fails
        })
        .refine((value) => typeof value === 'number' && Number.isInteger(value) && value >= 0, {
            message: 'Level must be a non-negative integer',
        }),

    myPoints: z
        .any({
            required_error: 'Points are required',
        })
        .transform((value) => {
            if (value === null || value === undefined || value === '') {
                return undefined; // Ensure null, undefined, or empty string triggers an error
            }
            const num = Number(value); // Convert the input to a number
            return Number.isNaN(num) ? undefined : num; // Return undefined if conversion fails
        })
        .refine((value) => typeof value === 'number' && Number.isInteger(value) && value >= 0, {
            message: 'Points must be a non-negative integer',
        }),

    isActive: z.boolean({
        required_error: 'Active status is required',
    }),
});

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
    const [isUpdateUser, setIsUpdateUser] = useState(false);
    const [isActiveUser, setIsActiveUser] = useState(true);
    const [updateId, setUpdateId] = useState<number | null>(null);
    const [selectedItemForUpdate, setSelectedItemForUpdate] = useState<Partial<UserRecord>>({});
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const showModal = () => {
        setIsModalOpen(true);
        setValue('isActive', true);
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
    const [updateUserMutation] = useUpdateUserMutation();
    const [deleteUserMutation] = useDeleteUserMutation();
    const [initialRecords, setInitialRecords] = useState<UserRecord[]>([]);
    const [recordsData, setRecordsData] = useState<UserRecord[]>([]);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

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
        // reset();
    };

    const handleEditSubmit = async (formData: FieldValues, reset: any) => {
        console.log(formData);
        setIsModalOpen(false);
        reset();
        try {
            const res = await updateUserMutation({ _id: updateId, points: formData?.myPoints, level: formData?.level, isActive: formData?.isActive }).unwrap();
            if (res?.success) {
                Swal.fire('Success!', res?.message, 'success');
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
    };

    const handleDeleteUser = async (id: number) => {
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
                const res = await deleteUserMutation(id).unwrap();
                if (res.success) {
                    Swal.fire('Deleted!', res.message || 'Deleted successfully', 'success');
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

    const defaultValues = {
        // _id: selectedItemForUpdate?._id || 0,
        // username: selectedItemForUpdate?.username || '',
        // email: selectedItemForUpdate?.email || '',
        // role: selectedItemForUpdate?.role || '',
        level: selectedItemForUpdate?.level || 0,
        myPoints: selectedItemForUpdate?.myPoints || 0,
        isActive: selectedItemForUpdate?.isActive ?? false,
        // lastClaimDate: selectedItemForUpdate?.lastClaimDate || '',
        // createdAt: selectedItemForUpdate?.createdAt || '',
    };

    useEffect(() => {
        if (updateId && data?.data) {
            const selectedItem = data?.data.find((c: UserRecord) => c._id === updateId);
            if (selectedItem) {
                setSelectedItemForUpdate(selectedItem);
            }
        }
    }, [updateId, data?.data]);

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
            </div>
        );
    }

    return (
        <>
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
                            <BiFilterAlt
                                size={25}
                                onClick={() => {
                                    setIsModalOpen(true);
                                    setValue('isActive', true);
                                    setIsUpdateUser(false);
                                }}
                                className="cursor-pointer"
                            />
                        </div>
                        <Modal title="Filter" open={isModalOpen} onCancel={handleCancel} footer={false} className="">
                            {isUpdateUser ? (
                                <MyFormWrapper
                                    key={`edit-${updateId}-${JSON.stringify(selectedItemForUpdate)}`} // Use `key` to force re-render
                                    onSubmit={handleEditSubmit}
                                    validationSchema={userValidationSchema} // Use the user validation schema
                                    defaultValues={defaultValues} // Pass pre-filled values for editing
                                    className="mx-auto mb-4 mt-8 flex max-w-xl flex-col gap-3"
                                >
                                    {/* <MyFormInputHTML name="username" label="Username" placeholder="Enter Username" /> */}
                                    {/* <MyFormInputHTML name="email" type="email" label="Email" placeholder="Enter Email Address" /> */}
                                    {/* <MyFormInputHTML name="role" label="Role" placeholder="Enter Role" /> */}
                                    <MyFormInputHTML name="level" type="number" label="Level (Number)" placeholder="Enter User Level" />
                                    <MyFormInputHTML name="myPoints" type="number" label="Points (Number)" placeholder="Enter Points" />

                                    <MyFormCheckboxHTML
                                        name="isActive"
                                        label="Is Active"
                                        parentClassName=""
                                        labelClassName="text-sm font-medium text-gray-700 pt-1"
                                        inputClassName="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />

                                    <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white">
                                        Update User
                                    </button>
                                </MyFormWrapper>
                            ) : (
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
                                                {isActiveUser ? <PiCheckFatLight className="" /> : <div className="p-[6.5px]"></div>}
                                                <div
                                                    onClick={() => {
                                                        setValue('isActive', true);
                                                        setIsActiveUser(true);
                                                    }}
                                                    className={`cursor-pointer rounded-md bg-green-500 px-3 py-1 text-white ${isActiveUser ? 'scale-110 shadow-2xl' : ''}`}
                                                >
                                                    <p>Active User</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-1">
                                                {isActiveUser ? <div className="p-[6.5px]"></div> : <PiCheckFatLight className="" />}
                                                <div
                                                    onClick={() => {
                                                        setValue('isActive', false);
                                                        setIsActiveUser(false);
                                                    }}
                                                    className={`cursor-pointer rounded-md bg-red-500 px-3 py-1 text-white ${isActiveUser ? '' : 'scale-110 shadow-2xl'}`}
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
                            )}
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
                                        accessor: 'myPoints',
                                        title: 'Point',
                                        sortable: false,
                                        render: (record: UserRecord) => (
                                            <div className="flex items-center gap-2">
                                                <div>{record?.myPoints}</div>
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
                                        accessor: '_id',
                                        title: 'Action',
                                        sortable: false,
                                        render: (record: UserRecord) => (
                                            <div className="flex items-center gap-2">
                                                <button
                                                    className="rounded-md bg-green-500 px-2 py-1 text-white"
                                                    onClick={() => {
                                                        setUpdateId(record?._id);
                                                        setIsModalOpen(true);
                                                        setIsUpdateUser(true);
                                                    }}
                                                >
                                                    Edit
                                                </button>

                                                <button className="rounded-md bg-red-500 px-2 py-1 text-white" onClick={() => handleDeleteUser(record?._id)}>
                                                    Delete
                                                </button>
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
        </>
    );
};

export default TableForAllUsers;
