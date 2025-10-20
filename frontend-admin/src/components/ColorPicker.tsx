import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Grid,
  GridItem,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { useField } from "formik";
import { CLASS_COLORS } from "../constants/classColor";

export const ColorPicker = ({ name }: { name: string }) => {
  const [field, , helpers] = useField(name);
  const selected = field.value;

  return (
    <Box>
      <Menu placement="bottom-start">
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
            {CLASS_COLORS.map((color) => (
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
    </Box>
  );
};
