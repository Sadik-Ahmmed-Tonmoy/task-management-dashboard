import ImageWithFallBackSystem from "@/components/ui/ImageWithFallBackSystem/ImageWithFallBackSystem";
import { cn } from "@/lib/utils";
import { StaticImageData } from "next/image";
import { FC } from "react";

interface CardWithTitleProps {
  image: string | StaticImageData;
  title: string;
  description?: string;
  className?: string;
  imageClassName?: string;
}

const CardWithTitle: FC<CardWithTitleProps> = ({
  image,
  title,
  description,
  className,
  imageClassName,
}) => {
  return (
    <div className={cn("text-white w-full", className)}>
      <ImageWithFallBackSystem
        imageSrc={image}
        className={cn("h-9 w-9 mb-3 md:mb-6", imageClassName)}
      />
      <div className="w-full">
        <p className="font-bold text-xl mb-2 md:mb-4">{title}</p>
        <p className="text-sm font-medium text-gray-light">{description}</p>
      </div>
    </div>
  );
};

export default CardWithTitle;
