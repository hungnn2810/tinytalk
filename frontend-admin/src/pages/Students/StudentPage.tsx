import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";
import { InputField } from "../../components/InputField";

export default function StudentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);

  return (
    <Box pt={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">My Students</Heading>
        <Button colorScheme="purple" leftIcon={<AddIcon />} onClick={openModal}>
          Register new student
        </Button>
      </Flex>

      <Box w="full" rounded="2xl" shadow="sm" bg="white" mt={6}>
        <InputField
          name="username"
          type="text"
          label="Phone Number"
          placeholder="0912345678"
          rightAddon={<SearchIcon color="purple.500" />}
        />
      </Box>
    </Box>
  );
}
