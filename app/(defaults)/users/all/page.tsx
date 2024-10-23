'use client';
import TableForAllUsers from '@/components/components/tableForAllUsers/tableForAllUsers';
import { useGetAllUsersQuery } from '@/redux/features/auth/authApi';
import { useState } from 'react';

const AllUserPage = () => {
    const [page, setCurrent] = useState(1);
    const [pageSize, setLimit] = useState(10); // Default limit is 10
    const { data, error, isLoading, isSuccess } = useGetAllUsersQuery({ page, pageSize });
    // const onChange: PaginationProps['onChange'] = (page) => {
    //     setCurrent(page);
    // };

    // Call the hook with page and limit values
    // const { data, error, isLoading } = useGetAllUsersQuery({ current, limit });

    return (
        <div>
            {/* <UserTable users={data?.data} /> */}
            <div className="mt-3 flex justify-center">{/* <Pagination current={current} onChange={onChange} total={data?.meta?.total} /> */}</div>

            {/* <ComponentsDatatablesAdvanced /> */}
            <TableForAllUsers />
        </div>
    );
};

export default AllUserPage;
