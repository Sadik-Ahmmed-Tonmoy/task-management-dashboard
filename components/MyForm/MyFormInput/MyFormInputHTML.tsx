/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type TInputProps = {
  name: string;
  label?: string;
  type?: string;
  size?: string;
  parentClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  defaultValue?: any;
  [key: string]: any; // Allow other props
}

const MyFormInputHTML = ({
  name,
  label,
  type = "text",
  size = "medium",
  parentClassName = "",
  labelClassName = "",
  inputClassName = "",
  defaultValue,
  ...rest
}: TInputProps) => {
  const { control, setValue  } = useFormContext();


  useEffect(() => {
    if (defaultValue !== undefined) {
      // This will set the initial value of the input field programmatically
      setValue(name, defaultValue);
    }
  }, [defaultValue, name, setValue]);

  return (
    <div className={cn(`form-group ${size}`, parentClassName)}>
      {label && <p className={cn("mb-2", labelClassName)}>{label}</p>}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
        <>
          <input
            id={name}
            {...field}
            type={type}
            value={field.value || ""} // Ensure the input is always controlled
            className={cn("border border-gray-300 rounded-md p-2 w-full", inputClassName)}
            {...rest}
          />
            {error && <small style={{ color: "red" }}>{error.message}</small>}</>
        )}
      />
    </div>
  );
};

export default MyFormInputHTML;
