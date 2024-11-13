import { Form, Select } from "antd";
import { Controller, useFormContext } from "react-hook-form";
import { SelectProps } from "antd";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import "./MyFormSelect.css";

interface MyFormSelectProps {
  label: string;
  name: string;
  options?: SelectProps["options"];
  disabled?: boolean;
  mode?: "multiple" | "tags"; // these are the two modes supported by Ant Design's Select
  placeHolder: string;
  className?: string;
  defaultValue?: any; // Allow setting a default value for the select
}

const MyFormSelect = ({
  label,
  name,
  options,
  disabled,
  mode,
  placeHolder,
  className,
  defaultValue,
}: MyFormSelectProps) => {
  const { control, setValue } = useFormContext();

  // If a defaultValue is provided, set it programmatically using `setValue`
  useEffect(() => {
    if (defaultValue !== undefined) {
      setValue(name, defaultValue); // Set the value using react-hook-form's setValue
    }
  }, [defaultValue, name, setValue]);

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <div className="flex flex-col justify-center gap-1">
          <p className="ps-1">{label}</p>
          <Form.Item
            style={{ marginBottom: "0px" }}
            className={cn(
              "focus:!border-[#7F56D9] hover:!border-[#7F56D9] py-",
              className
            )}
          >
            <Select
              mode={mode}
              style={{ width: "100%" }}
              className={cn(
                "focus:!border-[#7F56D9] hover:!border-[#7F56D9] py-",
                className
              )}
              {...field}
              options={options}
              size="large"
              disabled={disabled}
              placeholder={placeHolder}
            />

            {error && <small style={{ color: "red" }}>{error.message}</small>}
          </Form.Item>
        </div>
      )}
    />
  );
};

export default MyFormSelect;
