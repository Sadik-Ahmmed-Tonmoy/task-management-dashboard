import { Form, Select } from "antd";
import { Controller } from "react-hook-form";
// import { ControllerProps } from "react-hook-form";

import { SelectProps } from "antd";
import "./MyFormSelect.css";
import { cn } from "@/lib/utils";

interface MyFormSelectProps {
  label: string;
  name: string;
  options?: SelectProps["options"];
  disabled?: boolean;
  mode?: "multiple" | "tags"; // these are the two modes supported by Ant Design's Select
  placeHolder: string;
  className?: string;
}

const MyFormSelect = ({
  label,
  name,
  options,
  disabled,
  mode,
  placeHolder,
  className,
}: MyFormSelectProps) => {
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
