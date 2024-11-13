'use client'
import IconCalendar from '@/components/icon/icon-calendar';
import IconClock from '@/components/icon/icon-clock';
import IconCoffee from '@/components/icon/icon-coffee';
import IconCreditCard from '@/components/icon/icon-credit-card';
import IconDribbble from '@/components/icon/icon-dribbble';
import IconGithub from '@/components/icon/icon-github';
import IconMail from '@/components/icon/icon-mail';
import IconMapPin from '@/components/icon/icon-map-pin';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconPhone from '@/components/icon/icon-phone';
import IconShoppingBag from '@/components/icon/icon-shopping-bag';
import IconTag from '@/components/icon/icon-tag';
import IconTwitter from '@/components/icon/icon-twitter';
import ComponentsUsersProfilePaymentHistory from '@/components/users/profile/components-users-profile-payment-history';
import { useGetUserDataQuery } from '@/redux/features/auth/authApi';
import { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import moment from 'moment';
import ReactLoading from 'react-loading';


const Profile = () => {

    const {data : userData, isLoading} = useGetUserDataQuery(undefined)


    if (isLoading) {
        return (
            <div className="flex h-[calc(100vh-200px)] items-center justify-center">
                <ReactLoading type={'bars'} color={'#4361ee'} height={'5%'} width={'5%'} className="mx-auto" />
            </div>
        );
    }
    return (
        <div>
            <ul className="flex space-x-2 rtl:space-x-reverse">
                <li>
                    <Link href="#" className="text-primary hover:underline">
                        Users
                    </Link>
                </li>
                <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2">
                    <span>Profile</span>
                </li>
            </ul>
            <div className="pt-5">
                <div className="panel max-w-96 mx-auto">
                    <div className="mb-5 flex items-center justify-between">
                        <h5 className="text-lg font-semibold dark:text-white-light">Profile</h5>
                        <Link href="/users/user-account-settings" className="btn btn-primary rounded-full p-2 ltr:ml-auto rtl:mr-auto">
                            <IconPencilPaper />
                        </Link>
                    </div>
                    <div className="mb-5">
                        <div className="flex flex-col items-center justify-center">
                            <img src="/assets/images/profile-34.jpeg" alt="img" className="mb-5 h-24 w-24 rounded-full  object-cover" />
                            <p className="text-xl font-semibold text-primary">{userData?.data?.username}</p>
                        </div>
                        <ul className="m-auto mt-5 flex max-w-[160px] flex-col space-y-4 font-semibold text-white-dark">
                            <li className="flex items-center gap-2">
                                <IconCoffee className="shrink-0" /> {userData?.data?.role}
                            </li>
                            <li className="flex items-center gap-2">
                                <IconCalendar className="shrink-0" />
                                {moment(userData?.data?.createdAt).format('MMMM Do, YYYY [at] h:mm A')}
                            </li>
                            {/* <li className="flex items-center gap-2">
                                <IconMapPin className="shrink-0" />
                                New York, USA
                            </li> */}
                            <li>
                                <button className="flex items-center gap-2">
                                    <IconMail className="h-5 w-5 shrink-0" />
                                    <span className="truncate text-primary">{userData?.data?.email}</span>
                                </button>
                            </li>
                            {/* <li className="flex items-center gap-2">
                                <IconPhone />
                                <span className="whitespace-nowrap" dir="ltr">
                                    +1 (530) 555-12121
                                </span>
                            </li> */}
                        </ul>
                        {/* <ul className="mt-7 flex items-center justify-center gap-2">
                            <li>
                                <button className="btn btn-info flex h-10 w-10 items-center justify-center rounded-full p-0">
                                    <IconTwitter className="h-5 w-5" />
                                </button>
                            </li>
                            <li>
                                <button className="btn btn-danger flex h-10 w-10 items-center justify-center rounded-full p-0">
                                    <IconDribbble />
                                </button>
                            </li>
                            <li>
                                <button className="btn btn-dark flex h-10 w-10 items-center justify-center rounded-full p-0">
                                    <IconGithub />
                                </button>
                            </li>
                        </ul> */}
                    </div>
                </div>
              
            </div>
        </div>
    );
};

export default Profile;
