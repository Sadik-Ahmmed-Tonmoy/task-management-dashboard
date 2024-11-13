import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { ReactNode } from "react";
import {
  FieldValues,
  FormProvider,
  SubmitHandler,
  useForm,
  UseFormReset,
  DefaultValues, // Import DefaultValues
} from "react-hook-form";
import { ZodSchema } from "zod";

// Define the type for the props
interface MyFormWrapperProps<T extends FieldValues> {
  children: ReactNode; // Form fields passed as children
  onSubmit: (data: T, reset: UseFormReset<T>) => void; // Handle data and reset function
  className?: string; // Optional class name for styling
  validationSchema: ZodSchema<T>; // Zod schema for validation
  defaultValues?: DefaultValues<T>; // Use DefaultValues instead of Partial<T>
}

const MyFormWrapper = <T extends FieldValues>({
  children,
  onSubmit,
  className,
  validationSchema,
  defaultValues,
}: MyFormWrapperProps<T>) => {
  // Initialize useForm with resolver and defaultValues
  const methods = useForm<T>({
    resolver: zodResolver(validationSchema),
    defaultValues, // Assign default values if provided
  });

  // Define the submit handler
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
