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
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiClock, FiMoreVertical, FiUser } from "react-icons/fi";
import { ConfirmDialog } from "../../components/ConfirmDialog";
import { CustomToast } from "../../components/CustomToast";
import Pagination from "../../components/Pagination";
import type { SearchResponse } from "../../models/base/search.model";
import type { Class } from "../../models/class.model";
import { deleteClass, searchClass } from "../../services/class.service";
import { parseToZonedDate } from "../../utils/datetime.util";
import { CreateClassModal } from "./CreateClassModal";

const CLASS_LIMIT = 20;
const initialMetadata: SearchResponse<Class>["metadata"] = {
  total: 0,
  page: 1,
  limit: CLASS_LIMIT,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function ClassesPage() {
  const toast = useToast();
  const [data, setData] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchClasses = async (page: number) => {
    try {
      const res = await searchClass({ page: page, limit: 10 });
      setData(res.data);
      setMetadata(res.metadata);
    } catch (error) {
      console.error("Error loading classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses(page);
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

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    try {
      await deleteClass(itemToDelete);
      await fetchClasses(page);

      // Show success toast
      toast({
        duration: 3000,
        isClosable: true,
        position: "top-right",
        render: () => (
          <CustomToast
            title="Class deleted"
            description="The class has been successfully deleted."
            status="success"
          />
        ),
      });
    } catch (error) {
      console.error("Error deleting class:", error);

      // Show error toast
      toast({
        duration: 5000,
        isClosable: true,
        position: "top-right",
        render: () => (
          <CustomToast
            title="Delete failed"
            description="Failed to delete class. Please try again."
            status="error"
          />
        ),
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setItemToDelete(null);
  };

  return (
    <Box pt={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">My Classes</Heading>
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
          onClick={openModal}
        >
          New class
        </Button>
      </Flex>

      {/* Modal controlled by state */}
      <CreateClassModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={() => {
          // fetch lại danh sách class
          searchClass({ page, limit: 20 }).then((res) => {
            setData(res.data);
            setMetadata(res.metadata);
          });
        }}
      />

      <Grid
        templateColumns="repeat(auto-fill, minmax(350px, 1fr))"
        gap={6}
        mt={6}
      >
        {data.map((item) => (
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
                bg={item.colorCode || "#805AD5"}
              />

              {/* Header */}
              <Flex justifyContent="space-between" align="center" mt={2}>
                <Heading fontSize="lg" color="gray.800">
                  {item.name}{" "}
                  <Text as="span" fontWeight="400">
                    ({item.code})
                  </Text>
                </Heading>
                <Menu>
                  <MenuButton
                    as={IconButton}
                    icon={<Icon as={FiMoreVertical} />}
                    variant="ghost"
                    color="gray.400"
                    size="sm"
                    aria-label="Options"
                  />
                  <MenuList minW="120px">
                    <MenuItem
                      onClick={() => {
                        console.log("Update class:", item.id);
                        // TODO: Open update modal
                      }}
                    >
                      Update
                    </MenuItem>
                    <MenuItem
                      color="red.500"
                      onClick={() => handleDeleteClick(item.id)}
                    >
                      Delete
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Flex>

              <Divider my={3} />

              <Stack spacing={2}>
                <HStack color="gray.600">
                  <Icon as={FiUser} />
                  <Text fontSize="sm">
                    {item.students?.length ?? 0} students
                  </Text>
                </HStack>

                <HStack color="gray.600">
                  <Icon as={FiClock} />
                  <Text fontSize="sm">
                    {parseToZonedDate(item.startTime, "dd/MM/yyyy")}
                    {!item.endTime
                      ? ""
                      : ` -> ${parseToZonedDate(item.endTime, "dd/MM/yyyy")}`}
                  </Text>
                </HStack>
              </Stack>
            </Box>
          </GridItem>
        ))}
      </Grid>

      <Pagination
        page={page}
        totalPages={metadata.totalPages}
        hasNextPage={metadata.hasNextPage}
        hasPrevPage={metadata.hasPrevPage}
        onNext={handleNext}
        onPrev={handlePrev}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Class"
        message="Are you sure you want to delete?"
        confirmText="Delete"
        cancelText="Cancel"
        confirmColorScheme="red"
        isLoading={isDeleting}
      />
    </Box>
  );
}
