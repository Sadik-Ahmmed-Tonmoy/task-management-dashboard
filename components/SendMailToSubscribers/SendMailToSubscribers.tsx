'use client';
import MyFormInput from '@/components/ui/MyForm/MyFormInput/MyFormInput';
import MyFormTextArea from '@/components/ui/MyForm/MyFormTextArea/MyFormTextArea';
import MyFormWrapper from '@/components/ui/MyForm/MyFormWrapper/MyFormWrapper';
import { useGetAllNewsLetterSubscriptionQuery, useSendMailToAllUsersMutation } from '@/redux/features/newsLetter/newsLetterApi';
import { handleAsyncWithToast } from '@/utils/handleAsyncWithToast';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { z } from 'zod';

const validationSchema = z.object({
    subject: z
        .string({
            required_error: 'Subject is required',
        })
        .min(1, 'Subject is required')
        .max(500, 'Subject cannot be longer than 500 characters'),
        text: z
        .string({
            required_error: 'This Field is required',
        })
        .min(1, 'This Field is required'),
});

const SendMailToSubscribers = () => {
    const [emails, setEmails] = useState<string[]>([]);
    const { data: getAllNewsLetter, isLoading } = useGetAllNewsLetterSubscriptionQuery({ page: 1, limit: 100000000000 });
    const [sendMailToAllUsersMutation] = useSendMailToAllUsersMutation();
const router = useRouter()
    useEffect(() => {
        // Safely mapping emails if subscriptions exist
        const allEmails = getAllNewsLetter?.data?.subscriptions?.map((subscriber: any) => subscriber.email) || [];
        setEmails(allEmails);
    }, [getAllNewsLetter]);

    const handleSubmit = async (data: any, reset: () => void) => {
        try {
            const res = await handleAsyncWithToast(
                async () => {
                    // Replace this with your actual mutation or API call
                    return sendMailToAllUsersMutation({ email: emails, text: data?.text, subject: data?.subject }); // Or your custom mutation to handle form data
                },
                'Commenting...',
                'Comment successful!',
                'Comment failed. Please try again.'
            );

            // Check if submission was successful
            if (res?.data?.success) {
                reset();
                Swal.fire('Success!', 'Email sent successfully to all subscribers!', 'success');
                router.push('/news-letter') // Navigate to subscribers page after successful submission
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="mx-auto  max-w-5xl">
                <h3 className='text-center text-3xl font-semibold'>Send Mail To All Subscribers</h3>
            <MyFormWrapper className={'flex w-full flex-col gap-6'} onSubmit={handleSubmit} resolver={zodResolver(validationSchema)}>
                <div className="flex flex-col gap-5 md:flex-row">
                    <div className="flex w-full flex-col gap-5">
                        <div className="w-full">
                            <MyFormInput label="Subject" name={'subject'} />
                        </div>
                        <div className="w-full">
                            <MyFormTextArea label="Your Text for subscribers" name={'text'} placeHolder="Your Message" />
                        </div>
                    </div>
                </div>
                <button className="mx-auto w-full rounded-lg bg-green-400 py-2 text-white " type="submit">
                    Submit
                </button>
            </MyFormWrapper>
        </div>
    );
};

export default SendMailToSubscribers;
