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
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { InputField } from "../../components/InputField";
import Pagination from "../../components/Pagination";
import { SelectField } from "../../components/SelectField";
import type { SearchResponse } from "../../models/base/search.model";
import type { Class } from "../../models/class.model";
import type { Student } from "../../models/student.model";
import { searchClass } from "../../services/class.service";
import { searchStudent } from "../../services/student.service";
import { CreateStudentModal } from "./CreateStudentModal";

const STUDENT_LIMIT = 20;
const CLASS_LIMIT = 10;

const initialMetadata: SearchResponse<Student>["metadata"] = {
  total: 0,
  page: 1,
  limit: STUDENT_LIMIT,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

const initialClassMetadata: SearchResponse<Class>["metadata"] = {
  total: 0,
  page: 1,
  limit: CLASS_LIMIT,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

export default function StudentPage() {
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [classPage, setClassPage] = useState(1);
  const [classKeyword, setClassKeyword] = useState("");
  const [metadata, setMetadata] = useState(initialMetadata);
  const [classMetadata, setClassMetadata] = useState(initialClassMetadata);
  const [classes, setClasses] = useState<Class[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isFetching = useRef(false);

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  const fetchStudents = useCallback(async (page: number) => {
    try {
      const res = await searchStudent({ page, limit: STUDENT_LIMIT });
      setMetadata(res.metadata);
    } catch (error) {
      console.error("Error loading students:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchClasses = useCallback(async (keyword: string, page: number) => {
    if (isFetching.current) return;
    isFetching.current = true;

    if (page === 1) setLoading(true);

    try {
      const res = await searchClass({ page, limit: CLASS_LIMIT, keyword });

      setClasses((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      setClassMetadata(res.metadata);
      setClassPage(res.metadata.page);
    } catch (error) {
      console.error("Error loading classes:", error);
    } finally {
      if (page === 1) setLoading(false);
      isFetching.current = false;
    }
  }, []);

  useEffect(() => {
    fetchStudents(page);
  }, [page, fetchStudents]);

  useEffect(() => {
    fetchClasses(classKeyword, 1);
  }, [classKeyword, fetchClasses]);

  const handleNext = useCallback(() => {
    if (!metadata.hasNextPage || loading) return;
    setPage((next) => next + 1);
  }, [metadata.hasNextPage, loading]);

  const handlePrev = useCallback(() => {
    if (!metadata.hasPrevPage || loading) return;
    setPage((prev) => prev - 1);
  }, [metadata.hasPrevPage, loading]);

  const handleClassNext = useCallback(() => {
    if (!classMetadata.hasNextPage || isFetching.current) return;
    fetchClasses(classKeyword, classPage + 1);
  }, [classMetadata.hasNextPage, classKeyword, classPage, fetchClasses]);

  const handleClassSearch = useCallback(
    (keyword: string) => {
      setClassKeyword(keyword);
      setClassPage(1);
      fetchClasses(keyword, 1);
    },
    [fetchClasses]
  );

  // Memoize class options
  const classOptions = useMemo(
    () =>
      classes.map((cls) => (
        <option key={cls.id} value={cls.id}>
          {cls.name}
        </option>
      )),
    [classes]
  );

  return (
    <Box pt={8}>
      <Flex justifyContent="space-between" alignItems="center">
        <Heading size="md">Students</Heading>
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
          New student
        </Button>
      </Flex>

      {/* Modal controlled by state */}
      <CreateStudentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSuccess={() => {
          // // fetch lại danh sách class
          // searchClass({ page, limit: 20 }).then((res) => {
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
        <Formik
          initialValues={{ name: "", classId: "" }}
          onSubmit={(values) => console.log(values)}
        >
          {({ handleSubmit }) => (
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
                  <SelectField
                    name="classId"
                    placeholder="Select class"
                    isMulti
                    isFetching={isFetching}
                    hasNextPage={classMetadata.hasNextPage}
                    handleNext={handleClassNext}
                    onSearch={handleClassSearch}
                  >
                    {classOptions}
                  </SelectField>
                </Box>
                <Button
                  type="submit"
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
                >
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
