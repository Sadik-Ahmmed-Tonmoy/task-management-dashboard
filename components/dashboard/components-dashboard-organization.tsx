'use client';
import { useCreateOrganizationMutation, useDeleteOrganizationMutation, useGetAllOrganizationQuery, useUpdateOrganizationMutation } from '@/redux/features/organization/organizationApi';
import { Modal } from 'antd';
import { StaticImport } from 'next/dist/shared/lib/get-img-props';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FieldValues } from 'react-hook-form';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';
import { z } from 'zod';
import MyFormImageUpload from '../MyForm/MyFormImageUpload/MyFormImageUpload';
import MyFormInputHTML from '../MyForm/MyFormInput/MyFormInputHTML';
import MyFormWrapper from '../MyForm/MyFormWrapper/MyFormWrapper';

const imageFileExtensionRegex = /\.(jpg|jpeg|png)$/i;

const organizationValidationSchema = z.object({
    name: z.string().nonempty('Name is required'),
    description: z.string().nonempty('Description is required'),
    email: z
        .string({
            required_error: 'Please enter a valid email',
        })
        .email('Please enter a valid email'),
    logo: z.any(),
    banner: z.any(),

    // Validate the logo field
    // logo: z
    //     .instanceof(File)
    //     .optional() // This field is optional
    //     .refine((file) => !file || imageFileExtensionRegex.test(file.name), {
    //         message: 'Logo must be an image (jpg, jpeg, png)',
    //     }),
    // // Validate the banner field
    // banner: z
    //     .instanceof(File)
    //     .optional() // This field is optional
    //     .refine((file) => !file || imageFileExtensionRegex.test(file.name), {
    //         message: 'Banner must be an image (jpg, jpeg, png)',
    //     }),
});

interface Organization {
    _id: string;
    name: string;
    description: string;
    email: string;
    logo?: string | StaticImport;
    banner?: string | StaticImport;
}

