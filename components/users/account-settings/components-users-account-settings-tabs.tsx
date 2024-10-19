'use client';
import IconDollarSignCircle from '@/components/icon/icon-dollar-sign-circle';
import IconFacebook from '@/components/icon/icon-facebook';
import IconGithub from '@/components/icon/icon-github';
import IconHome from '@/components/icon/icon-home';
import IconLinkedin from '@/components/icon/icon-linkedin';
import IconPhone from '@/components/icon/icon-phone';
import IconTwitter from '@/components/icon/icon-twitter';
import IconUser from '@/components/icon/icon-user';
import { useGetUserDataQuery, useUpdateUserMutation } from '@/redux/features/auth/authApi';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import ReactLoading from 'react-loading';
import Swal from 'sweetalert2';
import { z } from 'zod';

// Zod schema for extreme validation
const formSchema = z.object({
    email: z.string().email('Invalid email address').nonempty('Email is required'),
    username: z.string().nonempty('User name is required'),
    avatar: z.string().url('Invalid URL'),
});

// Type inference for form values from the schema
type FormData = z.infer<typeof formSchema>;


const ComponentsUsersAccountSettingsTabs = () => {
    const [tabs, setTabs] = useState<string>('home');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };
const router = useRouter()
    const {data : userData, isLoading} = useGetUserDataQuery(undefined)
    const [updateUserMutation, { isError, error }] = useUpdateUserMutation();
    useEffect(() => {
        if (isError) {
            Swal.fire({
                position: 'top-end',
                icon: 'error',
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


    
      useEffect(() => {
        if (userData) {
            setValue('username', userData?.data?.username);
            setValue('email', userData?.data?.email);
            setValue('avatar', userData?.data?.avatar);
        }
    }, [userData, setValue]);


    const handleUpdateProfile = async (formData: FieldValues) => {
       

        console.log(formData);
        try {
            const res = await updateUserMutation(formData).unwrap();
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
                router.push('/users/profile'); // Redirect to tasks page
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



        if (isLoading) {
            return (
                <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                    <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
                </div>
            );
        }

    return (
        <div className="pt-5">
            <div className="mb-5 flex items-center justify-between">
                <h5 className="text-lg font-semibold dark:text-white-light">Settings</h5>
            </div>
            <div>
                <ul className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
                    <li className="inline-block">
                        <button
                            onClick={() => toggleTabs('home')}
                            className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'home' ? '!border-primary text-primary' : ''}`}
                        >
                            <IconHome />
                            Home
                        </button>
                    </li>
                </ul>
            </div>
            {tabs === 'home' ? (
                <div>
                    <form onSubmit={handleSubmit(handleUpdateProfile)} className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                        <h6 className="mb-5 text-lg font-bold">General Information</h6>
                        <div className="flex flex-col sm:flex-row">
                            <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4">
                                <img src="/assets//images/profile-34.jpeg" alt="img" className="mx-auto h-20 w-20 rounded-full object-cover md:h-32 md:w-32" />
                            </div>
                            <div className=" w-full flex flex-col gap-3">
                                <div>
                                    <label htmlFor="username">User Name</label>
                                    <input id="username" {...register('username')} type="text" placeholder="Your name" className="form-input" />
                                    {errors.username && <span className="text-red-500">{errors.username.message}</span>}
                                </div>
                                <div>
                                    <label htmlFor="email">Email</label>
                                    <input id="email" {...register('email')} type="email" placeholder="example@gmail.com" className="form-input" />
                                    {errors.email && <span className="text-red-500">{errors.email.message}</span>}
                                </div>
                           
                                <div>
                                    <label htmlFor="avatar">avatar</label>
                                    <input id="avatar" {...register('avatar')} type="text" placeholder="https://example.com/images/avatar.jpg" className="form-input" />
                                    {errors.avatar && <span className="text-red-500">{errors.avatar.message}</span>}
                                </div>
                               
                                <div className="mt-3 sm:col-span-2">
                                    <button type="submit" className="btn btn-primary">
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default ComponentsUsersAccountSettingsTabs;
