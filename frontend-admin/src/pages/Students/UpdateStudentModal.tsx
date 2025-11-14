import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Formik, FormikProvider } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBookOpen,
  FiCheck,
  FiEdit,
  FiPhone,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import * as Yup from "yup";
import { CustomToast } from "../../components/CustomToast";
import { DateTimePicker } from "../../components/DateTimePicker";
import { InputField } from "../../components/InputField";
import { SelectField } from "../../components/SelectField";
import { Gender, GenderLabels } from "../../enums/Gender";
import {
  RelationshipToStudent,
  RelationshipToStudentLabels,
} from "../../enums/RelationshipToStudent";
import { StudentStatus, StudentStatusLabels } from "../../enums/StudentStatus";
import type { ApiError } from "../../models/base/error.model";
import type { SearchResponse } from "../../models/base/search.model";
import type { Class } from "../../models/class.model";
import { searchClass } from "../../services/class.service";
import {
  getStudentById,
  updateStudent,
  type UpdateStudentRequest,
} from "../../services/student.service";

const CLASS_LIMIT = 10;

const initialClassMetadata: SearchResponse<Class>["metadata"] = {
  total: 0,
  page: 1,
  limit: CLASS_LIMIT,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

const UpdateStudentSchema = Yup.object().shape({
  name: Yup.string().required("Student name is required"),
  classIds: Yup.array().of(Yup.string()),
  gender: Yup.mixed()
    .oneOf(Object.values(Gender))
    .required("Gender is required"),
  dateOfBirth: Yup.date().required("Date of birth is required"),
  status: Yup.mixed()
    .oneOf(Object.values(StudentStatus))
    .required("Status is required"),
});

interface UpdateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  studentId: string | null;
}

