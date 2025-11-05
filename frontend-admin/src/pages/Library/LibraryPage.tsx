import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Card,
  CardBody,
  Flex,
  Heading,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import type { SearchResponse } from "../../models/base/search.model";
import type { Library } from "../../models/library.model";
import { searchHomework } from "../../services/homework.service";
import { searchLibrary } from "../../services/library.service";
import { CreateLibraryModal } from "./CreateLibrary";

export default function LibraryPage() {
  const toast = useToast();
  const [data, setData] = useState<Library[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState<SearchResponse<Library>["metadata"]>(
    {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    }
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLibrary, setSelectedLibrary] = useState<string | null>(null);

  const fetchLibraries = async (page: number) => {
    try {
      const res = await searchLibrary({ page: page, limit: 10 });
      setData(res.data);
      setMetadata(res.metadata);
    } catch (error) {
      console.error("Error loading libraries:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHomeworks = async (libraryId: string) => {
    try {
      const res = await searchHomework({
        page: page,
        limit: 10,
        classId: libraryId,
      });
    } catch (error) {
      console.error("Error loading libraries:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLibraries(page);
  }, [page]);

  const handleNext = () => {
    if (!metadata.hasNextPage || loading) return; // ✅ ngăn spam click
    setPage((next) => next + 1);
  };

  const handlePrev = () => {
    if (!metadata.hasPrevPage || loading) return;
    setPage((prev) => prev - 1);
  };

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
              {data.map((item) => (
                <Card
                  key={item.id}
                  cursor="pointer"
                  borderWidth={selectedLibrary === item.id ? "2px" : "1px"}
                  borderColor={
                    selectedLibrary === item.id ? "purple.400" : "gray.200"
                  }
                  bg={selectedLibrary === item.id ? "purple.50" : "white"}
                  transition="all 0.2s"
                  _hover={{ borderColor: "purple.300", bg: "gray.50" }}
                  onClick={() => setSelectedLibrary(item.id)}
                >
                  <CardBody py={2} px={3}>
                    <Text fontWeight="medium" color="gray.800">
                      {item.name}
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
                  {data.find((l) => l.id === selectedLibrary)?.name}
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
