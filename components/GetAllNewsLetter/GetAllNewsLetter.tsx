'use client';
import { useGetAllNewsLetterSubscriptionQuery } from '@/redux/features/newsLetter/newsLetterApi';
import { isNonEmptyArray } from '@/utils/isNonEmptyArray';
import React, { useState } from 'react';
import MyPagination from '../ui/MyPagination/MyPagination';
import { Pagination } from 'antd';
import { PaginationProps } from '@mantine/core';

const GetAllNewsLetter = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { data: getAllNewsLetter, isLoading } = useGetAllNewsLetterSubscriptionQuery({ page, limit });
    const onChange: PaginationProps['onChange'] = (page) => {
        setPage(page);
      };
    console.log(getAllNewsLetter?.data?.totalSubscriptions);
    if (isLoading) {
        return <div>Loading...</div>;
    }
    return (
        <div>
                <h3 className='text-center text-3xl my-3 font-semibold'>All Subscribers For News Letter</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                    <thead>
                        <tr>
                            <th className="border-b px-4 py-2 text-left">Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isNonEmptyArray(getAllNewsLetter?.data?.subscriptions) &&
                            getAllNewsLetter?.data?.subscriptions.map((item: any, index: number) => (
                                <tr key={index} className="hover:bg-gray-100">
                                    <td className="border-b px-4 py-2">{item.email}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
            {/* <MyPagination currentPage={page} defaultPageSize={10} totalBlogs={getAllNewsLetter?.data?.totalSubscriptions} /> */}
        <div className='flex  justify-center my-3'>
        <Pagination current={page} onChange={onChange} total={getAllNewsLetter?.data?.totalSubscriptions} />
        </div>
        </div>
    );
};

export default GetAllNewsLetter;
