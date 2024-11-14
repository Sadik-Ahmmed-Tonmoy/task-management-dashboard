'use client';

import React, { useEffect, useState } from 'react';
import MyFormWrapper from '../MyForm/MyFormWrapper/MyFormWrapper';
import { z } from 'zod';
import { FieldValues } from 'react-hook-form';
import MyFormInputHTML from '../MyForm/MyFormInput/MyFormInputHTML';
import MyFormSelect from '../MyForm/MyFormSelect/MyFormSelect';
import { useCreateCouponMutation, useDeleteCouponMutation, useGetAllCouponQuery, useUpdateCouponMutation } from '@/redux/features/coupon/couponApi';
import Swal from 'sweetalert2';
import ReactLoading from 'react-loading';
import { Modal } from 'antd';
import MyFormDatePicker from '../MyForm/MyFormDatePicker/MyFormDatePicker ';
import dayjs from 'dayjs';

interface Coupon {
    _id: string;
    code: string;
    discount: number;
    expirationDate: string;
    availability?: boolean;
}

const couponValidationSchema = z.object({
    code: z
        .string({
            required_error: 'Coupon code is required',
        })
        .nonempty('Coupon code is required'),
    discount: z
        .string({
            required_error: 'Discount amount is required',
        })
        .transform((value) => parseFloat(value))
        .refine((value) => !isNaN(value) && value >= 0 && value <=100, {
            message: 'Discount must be a number between 0 and 100',
        }),
    expirationDate: z
        .any({
            required_error: 'This field is required',
        })
        .refine((value) => !!value, { message: 'This field is required' }),
    availability: z.enum(['true', 'false'], {
        errorMap: () => ({ message: 'Availability must be selected' }),
    }),
});

const ComponentsDashboardCoupon = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateCoupon, setIsCreateCoupon] = useState(false);
    const [updateId, setUpdateId] = useState<string | null>(null);
    const [selectedItemForUpdate, setSelectedItemForUpdate] = useState<Partial<Coupon>>({});
    const { data: AllCouponData, isLoading } = useGetAllCouponQuery(undefined);
    const [createCouponMutation] = useCreateCouponMutation();
    const [updateCouponMutation] = useUpdateCouponMutation();
    const [deleteCouponMutation] = useDeleteCouponMutation();
    useEffect(() => {
        if (updateId && AllCouponData?.data?.coupons) {
            const selectedItem = AllCouponData?.data?.coupons.find((c: Coupon) => c._id === updateId);
            if (selectedItem) {
                setSelectedItemForUpdate(selectedItem);
            }
        }
    }, [updateId, AllCouponData]);
    console.log(selectedItemForUpdate);

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
                const res = await deleteCouponMutation(id).unwrap();
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
        formData.expirationDate = dayjs(formData.expirationDate, 'YYYY-MM-DD').add(1, 'day');
        setIsModalOpen(false);
        reset();
        try {
            const res = await createCouponMutation(formData).unwrap();
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
        formData.expirationDate = dayjs(formData.expirationDate, 'YYYY-MM-DD').add(1, 'day');
        formData._id = updateId;
        setIsModalOpen(false);
        reset();
        try {
            const res = await updateCouponMutation(formData).unwrap();
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
        setIsCreateCoupon(true);
        setIsModalOpen(true);
    };

    const openModalForEdit = (id: string) => {
        setUpdateId(id);
        const selectedItem = AllCouponData?.data?.coupons.find((c: Coupon) => c._id === id);
        if (selectedItem) {
            setSelectedItemForUpdate(selectedItem);
            setIsCreateCoupon(false);
            setIsModalOpen(true);
        }
    };

    // Determine defaultValues based on create or edit mode
    const defaultValues = isCreateCoupon
        ? { code: '', discount: 0, expirationDate: null, availability: '' }
        : {
              code: selectedItemForUpdate?.code || '',
              discount: selectedItemForUpdate?.discount?.toString() || 0,
              expirationDate: selectedItemForUpdate?.expirationDate ? dayjs(selectedItemForUpdate?.expirationDate, 'YYYY-MM-DD') : '',
              availability: selectedItemForUpdate?.availability == true ? 'true' : 'false',
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
            <div className="mb-3 me-4 flex flex-col sm:flex-row justify-between items-center">
                <div></div>
            <h3 className="my-3 text-center text-3xl">Coupon</h3>
                <button onClick={openModalForCreate} className="w-fit rounded-lg bg-blue-500 px-4 py-2 text-white">
                    Create Coupon
                </button>
            </div>
            <Modal title={isCreateCoupon ? 'Create Coupon' : 'Update Coupon'} open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null}>
                <MyFormWrapper
                    key={isCreateCoupon ? 'create' : `edit-${updateId}-${JSON.stringify(selectedItemForUpdate)}`} // Use `key` to force re-render
                    onSubmit={isCreateCoupon ? handleSubmit : handleEditSubmit}
                    // validationSchema={isCreateCoupon ? couponValidationSchema : updateCouponValidationSchema}
                    validationSchema={couponValidationSchema}
                    defaultValues={defaultValues}
                    className="mx-auto mb-4 mt-8 flex max-w-xl flex-col gap-3"
                >
                    <MyFormInputHTML name="code" label="Coupon Code" placeholder="Enter Your Coupon Code" />
                    <MyFormInputHTML name="discount" type="text" label="Discount (%)" placeholder="Enter Discount" />
                    <MyFormDatePicker name="expirationDate" label="Expiration Date" placeholder="Select Expiration Date" />
                    <MyFormSelect
                        name="availability"
                        label="Availability"
                        placeHolder=""
                        options={[
                            { label: 'Available', value: 'true' },
                            { label: 'Unavailable', value: 'false' },
                        ]}
                    />
                    <button type="submit" className="rounded-lg bg-blue-500 px-4 py-2 text-white">
                        Submit
                    </button>
                </MyFormWrapper>
            </Modal>
            <div className="slim-scroll container mx-auto overflow-hidden overflow-x-auto">
                <table className="min-w-full border border-gray-300 bg-white">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2 text-center">Code</th>
                            <th className="border-b px-4 py-2 text-center">Discount</th>
                            <th className="border-b px-4 py-2 text-center">Expiry Date</th>
                            <th className="border-b px-4 py-2 text-center">Availability</th>
                            <th className="border-b px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {AllCouponData?.data?.coupons.map((coupon: Coupon) => (
                            <tr key={coupon._id}>
                                <td className="border-b px-4 py-2 text-center">{coupon.code}</td>
                                <td className="border-b px-4 py-2 text-center">{coupon.discount}</td>
                                {/* <td className="border-b px-4 py-2 text-center">{new Date(coupon.expirationDate).toLocaleDateString()}</td> */}
                                <td className="border-b px-4 py-2 text-center">{dayjs(coupon?.expirationDate, 'YYYY-MM-DD').format('YYYY-MM-DD')}</td>
                                <td className="border-b px-4 py-2 text-center">{coupon?.availability === true ? 'Available' : 'Unavailable'}</td>
                                <td className="flex flex-col items-center justify-center gap-2 border-b px-4 py-2 text-center sm:flex-row">
                                    <button onClick={() => openModalForEdit(coupon._id)} className="mr-2 rounded bg-blue-500 px-3 py-1 text-white">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(coupon._id)} className="rounded bg-red-500 px-3 py-1 text-white">
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ComponentsDashboardCoupon;
