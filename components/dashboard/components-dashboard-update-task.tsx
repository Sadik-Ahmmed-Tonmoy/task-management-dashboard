'use client';
import { useCreateTaskMutation, useGetSingleTaskQuery, useUpdateTaskMutation } from '@/redux/features/task/taskApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { CgDetailsMore } from 'react-icons/cg';
import { LiaLevelUpAltSolid } from 'react-icons/lia';
import { MdOutlineCategory, MdPerson } from 'react-icons/md';
import { PiSubtitles } from 'react-icons/pi';
import { VscActivateBreakpoints } from 'react-icons/vsc';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';
import { z } from 'zod';

// Zod schema for extreme validation
const stepSchema = z.object({
    stepNumber: z
        .number()
        .transform((val) => Number(val)) // Transform string to number
        .refine((val) => Number.isInteger(val) && val > 0, 'User level must be a positive number'),
    description: z.string().nonempty('Description is required'),
    isCompleted: z.boolean(),
});

const formSchema = z.object({
    avatar: z.string().url('Invalid URL format'),
    category: z.string().nonempty('Category is required'),
    title: z.string().nonempty('Title is required'),
    subTitle: z.string().nonempty('Subtitle is required'),
    points: z
        .string()
        .nonempty('Points are required (Number Only)')
        .transform((val) => Number(val)) // Transform string to number
        .refine((val) => val > 0, 'Points must be a positive number'),
    userLevel: z
        .string()
        .nonempty('User level is required (Number Only)')
        .transform((val) => Number(val)) // Transform string to number
        .refine((val) => Number.isInteger(val) && val > -1, 'User level must be a positive number'),
    detail: z.string().nonempty('Detail is required'),
    steps: z.array(stepSchema).optional(),
});
// Type inference for form values from the schema
type FormData = z.infer<typeof formSchema>;

