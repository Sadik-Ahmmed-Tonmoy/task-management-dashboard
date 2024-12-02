'use client';

import { useUpdateServiceAreaMutation } from '@/redux/features/serviceArea/serviceAreaApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FieldValues, useFieldArray, useForm } from 'react-hook-form';
import { MdOutlineCategory } from 'react-icons/md';
import { z } from 'zod';

// Define the schema for location (route)
const locationSchema = z.object({
    code: z.string().optional(),
    name: z.string().nonempty('Name is required'),
});

// Define the main form schema
const formSchema = z.object({
    name: z.string().nonempty('Title is required'),
    routes: z.array(locationSchema).optional(),
});

// Type inference for form data
type FormData = z.infer<typeof formSchema>;

const EditAreasWeServe = ({
    selectedItemForEdit,
    notSelectedItemForEdit,
    selectedSectionId,
    setIsModalOpen
}: {
    notSelectedItemForEdit: any;
    selectedItemForEdit: any;
    selectedSectionId: any;
    setIsModalOpen: (open: boolean) => void;
}) => {
    const [updateServiceAreaMutation] = useUpdateServiceAreaMutation();
    console.log({ notSelectedItemForEdit });
    const {
        register,
        handleSubmit,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    // useFieldArray for dynamic routes
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'routes',
    });

    // Set form values on selectedItemForEdit change
    useEffect(() => {
        if (selectedItemForEdit) {
            reset({
                name: selectedItemForEdit.name || '',
                routes: selectedItemForEdit.routes || [],
            });
        }
    }, [selectedItemForEdit, reset]);

    // Handle form submission

    const handleUpdateAreas = async (data: any) => {
        try {
            const res = await handleAsyncWithToast(
                async () => {
                    // Replace this with your actual mutation or API call
                    return updateServiceAreaMutation({
                        id: selectedSectionId,
                        data: {
                            list: [data, ...notSelectedItemForEdit],
                        },
                    }); // Or your custom mutation to handle form data
                },
                'Updating...',
                'Update successful!',
                'Update failed. Please try again.'
            );

            // Check if submission was successful
         
            if (res?.data?.success) {
                setIsModalOpen(false);
                // router.push('/blog');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };
    return (
        <>
            <form className="dark:text-white" onSubmit={handleSubmit(handleUpdateAreas)}>
                <div className="mx-auto">
                    <div className="mb-3">
                        <label htmlFor="category">Title</label>
                        <div className="relative text-white-dark">
                            <input type="text" {...register('name')} placeholder="Enter title" className="form-input ps-10 placeholder:text-white-dark" />
                            <span className="absolute start-4 top-1/2 -translate-y-1/2">
                                <MdOutlineCategory />
                            </span>
                        </div>
                        {errors.name && <span className="text-red-500">{errors.name.message}</span>}
                    </div>

                    {/* Dynamic Routes (Steps) */}
                    <div>
                        <label>Areas</label>
                        {fields.map((item, index) => (
                            <div key={item.id} className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                                <input type="text" {...register(`routes.${index}.code`)} placeholder="Code" className="form-input sm:w-1/4" />
                                {errors.routes?.[index]?.code && <span className="text-red-500">{errors.routes[index]?.code?.message}</span>}
                                <input type="text" {...register(`routes.${index}.name`)} placeholder="Name" className="form-input sm:w-1/2" />
                                {errors.routes?.[index]?.name && <span className="text-red-500">{errors.routes[index]?.name?.message}</span>}
                                <button type="button" onClick={() => remove(index)} className="btn btn-danger">
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                append({
                                    code: ' ',
                                    name: '',
                                })
                            }
                            className="btn btn-primary"
                        >
                            Add Step
                        </button>
                    </div>

                    {/* Validation error for steps */}
                    {errors.routes && <span className="text-red-500">{errors.routes.message}</span>}
                </div>

                <button type="submit" className="btn btn-gradient mx-auto !mt-6 border-0 px-20 text-center uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                    Submit
                </button>
            </form>
        </>
    );
};

export default EditAreasWeServe;
