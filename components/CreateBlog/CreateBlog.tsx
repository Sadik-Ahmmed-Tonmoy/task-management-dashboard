'use client';
import MyFormImageUpload from '@/components/ui/MyForm/MyFormImageUpload/MyFormImageUpload';
import MyFormInput from '@/components/ui/MyForm/MyFormInput/MyFormInput';
import MyFormWrapper from '@/components/ui/MyForm/MyFormWrapper/MyFormWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import ImageScaleton from '@/assets/ImageScaleton.png';
import Image from 'next/image';
import { z } from 'zod';
import { FC, useState } from 'react';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { useCreateBlogMutation } from '@/redux/features/blog/blogApi';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { useRouter } from 'next/navigation';

const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

const modules = {
    toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [{ font: [] }],
        [{ size: [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        [{ align: [] }],
        ['link', 'image', 'video'],
        ['clean'],
    ],
};

const formats = [
    'header',
    'font',
    'size',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list', // Ensure 'list' format is included
    'bullet', // Ensure 'bullet' format is included
    'indent',
    'link',
    'image',
    'video',
    'align',
];

const validationSchema = z.object({
    title: z
        .string({
            required_error: 'Title is required',
        })
        .min(1, 'Title is required')
        .max(100, 'Title cannot be longer than 100 characters'),
    category: z
        .string({
            required_error: 'Category is required',
        })
        .min(1, 'Category is required')
        .max(100, 'Category cannot be longer than 100 characters'),
    image: z.instanceof(File).refine((file) => (file ? file.size <= 50 * 1024 * 1024 : true), {
        message: 'Image size must be less than 50MB',
    }),
});

const CreateBlog = () => {
    const [createBlogMutation] = useCreateBlogMutation();
    const [content, setContent] = useState('');
    const router = useRouter()
    const handleSubmit = async (data: any, reset: () => void) => {
        
        const formData = new FormData();
        if (data.image) {
            formData.append('image', data.image);
        }
        
        const body = {
            content: content, // Set the content from ReactQuill
            category: data.category,
            title: data.title,
        };
        console.log(body);
        
        // Append the body object as a JSON string
        formData.append('data', JSON.stringify(body));

        try {
            const res = await handleAsyncWithToast(
                async () => {
                    // Replace this with your actual mutation or API call
                    return createBlogMutation(formData); // Or your custom mutation to handle form data
                },
                'Commenting...',
                'Comment successful!',
                'Comment failed. Please try again.'
            );

            // Check if submission was successful
            if (res?.data?.success) {
                reset();
                setContent(''); // Reset content after successful submission
                router.push('/blog')
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    return (
        <div className="container w-full">
            <div className="my-10 md:my-20">
                <h3 className='text-center text-3xl font-semibold'>Create Blog</h3>
                <MyFormWrapper className={'flex w-full flex-col gap-6'} onSubmit={handleSubmit} resolver={zodResolver(validationSchema)}>
                    <div className="w-full">
                        {/* ReactQuill Editor */}
                        <div className="my-4">
                            <ReactQuill theme="snow" value={content} onChange={setContent} modules={modules} formats={formats} className="h-60" />
                        </div>
                    </div>

                    <div className="flex flex-col gap-5 md:flex-row mt-10">
                        <div className="flex w-full flex-col gap-5">
                            <div className="w-full">
                                <MyFormInput label="Title" name={'title'} placeHolder="Blog Title" />
                            </div>
                            <div className="w-full">
                                <MyFormInput label="Category" name={'category'} placeHolder="Provide category" />
                            </div>
                        </div>
                        <div className="h-full w-full ">
                            <div className="h-full w-full ">
                                <MyFormImageUpload label="Your Image" name={'image'} previewImageClassName="h-[225px]">
                                    <div className="flex h-[225px] w-full cursor-pointer items-center justify-center rounded-lg border border-dashed">
                                        <div>
                                            <Image src={ImageScaleton} height={80} width={80} alt="image" className="mx-auto" />
                                            <p className="text-gray-light text-base font-medium">
                                                Click here and
                                                <span className="text-green-primary ps-1">Upload your image</span>
                                            </p>
                                        </div>
                                    </div>
                                </MyFormImageUpload>
                            </div>
                        </div>
                    </div>

                    <button className="mx-auto w-full rounded-lg bg-green-400 py-2 text-white" type="submit">
                        Submit
                    </button>
                </MyFormWrapper>
            </div>
        </div>
    );
};

export default CreateBlog;