const ComponentsDashboardUpdateTask = ({ id }: { id: string }) => {
    const router = useRouter();
    const [updateTaskMutation, { isError, error, isLoading }] = useUpdateTaskMutation();
    const { data } = useGetSingleTaskQuery(id);


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

    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });
    // useFieldArray for dynamic steps
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'steps',
    });

    // Populate form with fetched data
    useEffect(() => {
        if (data) {
            remove();
            // Set the form values using setValue
            setValue('avatar', data?.data?.avatar);
            setValue('category', data?.data?.category);
            setValue('title', data?.data?.title);
            setValue('subTitle', data?.data?.subTitle);
            setValue('points', data?.data?.points?.toString()); // Ensure it's a string for the input
            setValue('userLevel', data?.data?.userLevel?.toString()); // Ensure it's a string for the input
            setValue('detail', data?.data?.detail);
            // Set steps if available
             // Set steps if available
        if (data?.data?.steps && data.data.steps.length > 0) {
            data.data.steps.forEach((step: any) => {
                append(step); // Add each step to the form
            });
        }
        }
    }, [data, setValue]);

    const handleUpdateTask = async (formData: FieldValues) => {
        formData.id = id

        
        try {
            const res = await updateTaskMutation(formData).unwrap();
            if (res.success) {
                // Show success message
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: res.message,
                    showConfirmButton: false,
                    timer: 2500,
                });
                reset();
                router.push('/task/all'); // Redirect to tasks page
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    title: 'Failed to update task',
                    text: (error as any)?.data?.success === false && (error as any)?.data?.errorSources[0]?.message,
                    showConfirmButton: true,
                });
            }
        } catch (e) {
            console.error('Error creating task', e);
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Failed to update task',
                text: (error as any)?.data?.success === false && (error as any)?.data?.errorSources[0]?.message,
                showConfirmButton: true,
            });
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                    <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
                </div>
            ) : (
                <form className="space-y-5 dark:text-white " onSubmit={handleSubmit(handleUpdateTask)}>
                    <div className="mx-auto md:max-w-[60%]">
                        <div className="mb-3">
                            <label htmlFor="avatar">Avatar</label>
                            <div className="relative text-white-dark">
                                <input type="text" {...register('avatar')} placeholder="Your avatar link" className="form-input ps-10 placeholder:text-white-dark" />
                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <MdPerson />
                                </span>
                            </div>
                            {errors.avatar && <span className="text-red-500">{errors.avatar.message}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="category">Category</label>
                            <div className="relative text-white-dark">
                                <input type="text" {...register('category')} placeholder="Your category" className="form-input ps-10 placeholder:text-white-dark" />
                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <MdOutlineCategory />
                                </span>
                            </div>
                            {errors.category && <span className="text-red-500">{errors.category.message}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="title">Title</label>
                            <div className="relative text-white-dark">
                                <input type="text" {...register('title')} placeholder="Your title" className="form-input ps-10 placeholder:text-white-dark" />
                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <PiSubtitles />
                                </span>
                            </div>
                            {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="subTitle">Sub Title</label>
                            <div className="relative text-white-dark">
                                <input type="text" {...register('subTitle')} placeholder="Your Sub Title" className="form-input ps-10 placeholder:text-white-dark" />

                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <PiSubtitles />
                                </span>
                            </div>
                            {errors.subTitle && <span className="text-red-500">{errors.subTitle.message}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="points">Points</label>
                            <div className="relative text-white-dark">
                                <input type="number" {...register('points')} placeholder="Your points" className="form-input ps-10 placeholder:text-white-dark" />
                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <VscActivateBreakpoints />
                                </span>
                            </div>
                            {errors.points && <span className="text-red-500">{errors.points.message}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="userLevel">User Level</label>
                            <div className="relative text-white-dark">
                                <input type="number" {...register('userLevel')} placeholder="Your User Level" className="form-input ps-10 placeholder:text-white-dark" />
                                <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                    <LiaLevelUpAltSolid />
                                </span>
                            </div>
                            {errors.userLevel && <span className="text-red-500">{errors.userLevel.message}</span>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="detail">Detail</label>
                            <div className="relative text-white-dark">
                                <textarea {...register('detail')} placeholder="Detail" className="form-input ps-10 placeholder:text-white-dark" />
                                <span className="absolute start-4 top-5 -translate-y-1/2">
                                    <CgDetailsMore />
                                </span>
                            </div>

                            {errors.detail && <span className="text-red-500">{errors.detail.message}</span>}
                        </div>

                        {/* Steps dynamic fields */}
                        <div>
                            <label>Steps</label>
                            {fields.map((item, index) => (
                                <div key={item.id} className="mb-3 flex items-center gap-2">
                                    <input
                                        type="number" // Change to text
                                        {...register(`steps.${index}.stepNumber`, {
                                            // Parse the value to number during submission
                                            setValueAs: (value) => Number(value),
                                        })}
                                        placeholder="Step Number"
                                        className="form-input w-1/4"
                                    />
                                    {/* Display error for stepNumber */}
                                    {errors.steps?.[index]?.stepNumber && <span className="text-red-500">{errors.steps[index]?.stepNumber?.message}</span>}
                                    <input type="text" {...register(`steps.${index}.description`)} placeholder="Description" className="form-input w-1/2" />
                                    {/* Display error for description */}
                                    {errors.steps?.[index]?.description && <span className="text-red-500">{errors.steps[index]?.description?.message}</span>}

                                    <div className="flex flex-col items-center justify-center">
                                        <label htmlFor="Completed">Completed ?</label>
                                        <input type="checkbox" {...register(`steps.${index}.isCompleted`)} className="form-checkbox" />
                                        {/* Display error for isCompleted (if needed, though a checkbox rarely has errors) */}
                                        {errors.steps?.[index]?.isCompleted && <span className="text-red-500">{errors.steps[index]?.isCompleted?.message}</span>}
                                    </div>
                                    <button type="button" onClick={() => remove(index)} className="btn btn-danger">
                                        Remove
                                    </button>
                                </div>
                            ))}

                            <button
                                type="button"
                                onClick={() =>
                                    append({
                                        stepNumber: fields.length + 1,
                                        description: '',
                                        isCompleted: false,
                                    })
                                }
                                className="btn btn-primary"
                            >
                                Add Step
                            </button>
                        </div>
                        {/* Validation error for steps */}
                        {errors.steps && <span className="text-red-500">{errors.steps.message}</span>}
                    </div>

                    <button type="submit" className="btn btn-gradient mx-auto !mt-6 border-0 px-20 text-center uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                        Submit
                    </button>
                </form>
            )}
        </>
    );
};

export default ComponentsDashboardUpdateTask;
