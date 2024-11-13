'use client';
import IconLockDots from '@/components/icon/icon-lock-dots';
import IconMail from '@/components/icon/icon-mail';
import IconUser from '@/components/icon/icon-user';
import { useLoginMutation, useRegisterMutation } from '@/redux/features/auth/authApi';
import { addTokenToLocalStorage } from '@/utils/tokenHandler';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import { z } from 'zod';

// Zod schema for extreme validation
const formSchema = z.object({
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    username: z.string().nonempty('User name is required'),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
});

// Type inference for form values from the schema
type FormData = z.infer<typeof formSchema>;

const ComponentsAuthRegisterForm = () => {
    const router = useRouter();
    const [signupFn, { isError: isRegistrationError,data, error: registrationError, isLoading }] = useRegisterMutation();
    const [login, { isError, error }] = useLoginMutation();

    
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(formSchema),
    });

    useEffect(() => {
        if (isRegistrationError) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
                title: 'Registration Failed',
                text: (registrationError as any)?.data?.success === false && (registrationError as any)?.data?.errorSources[0]?.message,
                showConfirmButton: true,
                // timer: 1500,
            });
        }
    }, [isRegistrationError, registrationError]);

    const handleSignup = async (formData: FieldValues) => {
        try {
            const res = await signupFn(formData).unwrap();
           
            if (res.success) {
                router.push('/')
            } else {
                
            }
        } catch (e) {
            console.error('Error during login:', e);
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(handleSignup)}>
            <div>
                <label htmlFor="Name">Name</label>
                <div className="relative text-white-dark">
                    <input id="Name" type="text" {...register('username')} placeholder="Enter Name" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconUser fill={true} />
                    </span>
                </div>
                {errors.username && <span className="text-red-500">{errors.username.message}</span>}
            </div>
            <div>
                <label htmlFor="Email">Email</label>
                <div className="relative text-white-dark">
                    <input id="Email" type="email" placeholder="Enter Email" {...register('email')} className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconMail fill={true} />
                    </span>
                </div>

                {errors.email && <span className="text-red-500">{errors.email.message}</span>}
            </div>
            <div>
                <label htmlFor="Password">Password</label>
                <div className="relative text-white-dark">
                    <input id="Password" type="password" placeholder="Enter Password" {...register('password')} className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                        <IconLockDots fill={true} />
                    </span>
                </div>
                {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>
            <div>
                <label className="flex cursor-pointer items-center">
                    <input type="checkbox" className="form-checkbox bg-white dark:bg-black" />
                    <span className="text-white-dark">Subscribe to weekly newsletter</span>
                </label>
            </div>
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Sign Up
            </button>
        </form>
    );
};

export default ComponentsAuthRegisterForm;
