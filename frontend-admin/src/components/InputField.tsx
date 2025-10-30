import {
  Box,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
} from "@chakra-ui/react";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useField } from "formik";
import type { ReactNode } from "react";

interface IInputFieldProps {
  name: string;
  type?: string;
  label?: string;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  placeholder?: string;
}

export const InputField = (props: IInputFieldProps): JSX.Element => {
  const { label, leftAddon, rightAddon, ...restOfProps } = props;
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
        <Input focusBorderColor="purple.500" {...field} {...restOfProps} />
        {rightAddon && <InputRightAddon bg="purple.50" children={rightAddon} />}
      </InputGroup>

      <Box minH="20px" mt="1">
        <FormErrorMessage m="0" fontSize="sm">
          {meta.touched ? meta.error : ""}
        </FormErrorMessage>
      </Box>
    </FormControl>
  );
};
