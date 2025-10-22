import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import type { JSX } from "@emotion/react/jsx-runtime";
import { useField } from "formik";
import { COLOR_CODE } from "../constants/colorCode";

interface IInputFieldProps {
  name: string;
  label?: string;
}

export const ColorPicker = (props: IInputFieldProps): JSX.Element => {
  const { label } = props;
  const [field, , helpers] = useField(props.name);
  const selected = field.value;

  return (
    <FormControl>
      {/* Label */}
      {label && (
        <FormLabel mb="1" htmlFor={props.name}>
          {label}
        </FormLabel>
      )}
      {/* <InputGroup> */}
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant="outline"
          px={3}
          py={2}
        >
          <Box
            w="24px"
            h="24px"
            borderRadius="full"
            bg={selected}
            border="1px solid"
            borderColor="gray.200"
          />
        </MenuButton>

        <MenuList
          p={2}
          minW="auto"
          boxShadow="lg"
          borderRadius="md"
          display="inline-block"
        >
          <Grid
            templateColumns="repeat(5, 1fr)"
            gap={2}
            justifyItems="center"
            alignItems="center"
          >
            {COLOR_CODE.map((color) => (
              <GridItem key={color}>
                <Box
                  w="8"
                  h="8"
                  borderRadius="full"
                  bg={color}
                  cursor="pointer"
                  border={
                    selected === color
                      ? "3px solid #4A148C"
                      : "2px solid transparent"
                  }
                  transition="all 0.2s"
                  _hover={{ transform: "scale(1.1)" }}
                  onClick={() => helpers.setValue(color)}
                />
              </GridItem>
            ))}
          </Grid>
        </MenuList>
      </Menu>
      {/* </InputGroup> */}
    </FormControl>
  );
};
