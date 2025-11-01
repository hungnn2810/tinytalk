import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useEffect, useState } from "react";
import { InputField } from "../../components/InputField";
import Pagination from "../../components/Pagination";
import { SelectField } from "../../components/SelectField";
import type { SearchResponse } from "../../models/base/search.model";
import type { Student } from "../../models/student.model";
import { searchStudent } from "../../services/student.service";

export default function StudentPage() {
  const [data, setData] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState<SearchResponse<Student>["metadata"]>(
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

  const fetchStudents = async (page: number) => {
    try {
      const res = await searchStudent({ page: page, limit: 20 });
      setData(res.data);
      setMetadata(res.metadata);
    } catch (error) {
      console.error("Error loading classes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents(page);
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

  const classes = [
    { id: "1", name: "Class A" },
    { id: "2", name: "Class B" },
    { id: "3", name: "Class C" },
  ];

  return (
    <Box pt={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="lg">My Students</Heading>
        <Button colorScheme="purple" leftIcon={<AddIcon />} onClick={openModal}>
          Register new student
        </Button>
      </Flex>

      <Box
        w="full"
        rounded="2xl"
        shadow="sm"
        bg="white"
        mt={6}
        p={{ base: 4, md: 6 }}
      >
        <Formik
          initialValues={{ name: "", classId: "" }}
          onSubmit={(values) => console.log(values)}
        >
          {({ handleSubmit, setFieldValue, values }) => (
            <Form onSubmit={handleSubmit}>
              <Flex gap={4} direction="row" align="flex-start">
                <Box w="350px">
                  <InputField
                    name="name"
                    type="text"
                    placeholder="Student name..."
                    rightAddon={<SearchIcon color="purple.500" />}
                  />
                </Box>
                <Box w="300px">
                  <SelectField name="classId" placeholder="Select class">
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.id}>
                        {cls.name}
                      </option>
                    ))}
                  </SelectField>
                </Box>
                <Button type="submit" colorScheme="purple" px={6}>
                  Search
                </Button>
              </Flex>
            </Form>
          )}
        </Formik>

        <Table variant="simple" mt={6}>
          <Thead bg="purple.50" position="sticky" top={0} zIndex={1}>
            <Tr>
              <Th>Name</Th>
              <Th>Class(es)</Th>
              <Th>Gender</Th>
              <Th>DOB</Th>
              <Th>Status</Th>
              <Th>Parent(s)</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>John Doe</Td>
              <Td>Class A</Td>
              <Td>
                <Button size="sm" colorScheme="purple">
                  Edit
                </Button>
              </Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>

      <Pagination
        page={page}
        totalPages={metadata.totalPages}
        hasNextPage={metadata.hasNextPage}
        hasPrevPage={metadata.hasPrevPage}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </Box>
  );
}
