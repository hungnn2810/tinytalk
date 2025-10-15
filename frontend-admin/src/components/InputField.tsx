import {
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useField } from "formik";
import type { ReactNode } from "react";

interface IInputFieldProps {
  name: string;
  type?: string;
  label?: string;
  leftAddon?: ReactNode;
  placeholder?: string;
}

export const InputField = (props: IInputFieldProps): JSX.Element => {
  const { label, leftAddon, ...restofProps } = props;
  const [field, meta] = useField(props);
  return (
    <FormControl id={props.name} isInvalid={!!meta.error && !!meta.touched}>
      {/* Label */}
      {label && (
        <FormLabel mb="1" htmlFor={props.name}>
          {label}
        </FormLabel>
      )}

      {/* Input */}
      <InputGroup>
        {leftAddon && <InputLeftAddon bg="purple.50" children={leftAddon} />}
        <Input focusBorderColor="purple.500" {...field} {...restofProps} />
      </InputGroup>

      {/* Error message */}
      {meta.error && meta.touched && (
        <FormHelperText>{meta.error}</FormHelperText>
      )}
    </FormControl>
  );
};
