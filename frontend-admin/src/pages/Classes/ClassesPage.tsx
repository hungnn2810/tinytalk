import { AddIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiMoreVertical, FiUser } from "react-icons/fi";
import type { SearchResponse } from "../../models/base/search.model";
import type { Class } from "../../models/class.model";
import { searchClass } from "../../services/class.service";
import { CreateClassModal } from "./CreateClassModal";

export default function ClassesPage() {
  const [, setLoading] = useState(true);
  const [classes, setClasses] = useState<Class[]>([]);
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState<SearchResponse<Class>["metadata"]>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    searchClass({ page, limit: 10 }).then((res) => {
      setClasses(res.data);
      setMetadata(res.metadata);
      setLoading(false);
    });
  }, [page]);

  const handlePrev = () => {
    if (metadata.hasPrevPage) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (metadata.hasNextPage) setPage((p) => p + 1);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <Box pt={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">My Classes</Heading>
        <Button colorScheme="purple" leftIcon={<AddIcon />} onClick={openModal}>
          Create a class
        </Button>
      </Flex>

      {/* Modal controlled by state */}
      <CreateClassModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={() => {
          // fetch lại danh sách class
          searchClass({ page, limit: 20 }).then((res) => {
            setClasses(res.data);
            setMetadata(res.metadata);
          });
        }}
      />

      <Grid
        templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
        gap={6}
        mt={6}
      >
        {classes.map((item) => (
          <GridItem key={item.id}>
            <Box
              borderWidth="1px"
              borderRadius="xl"
              bg="white"
              p={5}
              boxShadow="md"
              _hover={{ boxShadow: "lg", transform: "translateY(-2px)" }}
              transition="all 0.2s"
              position="relative"
            >
              {/* Color bar trên cùng */}
              <Box
                position="absolute"
                top={0}
                left={0}
                width="100%"
                height="4px" // chiều cao thanh màu
                borderTopLeftRadius="xl"
                borderTopRightRadius="xl"
                bg={item.colorCode || "#805AD5"} // dùng colorCode của class, default purple
              />

              {/* Header */}
              <Flex justifyContent="space-between" align="center" mt={2}>
                <Heading fontSize="lg" color="gray.800">
                  {item.name}
                </Heading>
                <Icon as={FiMoreVertical} color="gray.400" cursor="pointer" />
              </Flex>

              <Divider my={3} />

              <Stack spacing={2}>
                <HStack color="gray.600">
                  <Icon as={FiUser} />{" "}
                  <Text fontSize="sm">
                    {item.students?.length ?? 0} students
                  </Text>
                </HStack>
              </Stack>
            </Box>
          </GridItem>
        ))}
      </Grid>
    </Box>
  );
}
