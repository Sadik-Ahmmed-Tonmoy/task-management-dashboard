import account_circle from "@/assets/account_circle.svg";
import calendar_month from "@/assets/calendar_month.svg";
import ImageWithFallBackSystem from "@/components/ui/ImageWithFallBackSystem/ImageWithFallBackSystem";
import dayjs from "dayjs";
import { StaticImageData } from "next/image";
import Link from "next/link";
import { FC } from "react";
import { FaArrowRight } from "react-icons/fa6";

interface BlogCardProps {
  imageSrc: string | StaticImageData;
  author: string | undefined;
  date: string;
  title: string;
  description: string;
  readMoreLink: string;
}

const BlogCard: FC<BlogCardProps> = ({
  imageSrc,
  author,
  date,
  title,
  description,
  readMoreLink,
}) => {
  return (
    <div className="   overflow-hidden h-full">
      <div className="relative w-full h-40 rounded-md overflow-hidden">
        <ImageWithFallBackSystem imageSrc={imageSrc} alt="Blog Card Image" />
      </div>
      <div className="p-4">
        <div className="flex items-center text-sm text-gray-light space-x-2">
          <span className="flex items-center space-x-1">
            <div className="w-5 h-5 rounded-full overflow-hidden">
              <ImageWithFallBackSystem imageSrc={account_circle} />
            </div>
            <span className="font-medium text-sm whitespace-nowrap">
              {author}
            </span>
          </span>
          {date ? (
            <span className="flex items-center space-x-1">
              <div className="w-5 h-5 overflow-hidden">
                <ImageWithFallBackSystem imageSrc={calendar_month} />
              </div>
              <span className="font-medium text-sm whitespace-nowrap">
                {dayjs(date, "D MMMM, YYYY").format("D MMM YYYY")}
              </span>
            </span>
          ) : null}
        </div>
        <h2 className="text-xl font-bold text-gray-800 mt-2 h-14 overflow-hidden">
          {title?.length > 35 ? (
            <span>{title?.substring(0, 35)}...</span>
          ) : (
            <span>{title}</span>
          )}
        </h2>
        {/* <p className="text-sm font-medium text-gray-light mt-1 h-14 overflow-hidden">
          {description?.length > 85 ? (
            <span>{description?.substring(0, 85)}...</span>
          ) : (
            <span>{description}</span>
          )}
        </p> */}
        <div
  className="ql-editor disable-tailwind"
  dangerouslySetInnerHTML={{
    __html: description?.length > 85
      ? `${description?.substring(0, 85)}...`
      : description || ''
  }}
/>

        <Link href={readMoreLink}>
          <p className="text-base font-bold mt-4 text-[#84AA12] flex items-center gap-1 cursor-pointer">
           Update
            <span className="ml-1">
              <FaArrowRight />
            </span>
          </p>
        </Link>
      </div>
    </div>
  );
};

export default BlogCard;
