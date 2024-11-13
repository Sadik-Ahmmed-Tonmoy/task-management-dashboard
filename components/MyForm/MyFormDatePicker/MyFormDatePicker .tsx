import { Form, DatePicker } from "antd";
import { Controller } from "react-hook-form";
import { cn } from "@/lib/utils";

interface MyFormDatePickerProps {
  label: string;
  name: string;
  disabled?: boolean;
  placeholder: string;
  className?: string;
  format?: string; // Specify the date format for display, e.g., "YYYY-MM-DD"
}

const MyFormDatePicker = ({
  label,
  name,
  disabled,
  placeholder,
  className,
  format = "YYYY-MM-DD", // Default format
}: MyFormDatePickerProps) => {
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
            <DatePicker
              {...field}
              style={{ width: "100%" }}
              className={cn(
                "focus:!border-[#7F56D9] hover:!border-[#7F56D9] py-",
                className
              )}
              disabled={disabled}
              placeholder={placeholder}
              format={format}
              size="large"
            />

            {error && <small style={{ color: "red" }}>{error.message}</small>}
          </Form.Item>
        </div>
      )}
    />
  );
};

export default MyFormDatePicker;
