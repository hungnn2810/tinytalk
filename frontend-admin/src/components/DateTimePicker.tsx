import { Box, FormLabel, Input } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/datetime-picker.css";

interface DateTimePickerProps<T> {
  name: keyof T;
  label?: string;
  className?: string;
}

export function DateTimePicker<T>({ name, label }: DateTimePickerProps<T>) {
  const { values, setFieldValue } = useFormikContext<T>();

  const value = values[name];
  const selectedDate =
    value && typeof value === "string"
      ? new Date(value)
      : (value as Date | null);

  const handleChange = useCallback(
    (date: Date | null) => {
      setFieldValue(name as string, date);
    },
    [name, setFieldValue]
  );

  return (
    <Box>
      {label && (
        <FormLabel
          mb={1}
          htmlFor={name as string}
          fontWeight="semibold"
          color="gray.700"
        >
          {label}
        </FormLabel>
      )}
      <DatePicker
        selected={selectedDate}
        onChange={handleChange}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat="yyyy-MM-dd HH:mm"
        placeholderText="Select date & time"
        customInput={<Input />}
      />
    </Box>
  );
}
