
import React, { useEffect } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { cn } from "@/lib/utils";

type TCheckboxProps = {
  name: string;
  label?: string;
  parentClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  defaultValue?: boolean;
  [key: string]: any; // Allow other props
};

const MyFormCheckboxHTML = ({
  name,
  label,
  parentClassName = "",
  labelClassName = "",
  inputClassName = "",
  defaultValue,
  ...rest
}: TCheckboxProps) => {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    if (defaultValue !== undefined) {
      // This will set the initial value of the checkbox programmatically
      setValue(name, defaultValue);
    }
  }, [defaultValue, name, setValue]);

  return (
    <div className={cn(`form-group`, parentClassName)}>
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState: { error } }) => (
          <div className="flex items-center gap-2">
              {label && <label htmlFor={name} className={cn(labelClassName)}>{label}</label>}
            <input
              id={name}
              {...field}
              type="checkbox"
              checked={!!field.value} // Ensure the checkbox is always controlled
              className={cn("border border-gray-300 rounded-sm", inputClassName)}
              {...rest}
            />
          
            {error && <small style={{ color: "red" }}>{error.message}</small>}
          </div>
        )}
      />
    </div>
  );
};

export default MyFormCheckboxHTML;
