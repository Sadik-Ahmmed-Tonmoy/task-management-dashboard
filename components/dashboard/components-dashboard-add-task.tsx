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
import { MdOutlineCategory, MdPerson } from "react-icons/md";

// Zod schema for extreme validation
const stepSchema = z.object({
    stepNumber: z.number(),
    description: z.string().nonempty('Description is required'),
    isCompleted: z.boolean(),
  });
  
  const formSchema = z.object({
    avatar: z.string().url('Invalid URL format'),
    category: z.string().nonempty('Category is required'),
    title: z.string().nonempty('Title is required'),
    subTitle: z.string().nonempty('Subtitle is required'),
    points: z.number().positive('Points must be a positive number'),
    userLevel: z.number().int().positive('User level must be a positive integer'),
    detail: z.string().nonempty('Detail is required'),
    steps: z.array(stepSchema).nonempty('At least one step is required'),
  });

// Type inference for form values from the schema
type FormData = z.infer<typeof formSchema>;

const ComponentsDashboardAddTask = () => {
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
                console.log('Login Successful:', res.data);

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

                // Set a flag in localStorage to indicate a successful login
                // localStorage.setItem("redirectAfterReload", "true");

                // Refetch user data after successful login
                // await refetch();

                // Reload the page to trigger the refetch with authorization header
                // setTimeout(() => {
                //   window.location.reload();
                //  }, 500);

                // reset(); // Reset the form after submission

                router.push('/');
            } else {
                console.log('Login Failed:', res.error);
            }
        } catch (e) {
            console.error('Error during login:', e);
        }
    };

    return (
        <form className="space-y-5 dark:text-white" onSubmit={handleSubmit(handleLogin)}>
            <div>
                <label htmlFor="avatar">=Avatar</label>
                <div className="relative text-white-dark mb-3">
                    <input type="text" {...register('avatar')} placeholder="Your avatar link" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <MdPerson  />
                    </span>
                </div>
                <div className="relative text-white-dark">
                    <input type="text" {...register('category')} placeholder="Your category" className="form-input ps-10 placeholder:text-white-dark" />
                    <span className="absolute start-4 top-1/2 -translate-y-1/2">
                    <MdOutlineCategory />    
                    </span>
                </div>
                {errors.avatar && <span className="text-red-500">{errors.avatar.message}</span>}
            </div>
          
            <button type="submit" className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]">
                Submit
            </button>
        </form>
    );
};

export default ComponentsDashboardAddTask;
