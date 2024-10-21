'use client';
import { useDeleteTaskMutation, useGetAllTasksQuery } from '@/redux/features/task/taskApi';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { GrUpdate } from 'react-icons/gr';
import { MdDeleteOutline } from 'react-icons/md';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';

interface TStep {
    stepNumber: number;
    description: string;
    isCompleted: boolean;
}

interface TTask {
    _id: string;
    avatar: string;
    category: string;
    title: string;
    subTitle: string;
    points: number;
    detail: string;
    userLevel: number;
    steps: TStep[];
    createdAt: string;
    updatedAt: string;
}

const ComponentsDashboardAllTask = () => {
    const { data: trainersData, isError, error, isLoading } = useGetAllTasksQuery(undefined);
    const [deleteTaskMutation] = useDeleteTaskMutation();



    const handleDelete = async (id: string) => {
     
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: "Yes, delete it!",
            });

            if (result.isConfirmed) {
                deleteTaskMutation(id);
                // Show a confirmation message
                await Swal.fire({
                    title: "Deleted!",
                    text: "Your task has been deleted.",
                    icon: "success",
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

    useEffect(() => {
        if (isError) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                // title: 'Login Failed',
                text: (error as any)?.data?.success === false && (error as any)?.data?.errorSources[0]?.message,
                showConfirmButton: true,
            });
        }
    }, [isError, error]);

    return (
        <>
            {isLoading ? (
                <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                    <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
                </div>
            ) : (
                <>
                    {trainersData?.success && (
                        <>
                            <div className="container mx-auto ">
                                <h1 className="mb-6 text-3xl font-bold">Tasks</h1>
                                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                                    {trainersData?.data?.map((task: TTask) => (
                                        <div key={task._id} className="rounded-lg bg-white dark:bg-[#0e1726] p-4 shadow-md">
                                            <div className="flex items-center justify-between">
                                                <Image src={task.avatar} alt={task.title} width={500} height={500} className="mb-2 h-10 w-10 rounded-full bg-red-500" />
                                                <div className="flex items-center gap-3">
                                                    <Link href={`/task/update/${task?._id}`}>
                                                        <button type="button" className="btn btn-success cursor-pointer px-2 py-1">
                                                            <GrUpdate size={13} className="me-2" />
                                                            Update
                                                        </button>
                                                    </Link>
                                                    <button onClick={() => handleDelete(task?._id)} type="button" className="btn btn-danger px-2 py-1 ">
                                                        <MdDeleteOutline size={20} className="me-1" />
                                                        <span className="mt-[1px]"> Delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                            <h2 className="mb-1 text-xl font-semibold">{task.title}</h2>
                                            <h3 className="mb-2 text-lg text-gray-600">{task.subTitle}</h3>
                                            <p className="text-sm text-gray-500">
                                                Category: <strong>{task.category}</strong> | User Level: <strong>{task.userLevel}</strong> | Points: <strong>{task.points}</strong>
                                            </p>
                                            <p className="mt-2 text-gray-700">{task.detail}</p>
                                            <h4 className="mt-4 text-lg font-bold">Steps:</h4>
                                            <ul className="list-disc pl-5">
                                                {task.steps.map((step) => (
                                                    <li key={step.stepNumber}>
                                                        {step.description}
                                                         {/* - <span className={step.isCompleted ? 'text-green-600' : 'text-red-600'}>{step.isCompleted ? 'Completed' : 'Not Completed'}</span> */}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </>
            )}
        </>
    );
};

export default ComponentsDashboardAllTask;