const ComponentsDashboardOrganization = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateOrganization, setIsCreateOrganization] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);
    const [isView, setIsView] = useState<boolean>(false);
    const [selectedItemForUpdate, setSelectedItemForUpdate] = useState<Partial<Organization>>({});
    const { data: getAllOrganizationQuery, isLoading } = useGetAllOrganizationQuery(undefined);
    const [createOrganizationMutation] = useCreateOrganizationMutation();
    const [updateOrganizationMutation] = useUpdateOrganizationMutation();
    const [deleteOrganizationMutation] = useDeleteOrganizationMutation();

    useEffect(() => {
        if (updateId && getAllOrganizationQuery?.data?.coupons) {
            const selectedItem = getAllOrganizationQuery?.data?.coupons.find((c: Organization) => c._id === updateId);
            if (selectedItem) {
                setSelectedItemForUpdate(selectedItem);
            }
        }
    }, [updateId, getAllOrganizationQuery]);

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
                const res = await deleteOrganizationMutation(id).unwrap();
                if (res.success) {
                    Swal.fire('Deleted!', res.message || 'Coupon deleted successfully', 'success');
                } else {
                    Swal.fire('Error!', 'Failed to delete coupon', 'error');
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

    const handleSubmit = async (formData: FieldValues, reset: any) => {
        console.log(formData);

        // Create a FormData object to append the fields
        const formDataToSend = new FormData();

        // Append banner and logo images if present
        if (formData.banner) {
            formDataToSend.append('banner', formData.banner);
        }
        if (formData.logo) {
            formDataToSend.append('logo', formData.logo);
        }

        // Create the body object containing name, description, and email
        const body = {
            name: formData.name,
            description: formData.description,
            email: formData.email,
        };

        // Append the body object as a JSON string
        formDataToSend.append('body', JSON.stringify(body));

        console.log(formDataToSend);

        setIsModalOpen(false);
        reset();
        try {
            const res = await createOrganizationMutation(formDataToSend).unwrap();
            if (res.success) {
                Swal.fire('Success!', res.message, 'success');
            } else {
                Swal.fire('Error!', 'Failed to create coupon', 'error');
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

    const handleEditSubmit = async (formData: FieldValues, reset: any) => {
        console.log(formData);

        // Create a FormData object to append the fields
        const formDataToSend = new FormData();

        // Append banner and logo images if present
        if (formData.banner) {
            formDataToSend.append('banner', formData.banner);
        }
        if (formData.logo) {
            formDataToSend.append('logo', formData.logo);
        }

        // Create the body object containing name, description, and email
        const body = {
            name: formData.name,
            description: formData.description,
            email: formData.email,
        };

        // Append the body object as a JSON string
        formDataToSend.append('body', JSON.stringify(body));
        setIsModalOpen(false);
        reset();
        try {
            const res = await updateOrganizationMutation({ _id: updateId, formDataToSend }).unwrap();
            if (res.success) {
                Swal.fire('Success!', res.message, 'success');
            } else {
                Swal.fire('Error!', 'Failed to create coupon', 'error');
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

    const openModalForCreate = () => {
        setSelectedItemForUpdate({});
        setIsCreateOrganization(true);
        setIsModalOpen(true);
        setIsView(false);
    };

    const openModalForEdit = (id: string) => {
        setUpdateId(id);
        const selectedItem = getAllOrganizationQuery?.data.find((c: Organization) => c._id === id);
        if (selectedItem) {
            setSelectedItemForUpdate(selectedItem);
            setIsCreateOrganization(false);
            setIsModalOpen(true);
        }
    };

    const defaultValues = isCreateOrganization
        ? { name: '', description: '', email: '', logo: '', banner: '' }
        : {
              name: selectedItemForUpdate?.name || '',
              description: selectedItemForUpdate?.description || '',
              email: selectedItemForUpdate?.email || '',
              logo: selectedItemForUpdate?.logo || '',
              banner: selectedItemForUpdate?.banner || '',
          };

    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <ReactLoading type="bars" color="#4361ee" height="5%" width="5%" className="mx-auto" />
            </div>
        );
    }

    return (
        <div>
            <div className="mb-3 me-4 flex flex-col items-center justify-between sm:flex-row">
                <div></div>
                <h3 className="my-3 text-center text-3xl">Organization</h3>
                <button onClick={openModalForCreate} className="w-fit rounded-lg bg-blue-500 px-4 py-2 text-white">
                    Create Organization
                </button>
            </div>
            <Modal title={isView ? 'View Details' : isCreateOrganization ? 'Create Organization' : 'Update Organization'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                {isView ? (
                    <div className='flex flex-col gap-3'>
                        <div>
                            <h5 className="text-base font-semibold">Name</h5>
                            <p>{selectedItemForUpdate?.name}</p>
                        </div>
                        <div>
                            <h5 className="text-base font-semibold">Email</h5>
                            <p>{selectedItemForUpdate?.email}</p>
                        </div>
                        <div>
                            <h5 className="text-base font-semibold">Description</h5>
                            <p>{selectedItemForUpdate?.description}</p>
                        </div>
                        <div>
                            <h5 className="text-base font-semibold mb-1">Logo</h5>
                            {selectedItemForUpdate.logo ? <Image src={selectedItemForUpdate.logo} height={200} width={200} alt="logo" /> : 'No Logo'}
                        </div>
                        <div>
                            <h5 className="text-base font-semibold mb-1">Banner</h5>
                            {selectedItemForUpdate.banner ? <Image src={selectedItemForUpdate.banner} height={200} width={200} alt="banner" /> : 'No Banner'}
                        </div>
                    </div>
                ) : (
                    <MyFormWrapper
                        key={isCreateOrganization ? 'create' : `edit-${updateId}-${JSON.stringify(selectedItemForUpdate)}`}
                        onSubmit={isCreateOrganization ? handleSubmit : handleEditSubmit}
                        validationSchema={organizationValidationSchema}
                        defaultValues={defaultValues}
                        className="mx-auto mb-4 mt-8 flex max-w-xl flex-col gap-3"
                    >
                        <MyFormInputHTML name="name" label="Name" placeholder="Enter Your Coupon Code" />
                        <MyFormInputHTML name="description" type="text" label="Organization" placeholder="Enter Discount" />
                        <MyFormInputHTML name="email" type="email" label="Email" placeholder="Enter your email" />
                        <MyFormImageUpload name="logo" label="Logo" />
                        <MyFormImageUpload name="banner" label="Banner" />
                        <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white">
                            Submit
                        </button>
                    </MyFormWrapper>
                )}
            </Modal>
            <div className="slim-scroll container mx-auto overflow-hidden overflow-x-auto">
                <table className="min-w-full border border-gray-300 bg-white dark:bg-[#121e31]">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2 text-center">Name</th>
                            <th className="border-b px-4 py-2 text-center">Logo</th>
                            <th className="border-b px-4 py-2 text-center">Banner</th>
                            <th className="border-b px-4 py-2 text-center">Email</th>
                            <th className="border-b px-4 py-2 text-center">Description</th>
                            <th className="border-b px-4 py-2 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllOrganizationQuery?.data?.map((item: Organization) => (
                            <tr key={item._id}>
                                <td className="border-b px-4 py-2 text-center">{item.name}</td>
                                <td className="border-b px-4 py-2 text-center"> {item.logo ? <Image src={item.logo} height={50} width={50} alt="logo" /> : 'No Logo'}</td>
                                <td className="border-b px-4 py-2 text-center">{item.banner ? <Image src={item.banner} height={50} width={50} alt="banner" /> : 'No Banner'}</td>
                                <td className="border-b px-4 py-2 text-center">{item?.email}</td>
                                <td className="border-b px-4 py-2 text-center"> {item?.description?.length > 30 ? `${item.description.slice(0, 30)}...` : item?.description}</td>
                                <td className="border-b px-4 py-2 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                                        <button
                                            onClick={() => {
                                                openModalForEdit(item._id);
                                                setIsView(true);
                                            }}
                                            className="mr-2 rounded bg-green-500 px-3 py-1 text-white"
                                        >
                                            View
                                        </button>
                                        <button
                                            onClick={() => {
                                                openModalForEdit(item._id);
                                                setIsView(false);
                                            }}
                                            className="mr-2 rounded bg-blue-500 px-3 py-1 text-white"
                                        >
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(item._id)} className="rounded bg-red-500 px-3 py-1 text-white">
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComponentsDashboardOrganization;
