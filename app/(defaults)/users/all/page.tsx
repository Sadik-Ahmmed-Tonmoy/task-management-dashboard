'use client'
import UserTable from '@/components/components/userTable/userTable';
import React, { useState } from 'react';
import type { PaginationProps } from 'antd';
import { Pagination } from 'antd';
import { useGetAllUsersQuery } from '@/redux/features/auth/authApi';


const AllUserPage = () => {
    const [current, setCurrent] = useState(1);
    const [limit, setLimit] = useState(10);  // Default limit is 10
console.log(current, "current");
    const onChange: PaginationProps['onChange'] = (page) => {
      setCurrent(page);
    };

    // Call the hook with page and limit values
    const { data, error, isLoading } = useGetAllUsersQuery({ current, limit });
    console.log(data);
    

    const usersData = {
        success: true,
        message: 'reword date count success',
        meta: {
          limit: 10,
          page: 2,
          total: 21,
          totalPage: 3,
        },
        data: [
          {
            _id: '670dfdf6f3a8d5bfb7376ad1',
            email: 'akonhasan680@gmail.com',
            username: 'mdHasan',
            role: 'user',
            level: 1,
            myPoints: 0,
            isActive: true,
            lastClaimDate: '2024-10-15T05:30:30.766Z',
            createdAt: '2024-10-15T05:30:30.770Z',
          },
          {
            _id: '670e128c449c18ca6b987311',
            email: 'humhungama@gmail.com',
            username: 'hungamahum',
            role: 'user',
            level: 1,
            myPoints: 0,
            isActive: true,
            lastClaimDate: '2024-10-15T06:58:20.587Z',
            createdAt: '2024-10-15T06:58:20.591Z',
          },
          // Other users...
        ],
      };



    return (
        <div>
         <UserTable users={data?.data} />
         <div className="flex justify-center mt-3">

         <Pagination current={current} onChange={onChange} total={data?.meta?.total} />
         </div>
        </div>
    );
};

export default AllUserPage;