import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  type SelectProps,
} from "@chakra-ui/react";
import { useField } from "formik";

interface ISelectFieldProps extends SelectProps {
  name: string;
  label?: string;
  placeholder?: string;
  children?: React.ReactNode;
}

export const SelectField = (props: ISelectFieldProps) => {
  const { label, placeholder, children, ...restOfProps } = props;
  const [field, meta] = useField(props);

  return (
    <FormControl id={props.name} isInvalid={!!meta.error && !!meta.touched}>
      {/* Label */}
      {label && (
        <FormLabel mb="1" htmlFor={props.name}>
          {label}
        </FormLabel>
      )}

      {/* Select */}
      <Select
        {...field}
        {...restOfProps}
        placeholder={placeholder}
        focusBorderColor="purple.500"
        borderRadius="lg"
      >
        {children}
      </Select>

      {/* Error message */}
      <Box minH="20px" mt="1">
        <FormErrorMessage m="0" fontSize="sm">
          {meta.touched ? meta.error : ""}
        </FormErrorMessage>
      </Box>
    </FormControl>
  );
};
