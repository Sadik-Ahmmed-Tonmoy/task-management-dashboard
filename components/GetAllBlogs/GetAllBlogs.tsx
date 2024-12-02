'use client';
import { useGetAllBlogsQuery } from '@/redux/features/blog/blogApi';
import React, { useState } from 'react';
import BlogCard from '../cards/BlogCard/BlogCard';
import { isNonEmptyArray } from '@/utils/isNonEmptyArray';
import { Pagination, PaginationProps } from 'antd';

const GetAllBlogs = () => {
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const { data: getAllBlogs } = useGetAllBlogsQuery({ page, limit });
 
    console.log(getAllBlogs?.data);
    const onChange: PaginationProps['onChange'] = (page) => {
        
        setPage(page);
      };
    return (
        <div>
            <h3 className='text-center text-3xl my-3 font-semibold'>All Blogs</h3>
            <div className="xs:grid-cols-2 container grid grid-cols-1 gap-4 py-10 md:grid-cols-3 lg:grid-cols-4">
                {isNonEmptyArray(getAllBlogs?.data?.blogs) &&
                    getAllBlogs?.data?.blogs.map((item: any) => (
                        <BlogCard
                            key={item._id}
                            imageSrc={item.banner}
                            author={item?.authorId?.username}
                            date={item.createdAt}
                            title={item.title}
                            description={item.content}
                            readMoreLink={`/blog/${item._id}`}
                        />
                    ))}
            </div>
       <div className='my-3 flex justify-center'>
       <Pagination current={page} onChange={onChange} total={getAllBlogs?.data?.totalBlogs} />
       </div>
        </div>
    );
};

export default GetAllBlogs;