export const UpdateStudentModal = ({
  isOpen,
  onClose,
  onSuccess,
  studentId,
}: UpdateStudentModalProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<UpdateStudentRequest>({
    name: "",
    gender: Gender.FEMALE,
    dateOfBirth: new Date(),
    status: StudentStatus.PENDING,
    classIds: [],
  });
  const [parentInfo, setParentInfo] = useState<{
    name: string;
    relationshipToStudent: RelationshipToStudent;
    phoneNumber: string;
    address: string;
  } | null>(null);

  const [classKeyword, setClassKeyword] = useState("");
  const [classMetadata, setClassMetadata] = useState(initialClassMetadata);
  const [classPage, setClassPage] = useState(1);
  const [classes, setClasses] = useState<Class[]>([]);
  const isFetchingClass = useRef(false);

  const fetchClasses = useCallback(async (keyword: string, page: number) => {
    if (isFetchingClass.current) return;
    isFetchingClass.current = true;

    try {
      const res = await searchClass({ page, limit: CLASS_LIMIT, keyword });

      setClasses((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      setClassMetadata(res.metadata);
      setClassPage(res.metadata.page);
    } catch (error) {
      console.error("Error loading classes:", error);
    } finally {
      isFetchingClass.current = false;
    }
  }, []);

  useEffect(() => {
    fetchClasses(classKeyword, 1);
  }, [classKeyword, fetchClasses]);

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) return;

      setIsLoading(true);
      try {
        const studentData = await getStudentById(studentId);
        setFormValues({
          name: studentData.name,
          gender: studentData.gender,
          dateOfBirth: new Date(studentData.dateOfBirth),
          status: studentData.status,
          classIds: studentData.classes.map((cls) => cls.id),
        });
        setParentInfo({
          name: studentData.parent.name,
          relationshipToStudent: studentData.parent.relationshipToStudent,
          phoneNumber: studentData.parent.phoneNumber,
          address: studentData.parent.address,
        });
      } catch (error) {
        console.error("Error fetching student:", error);
        toast({
          duration: 5000,
          isClosable: true,
          position: "top-right",
          render: () => (
            <CustomToast
              title="Error"
              description="Failed to load student data"
              status="error"
            />
          ),
        });
        onClose();
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchStudentData();
    }
  }, [studentId, isOpen, onClose, toast]);

  const handleClassNext = useCallback(() => {
    if (!classMetadata.hasNextPage || isFetchingClass.current) return;
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

  const handleUpdate = async (
    values: UpdateStudentRequest,
    resetForm: () => void
  ) => {
    if (!studentId) return;

    try {
      const payload: UpdateStudentRequest = {
        ...values,
      };

      await updateStudent(studentId, payload);
      resetForm();
      onClose();
      onSuccess?.();

      // Show success toast
      toast({
        duration: 3000,
        isClosable: true,
        position: "top-right",
        render: () => (
          <CustomToast
            title="Student updated"
            description="The student has been successfully updated."
            status="success"
          />
        ),
      });
    } catch (err: unknown) {
      // Extract error message from API response
      const error = err as ApiError;
      const errorMessage =
        error?.message || "Failed to update student. Please try again.";

      // Show error toast with API message
      toast({
        duration: 5000,
        isClosable: true,
        position: "top-right",
        render: () => (
          <CustomToast
            title="Update failed"
            description={errorMessage}
            status="error"
          />
        ),
      });
    }
  };

  return (
    <Formik
      initialValues={formValues}
      validationSchema={UpdateStudentSchema}
      enableReinitialize={true}
      onSubmit={async (values, { resetForm }) => {
        await handleUpdate(values, resetForm);
      }}
    >
      {(formik) => (
        <FormikProvider value={formik}>
          <Modal
            autoFocus={false}
            returnFocusOnClose={false}
            isOpen={isOpen}
            onClose={onClose}
            isCentered
            motionPreset="slideInBottom"
            size="4xl"
          >
            <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="2xl" boxShadow="2xl">
              <ModalHeader
                bgGradient="linear(to-r, purple.500, purple.600)"
                color="white"
                py={4}
                fontSize="xl"
                fontWeight="700"
                display="flex"
                alignItems="center"
                gap={3}
                borderTopRadius="2xl"
              >
                <Icon as={FiEdit} boxSize={6} />
                <Text>Update Student</Text>
              </ModalHeader>
              <ModalCloseButton color="white" size="lg" top={4} right={4} />

              <Divider borderColor="purple.100" />

              <ModalBody px={8} py={6}>
                {isLoading ? (
                  <Stack spacing={4} align="center" py={8}>
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                    <Text color="gray.600">Loading student data...</Text>
                  </Stack>
                ) : (
                  <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={6}>
                      {/* Personal Information - Compact Layout */}
                      <Box>
                        <HStack spacing={2} mb={3}>
                          <Icon as={FiUser} color="purple.500" boxSize={4} />
                          <Text fontSize="md" fontWeight="600" color="gray.700">
                            Personal Information
                          </Text>
                        </HStack>
                        <HStack spacing={4} align="flex-start">
                          <Box flex={2}>
                            <InputField
                              name="name"
                              label="Full Name"
                              placeholder="Enter student name"
                            />
                          </Box>
                          <Box flex={1}>
                            <DateTimePicker<UpdateStudentRequest>
                              name="dateOfBirth"
                              label="Date of Birth"
                            />
                          </Box>
                          <Box flex={1}>
                            <SelectField name="gender" label="Gender">
                              {Object.entries(Gender).map(([key, value]) => (
                                <option key={key} value={value}>
                                  {GenderLabels[value]}
                                </option>
                              ))}
                            </SelectField>
                          </Box>
                        </HStack>
                      </Box>

                      {/* Academic Information - Compact Layout */}
                      <Box>
                        <HStack spacing={2} mb={3}>
                          <Icon
                            as={FiBookOpen}
                            color="purple.500"
                            boxSize={4}
                          />
                          <Text fontSize="md" fontWeight="600" color="gray.700">
                            Academic Information
                          </Text>
                        </HStack>
                        <HStack spacing={4} align="flex-start">
                          <Box flex={1}>
                            <SelectField name="status" label="Status">
                              {Object.entries(StudentStatus).map(
                                ([key, value]) => (
                                  <option key={key} value={value}>
                                    {StudentStatusLabels[value]}
                                  </option>
                                )
                              )}
                            </SelectField>
                          </Box>
                          <Box flex={1}>
                            <SelectField
                              name="classIds"
                              label="Classes"
                              placeholder="Search and select classes"
                              isMulti
                              isFetching={isFetchingClass}
                              hasNextPage={classMetadata.hasNextPage}
                              handleNext={handleClassNext}
                              onSearch={handleClassSearch}
                            >
                              {classOptions}
                            </SelectField>
                          </Box>
                        </HStack>
                      </Box>

                      {/* Parent Information (Read-only) */}
                      {parentInfo && (
                        <Box>
                          <HStack spacing={2} mb={3}>
                            <Icon as={FiUsers} color="purple.500" boxSize={4} />
                            <Text
                              fontSize="md"
                              fontWeight="600"
                              color="gray.700"
                            >
                              Parent Information
                            </Text>
                            <Box
                              px={2}
                              py={0.5}
                              bg="purple.50"
                              borderRadius="md"
                              border="1px"
                              borderColor="purple.200"
                            >
                              <Text
                                fontSize="xs"
                                fontWeight="600"
                                color="purple.600"
                              >
                                Read-only
                              </Text>
                            </Box>
                          </HStack>
                          <Box
                            position="relative"
                            overflow="hidden"
                            borderRadius="xl"
                            border="1px"
                            borderColor="purple.100"
                            bg="white"
                            boxShadow="sm"
                            _hover={{
                              boxShadow: "md",
                            }}
                            transition="all 0.2s"
                          >
                            {/* Gradient Background Accent */}
                            <Box
                              position="absolute"
                              top={0}
                              left={0}
                              right={0}
                              height="4px"
                              bgGradient="linear(to-r, purple.400, pink.400)"
                            />

                            <Stack spacing={4} p={6} pt={8}>
                              <HStack spacing={6} align="flex-start">
                                <Box flex={1}>
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={FiUser}
                                      color="purple.500"
                                      boxSize={4}
                                    />
                                    <Text
                                      fontSize="xs"
                                      fontWeight="700"
                                      color="gray.500"
                                      textTransform="uppercase"
                                      letterSpacing="wide"
                                    >
                                      Name
                                    </Text>
                                  </HStack>
                                  <Text
                                    fontSize="md"
                                    color="gray.800"
                                    fontWeight="600"
                                  >
                                    {parentInfo.name}
                                  </Text>
                                </Box>
                                <Box flex={1}>
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={FiUsers}
                                      color="purple.500"
                                      boxSize={4}
                                    />
                                    <Text
                                      fontSize="xs"
                                      fontWeight="700"
                                      color="gray.500"
                                      textTransform="uppercase"
                                      letterSpacing="wide"
                                    >
                                      Relationship
                                    </Text>
                                  </HStack>
                                  <Text
                                    fontSize="md"
                                    color="gray.800"
                                    fontWeight="600"
                                  >
                                    {
                                      RelationshipToStudentLabels[
                                        parentInfo.relationshipToStudent
                                      ]
                                    }
                                  </Text>
                                </Box>
                              </HStack>

                              <Divider borderColor="purple.100" />

                              <HStack spacing={6} align="flex-start">
                                <Box flex={1}>
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={FiPhone}
                                      color="purple.500"
                                      boxSize={4}
                                    />
                                    <Text
                                      fontSize="xs"
                                      fontWeight="700"
                                      color="gray.500"
                                      textTransform="uppercase"
                                      letterSpacing="wide"
                                    >
                                      Phone Number
                                    </Text>
                                  </HStack>
                                  <Text
                                    fontSize="md"
                                    color="gray.800"
                                    fontWeight="600"
                                  >
                                    {parentInfo.phoneNumber}
                                  </Text>
                                </Box>
                                <Box flex={1}>
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={FiUser}
                                      color="purple.500"
                                      boxSize={4}
                                    />
                                    <Text
                                      fontSize="xs"
                                      fontWeight="700"
                                      color="gray.500"
                                      textTransform="uppercase"
                                      letterSpacing="wide"
                                    >
                                      Address
                                    </Text>
                                  </HStack>
                                  <Text
                                    fontSize="md"
                                    color="gray.800"
                                    fontWeight="600"
                                  >
                                    {parentInfo.address}
                                  </Text>
                                </Box>
                              </HStack>
                            </Stack>
                          </Box>
                        </Box>
                      )}
                    </Stack>
                  </form>
                )}
              </ModalBody>

              <Divider borderColor="gray.100" />

              <ModalFooter px={8} py={4} bg="gray.50">
                <HStack spacing={3} w="full" justify="flex-end">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    fontWeight="600"
                    _hover={{
                      bg: "gray.100",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    onClick={formik.submitForm}
                    isLoading={formik.isSubmitting}
                    isDisabled={isLoading}
                    loadingText="Updating..."
                    leftIcon={<Icon as={FiCheck} />}
                    bgGradient="linear(to-r, purple.500, purple.600)"
                    color="white"
                    fontWeight="600"
                    px={8}
                    _hover={{
                      bgGradient: "linear(to-r, purple.600, purple.700)",
                      transform: "translateY(-2px)",
                      boxShadow: "lg",
                    }}
                    _active={{
                      transform: "translateY(0)",
                      boxShadow: "md",
                    }}
                    _disabled={{
                      opacity: 0.6,
                      cursor: "not-allowed",
                    }}
                  >
                    Update
                  </Button>
                </HStack>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </FormikProvider>
      )}
    </Formik>
  );
};
