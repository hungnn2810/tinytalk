import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";
import { CreateLibraryModal } from "./CreateLibrary";

interface Library {
  id: string;
  name: string;
}

export default function LibraryPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null);

  const libraries: Library[] = [
    { id: "1", name: "English Spelling" },
    { id: "2", name: "Math Homework" },
    { id: "3", name: "Science Project" },
  ];

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Box pt={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">My Library</Heading>
        <Button
          bgGradient="linear(to-r, purple.500, purple.600)"
          color="white"
          borderRadius="full"
          px={6}
          size="md"
          fontWeight="600"
          fontSize="sm"
          _hover={{
            bgGradient: "linear(to-r, purple.600, purple.700)",
            transform: "translateY(-2px)",
            boxShadow: "lg",
          }}
          boxShadow="md"
          transition="all 0.2s"
          leftIcon={<AddIcon />}
          onClick={() => openModal()}
        >
          New library
        </Button>
      </Flex>

      {/* Modal controlled by state */}
      <CreateLibraryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={() => {
          // fetch lại danh sách class
          // searchLibrary({ page, limit: 20 }).then((res) => {
          //   setData(res.data);
          //   setMetadata(res.metadata);
          // });
        }}
      />

      <Box
        w="full"
        rounded="2xl"
        shadow="sm"
        bg="white"
        mt={6}
        p={{ base: 4, md: 6 }}
      >
        <Flex borderRadius="lg">
          {/* LEFT SIDE */}
          <Box w="300px" borderRightWidth="1px" p={4}>
            <VStack align="stretch" spacing={3}>
              {libraries.map((lib) => (
                <Card
                  key={lib.id}
                  cursor="pointer"
                  borderWidth={selectedLibrary === lib.id ? "2px" : "1px"}
                  borderColor={
                    selectedLibrary === lib.id ? "purple.400" : "gray.200"
                  }
                  bg={selectedLibrary === lib.id ? "purple.50" : "white"}
                  transition="all 0.2s"
                  _hover={{ borderColor: "purple.300", bg: "gray.50" }}
                  onClick={() => setSelectedLibrary(lib.id)}
                >
                  <CardBody py={2} px={3}>
                    <Text fontWeight="medium" color="gray.800">
                      {lib.name}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          </Box>

          {/* RIGHT SIDE */}
          <Box flex="1" p={6}>
            {selectedLibrary ? (
              <>
                <Text fontWeight="bold" fontSize="xl" mb={4} color="purple.600">
                  📝 Homework for{" "}
                  {libraries.find((l) => l.id === selectedLibrary)?.name}
                </Text>
                <VStack align="stretch" spacing={3}>
                  {/* {homeworks[selectedLibrary]?.map((hw, i) => (
                    <Box
                      key={i}
                      p={3}
                      borderWidth="1px"
                      borderRadius="md"
                      bg="white"
                      _hover={{ bg: "gray.50" }}
                    >
                      <Text>{hw}</Text>
                    </Box>
                  ))} */}
                </VStack>
              </>
            ) : (
              <Flex justify="center" align="center" h="100%">
                <Text color="gray.500">
                  Chọn một thư viện để xem bài tập 📖
                </Text>
              </Flex>
            )}
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
