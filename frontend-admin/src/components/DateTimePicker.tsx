import { Box, FormLabel, Input } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import { useCallback, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./styles/datetime-picker.css";

interface DateTimePickerProps<T> {
  name: keyof T;
  label?: string;
  className?: string;
  dateOnly?: boolean;
}

export function DateTimePicker<T>({
  name,
  label,
  dateOnly = false,
}: DateTimePickerProps<T>) {
  const { values, setFieldValue } = useFormikContext<T>();

  const value = values[name];

  const selectedDate = (() => {
    if (!value) return null;

    const date =
      typeof value === "string" ? new Date(value) : (value as unknown as Date);

    if (dateOnly && date) {
      // Create a new date with time set to 00:00:00
      const dateWithoutTime = new Date(date);
      dateWithoutTime.setHours(0, 0, 0, 0);
      return dateWithoutTime;
    }

    return date;
  })();

  const handleChange = useCallback(
    (date: Date | null) => {
      if (!date) {
        setFieldValue(name as string, null);
        return;
      }

      if (dateOnly) {
        const utcString = new Date(
          Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            0,
            0,
            0
          )
        ).toISOString();
        setFieldValue(name as string, utcString);
      } else {
        setFieldValue(name as string, date.toISOString());
      }
    },
    [name, setFieldValue, dateOnly]
  );

  useEffect(() => {
    if (dateOnly && value) {
      const date =
        typeof value === "string"
          ? new Date(value)
          : (value as unknown as Date);

      // Nếu giờ khác 0,0,0,0 thì reset
      if (
        date.getHours() !== 0 ||
        date.getMinutes() !== 0 ||
        date.getSeconds() !== 0 ||
        date.getMilliseconds() !== 0
      ) {
        const utcString = new Date(
          Date.UTC(
            date.getFullYear(),
            date.getMonth(),
            date.getDate(),
            0,
            0,
            0,
            0
          )
        ).toISOString();

        setFieldValue(name as string, utcString, false);
      }
    }
  }, [dateOnly, value, name, setFieldValue]);

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
        showTimeSelect={!dateOnly}
        timeFormat="HH:mm"
        timeIntervals={15}
        dateFormat={dateOnly ? "dd/MM/yyyy" : "dd/MM/yyyy HH:mm"}
        placeholderText={dateOnly ? "Select date" : "Select date & time"}
        portalId="1"
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
