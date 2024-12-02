import React, { FC, ReactNode } from 'react';

interface InfoCardProps {
    icon: ReactNode,
    title: string,
    description: string,
}

const InfoCard : FC<InfoCardProps>= ({icon, title, description}) => {
    return (
        <div className='bg-[#F1F4F6] p-6 rounded-md'>
            <div className='bg-white p-1 mb-10 rounded w-fit'>
                {icon}
            </div>
            {title && <h5 className='text-base font-bold mb-2'>{title}</h5>}
            {description && <h5 className='text-sm font-medium text-gray-light'>{description}</h5>}
        </div>
    );
};

export default InfoCard;