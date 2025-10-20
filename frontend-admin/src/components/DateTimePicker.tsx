import { CalendarIcon } from "@chakra-ui/icons";
import {
  Box,
  FormLabel,
  Input,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { useField } from "formik";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
export const DateTimePicker = ({
  name,
  label,
}: {
  name: string;
  label?: string;
}) => {
  const [field, , helpers] = useField(name);
  const selected = field.value ? new Date(field.value) : null;

  return (
    <Box>
      {label && (
        <FormLabel fontWeight="medium" color="gray.700" mb={1}>
          {label}
        </FormLabel>
      )}

      <InputGroup>
        <InputLeftElement pointerEvents="none">
          <CalendarIcon color="gray.400" />
        </InputLeftElement>

        <DatePicker
          locale="en-GB"
          selected={selected}
          onChange={(date) => helpers.setValue(date)}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          dateFormat="yyyy-MM-dd HH:mm"
          placeholderText="Select date and time"
          popperPlacement="bottom-start"
          customInput={
            <Input
              bg="white"
              borderRadius="xl"
              boxShadow="sm"
              _hover={{ boxShadow: "md" }}
              _focus={{
                borderColor: "blue.400",
                boxShadow: "0 0 0 1px #4299e1",
              }}
              fontSize="sm"
              height="40px"
            />
          }
          popperClassName="chakra-datepicker"
        />
      </InputGroup>

      {/* ✅ Use plain <style> instead of <style jsx global> */}
      <style>{`
        .react-datepicker {
          border: none;
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
          border-radius: 16px;
          overflow: hidden;
          font-family: "Inter", sans-serif;
          font-size: 0.9rem;
        }

        .react-datepicker__header {
          background-color: #3182ce;
          color: white;
          border-bottom: none;
          padding-top: 10px;
        }

        .react-datepicker__current-month {
          font-weight: 600;
        }

        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #2b6cb0 !important;
          color: white;
          border-radius: 50%;
        }

        .react-datepicker__day:hover {
          background-color: rgba(49, 130, 206, 0.15);
          border-radius: 50%;
        }

        .react-datepicker__time-container {
          border-left: 1px solid #eee;
        }

        .react-datepicker__time-list-item--selected {
          background-color: #2b6cb0 !important;
          color: white !important;
        }

        .react-datepicker__triangle {
          display: none;
        }
      `}</style>
    </Box>
  );
};
