import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ReactNode } from "react";
import { FieldValues, FormProvider, SubmitHandler, useForm, UseFormReset } from "react-hook-form";
import { ZodSchema } from "zod";

// Define the type for the props
interface MyFormWrapperProps<T extends FieldValues> {
  children: ReactNode; // for the form fields passed as children
  onSubmit: (data: T, reset: UseFormReset<T>) => void; // Updated to handle reset function
  className?: string; // optional class name for styling
  validationSchema: ZodSchema<T>; // Zod schema for validation
}

const MyFormWrapper = <T extends FieldValues>({
  children,
  onSubmit,
  className,
  validationSchema,
}: MyFormWrapperProps<T>) => {
  const methods = useForm<T>({
    resolver: zodResolver(validationSchema),
  });

  const submit: SubmitHandler<T> = (data) => {
    onSubmit(data, methods.reset); // Pass data and reset function to onSubmit
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(submit)} className={cn("", className)}>
        {children}
      </form>
    </FormProvider>
  );
};

export default MyFormWrapper;
