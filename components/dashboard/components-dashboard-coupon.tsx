'use client';

import React, { FormEvent, useState } from 'react';
import MyFormWrapper from '../MyForm/MyFormWrapper/MyFormWrapper';
import { z } from 'zod';
import { FieldValues } from 'react-hook-form';
import MyFormInputHTML from '../MyForm/MyFormInput/MyFormInputHTML';
import MyFormSelect from '../MyForm/MyFormSelect/MyFormSelect';
import MyFormDatePicker from '../MyForm/MyFormDatePicker/MyFormDatePicker ';
import moment from 'moment';

const fakeCoupons = [
    { id: '1', code: 'WELCOME10', discount: 10, expiryDate: '2024-12-31' },
    { id: '2', code: 'SUMMER20', discount: 20, expiryDate: '2025-06-30' },
    { id: '3', code: 'FREESHIP', discount: 0, expiryDate: '2025-01-15' },
    { id: '4', code: 'HOLIDAY25', discount: 25, expiryDate: '2024-12-25' },
    { id: '5', code: 'BLACKFRIDAY50', discount: 50, expiryDate: '2024-11-29' },
    { id: '6', code: 'SPRING15', discount: 15, expiryDate: '2025-04-15' },
    { id: '7', code: 'NEWYEAR30', discount: 30, expiryDate: '2025-01-01' },
    { id: '8', code: 'VIP40', discount: 40, expiryDate: '2025-12-31' },
    { id: '9', code: 'BIRTHDAY50', discount: 50, expiryDate: '2025-05-01' },
    { id: '10', code: 'FLASHSALE70', discount: 70, expiryDate: '2024-12-01' },
];

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
        .refine((value) => !isNaN(value) && value >= 0, {
            message: 'Discount must be a number greater than 0',
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
    const [coupons, setCoupons] = useState(fakeCoupons);
    const [code, setCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [expiryDate, setExpiryDate] = useState(new Date());
    const [editingId, setEditingId] = useState<string | null>(null);

    console.log(coupons);
    const handleEdit = (id: string) => {
        const couponToEdit = coupons.find((coupon) => coupon.id === id);
        if (couponToEdit) {
            setCode(couponToEdit.code);
            setDiscount(couponToEdit.discount);
            setExpiryDate(new Date(couponToEdit.expiryDate));
            setEditingId(id);
        }
    };

    const handleDelete = (id: string) => {
        const updatedCoupons = coupons.filter((coupon) => coupon.id !== id);
        setCoupons(updatedCoupons);
    };

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setExpiryDate(date);
        }
    };

    const handleFormSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const data = {
            code,
            discount,
            expiryDate: expiryDate.toISOString().split('T')[0],
        };

        if (editingId) {
            const updatedCoupons = coupons.map((coupon) => (coupon.id === editingId ? { ...coupon, ...data } : coupon));
            setCoupons(updatedCoupons);
            // update existing coupon
            // updatedCoupons
        } else {
            const newCoupon = {
                id: (coupons.length + 1).toString(),
                ...data,
            };
            setCoupons([...coupons, newCoupon]);

            // Add new coupon
            // newCoupon
        }

        setCode('');
        setDiscount(0);
        setExpiryDate(new Date());
        setEditingId(null); // Clear the editing state
    };

    const handleSubmit = async (formData: FieldValues) => {
        const fromDate = moment(formData?.expirationDate?.$d).format('YYYY-MM-DD');
        formData.expirationDate = fromDate;
        console.log(formData);
        // try {
        //   const res = await login(formData).unwrap();
        //   if (res.success) {
        //     console.log("Login Successful:", res.data);

        //     const user = await verifyToken(res?.data?.accessToken);

        //     await dispatch(setUser({ user: user, token: res?.data?.accessToken }));

        //     // Show success message
        //     Swal.fire({
        //       position: "top-end",
        //       icon: "success",
        //       title: "Login Successful",
        //       showConfirmButton: false,
        //       timer: 2500,
        //     });
        //     router.push("/");
        //   } else {
        //     console.log("Login Failed:", res.error);
        //   }
        // } catch (e) {
        //   console.error("Error during login:", e);
        // }
    };

    return (
        <div>
            <div>
                {/* <DForm handleFormSubmit={handleFormSubmit} header={false}>
                    <DHeader>Coupon Details</DHeader>
                    <DInput
                        id="coupon_code"
                        name="coupon_code"
                        label="Coupon Code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        required
                    />
                    <DInput
                        id="discount"
                        name="discount"
                        label="Discount (%)"
                        type="number"
                        value={discount}
                        onChange={(e) => setDiscount(Number(e.target.value))}
                        required
                    />
                    <DDatePicker
                        id="expiry_date"
                        name="expiry_date"
                        label="Expiry Date"
                        selectedDate={expiryDate}
                        onChange={handleDateChange}
                        required
                        className="max-w-sm"
                    />
                    <Button type="submit">{editingId ? "Update Coupon" : "Add Coupon"}</Button>
                </DForm> */}
                <MyFormWrapper onSubmit={handleSubmit} validationSchema={couponValidationSchema} className="my-8 flex flex-col gap-3 max-w-xl mx-auto">
                    <div className="mb-4 flex flex-col gap-6">
                        <MyFormInputHTML name="code" label="Coupon Code" placeholder="Enter Your Coupon code" />
                        <MyFormInputHTML name="discount" type="number" label="Discount (Number Only)" placeholder="Enter Your discount amount" />
                        <MyFormDatePicker name="expirationDate" label="Expiration Date" placeholder="Select Expiration Date" />
                        <MyFormSelect
                            name="availability"
                            label="Availability"
                            placeHolder=""
                            options={[
                                { label: 'available', value: 'true' },
                                { label: 'unavailable', value: 'false' },
                            ]}
                        />
                    </div>

        

                    <button
                        type="submit"
                        className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-[#002da7] to-[#18337c] font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
                    >
                        submit
                    </button>
                    <div className="my-4 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />
                </MyFormWrapper>
            </div>

            <div className="container mx-auto mt-5">
                <table className="min-w-full border border-gray-300 bg-white">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2 text-center">Code</th>
                            <th className="border-b px-4 py-2 text-center">Discount (%)</th>
                            <th className="border-b px-4 py-2 text-center">Expiry Date</th>
                            <th className="border-b px-4 py-2 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map((coupon) => (
                            <tr key={coupon.id}>
                                <td className="border-b px-4 py-2 text-center">{coupon.code}</td>
                                <td className="border-b px-4 py-2 text-center">{coupon.discount}</td>
                                <td className="border-b px-4 py-2 text-center">{new Date(coupon.expiryDate).toLocaleDateString()}</td>
                                <td className="flex flex-col items-center justify-center gap-2 border-b px-4 py-2 text-center sm:flex-row">
                                    <button onClick={() => handleEdit(coupon.id)} className="mr-2 rounded bg-blue-500 px-3 py-1 text-white">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(coupon.id)} className="rounded bg-red-500 px-3 py-1 text-white">
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
