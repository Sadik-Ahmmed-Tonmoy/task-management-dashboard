"use client";
import ImageWithFallBackSystem from "@/components/ui/ImageWithFallBackSystem/ImageWithFallBackSystem";

import { Rate } from "antd";
import { StaticImageData } from "next/image";
import Link from "next/link";
import React, { FC } from "react";

interface ReviewCardProps {
  image: string | StaticImageData;
  icon: string | StaticImageData;
  title: string;
  description: string;
}
const ReviewCard: FC<ReviewCardProps> = ({
  icon,
  image,
  title,
  description,
}) => {
  return (
    <div className="bg-[#36607b] px-4 py-6 rounded">
      <div className="relative h-6 w-[70px] mb-6">
        <ImageWithFallBackSystem imageSrc={icon} alt="Review Card Image" />
      </div>
      <div className="flex items-center gap-2">
        <div className="rounded-full overflow-hidden h-10 w-10">
          <ImageWithFallBackSystem imageSrc={image} alt="Review Card Image" />
        </div>
        <div>
          <p className="text-base font-bold text-white">David London NW3</p>
          <p className="text-sm font-medium text-gray-light">
            September 12, 2022
          </p>
        </div>
      </div>
      <Rate
        disabled
        defaultValue={5}
        style={{ fontSize: 16 }}
        className="mt-2 mb-3"
      />
      <div>
        <h2 className="text-xl font-bold text-white h-14 overflow-hidden">
          {title?.length > 35 ? (
            <span>{title?.substring(0, 35)}...</span>
          ) : (
            <span>{title}</span>
          )}
        </h2>
        <p className="text-sm font-medium text-gray-light mt-1 h-16 overflow-hidden">
          {description?.length > 85 ? (
            <span>{description?.substring(0, 85)}...</span>
          ) : (
            <span>{description}</span>
          )}
        </p>
        {description?.length > 85 && (
          <Link href={"readMoreLink"}>
            <p className="text-base font-bold mt-4 text-green-primary flex items-center gap-1 cursor-pointer">
              See More
            </p>
          </Link>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
