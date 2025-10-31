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
          mb="2"
          htmlFor={name as string}
          fontWeight="600"
          fontSize="sm"
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
        dateFormat="dd/MM/yyyy HH:mm"
        placeholderText="Select date & time"
        customInput={
          <Input
            focusBorderColor="purple.500"
            borderRadius="lg"
            borderColor="gray.200"
            _hover={{
              borderColor: "purple.300",
            }}
            _focus={{
              borderColor: "purple.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-purple-500)",
            }}
            transition="all 0.2s"
            bg="white"
          />
        }
        popperClassName="date-picker-popper"
        popperPlacement="bottom-start"
      />
    </Box>
  );
}
