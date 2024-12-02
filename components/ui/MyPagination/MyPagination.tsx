'use client';
import { Pagination, PaginationProps } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

interface MyPaginationProps {
    currentPage: number; // The current page number
    totalBlogs: number; // The total number of blogs (for pagination calculation)
    defaultPageSize: number; // The number of items per page (pagination size)
}

const MyPagination: React.FC<MyPaginationProps> = ({
    currentPage,
    totalBlogs,
    defaultPageSize,
}) => {
    return (
        <div className="flex justify-center">
            <Pagination
                current={currentPage}
                total={totalBlogs}
                defaultPageSize={defaultPageSize} // Set the page size to match your limit
            />
        </div>
    );
};

export default MyPagination;
