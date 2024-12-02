'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLoginMutation } from '@/redux/features/auth/authApi';
import { addTokenToLocalStorage } from '@/utils/tokenHandler';
import Swal from 'sweetalert2';

// Zod schema for extreme validation
const formSchema = z.object({
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
});

// Type inference for form values from the schema
type FormData = z.infer<typeof formSchema>;

const ComponentsAuthLoginForm = () => {
    const router = useRouter();
    const [login, { isError, error }] = useLoginMutation();

    useEffect(() => {
        if (isError) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Login Failed',
                text: (error as any)?.data?.success === false && (error as any)?.data?.errorSources[0]?.message,
                showConfirmButton: true,
                // timer: 1500,
            });
        }
    }, [isError, error]);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    const handleLogin = async (formData: FieldValues) => {
        try {
            const res = await login(formData).unwrap();
            if (res.success) {
                // Save the token to localStorage
                await addTokenToLocalStorage(res?.data?.accessToken);

                // Show success message
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: 'Login Successful',
                    showConfirmButton: false,
                    timer: 2500,
                });
                router.push('/');
            } else {
                Swal.fire({
                    position: 'top-end',
                    icon: 'error',
                    // title: 'Failed to create task',
                    text: (error as any)?.data?.success === false && (error as any)?.data?.errorSources[0]?.message,
                    showConfirmButton: true,
                });
            }
        } catch (e) {
            // Swal.fire({
            //     position: 'top-end',
            //     icon: 'error',
            //     // title: 'Failed to create task',
            //     text: (e as any)?.data?.success === false && (e as any)?.data?.errorSources[0]?.message,
            //     showConfirmButton: true,
            // });
        }
    };

    return (
        // <form ></form>
        <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(handleLogin)}>
            <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                    <input type="email" {...register('email')} defaultValue={"akonhasan680@gmail.com"} placeholder="Enter Email" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>
                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>
            <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                    <input id="Password" type="password" defaultValue={"123456"} {...register('password')} placeholder="Enter Password" className="form-input ps-10 placeholder:text-white-dark" />

                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                </div>
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>
            <div>
                {/* <label className="flex cursor-pointer items-center">
                    <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                    <span className="text-white-dark">Subscribe to weekly newsletter</span>
                </label> */}
            </div>
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Sign in
            </button>
        </form>
    );
};

export default ComponentsAuthLoginForm;
