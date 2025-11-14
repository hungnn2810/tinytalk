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
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Formik, FormikProvider } from "formik";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FiBookOpen,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiLock,
  FiMapPin,
  FiPhone,
  FiUser,
  FiUserPlus,
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
import type { Parent } from "../../models/parent.model";
import { searchClass } from "../../services/class.service";
import { searchParent } from "../../services/parent.service";
import {
  createStudent,
  type CreateStudentRequest,
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

const initialParentMetadata: SearchResponse<Parent>["metadata"] = {
  total: 0,
  page: 1,
  limit: CLASS_LIMIT,
  totalPages: 1,
  hasNextPage: false,
  hasPrevPage: false,
};

const CreateStudentSchema = Yup.object().shape({
  name: Yup.string().required("Student name is required"),
  classIds: Yup.array().of(Yup.string()),
  gender: Yup.mixed()
    .oneOf(Object.values(Gender))
    .required("Gender is required"),
  dateOfBirth: Yup.date().required("Date of birth is required"),
  status: Yup.mixed()
    .oneOf(Object.values(StudentStatus))
    .required("Status is required"),
  parentId: Yup.string().when("parent", {
    is: (parent: { name?: string }) => !parent?.name,
    then: (schema) =>
      schema.required("Please select a parent or create new one"),
    otherwise: (schema) => schema.notRequired(),
  }),
  parent: Yup.object()
    .shape({
      name: Yup.string(),
      phoneNumber: Yup.string()
        .matches(
          /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
          "Invalid Vietnamese phone number"
        )
        .required("Phone number is required"),
      relationshipToStudent: Yup.string().oneOf(
        Object.keys(RelationshipToStudent)
      ),
      address: Yup.string(),
      password: Yup.string().required("Password is required"),
    })
    .required(),
});

interface CreateStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateStudentModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateStudentModalProps) => {
  const toast = useToast();
  const [formValues] = useState<
    CreateStudentRequest & {
      parent?: {
        name: string;
        phoneNumber: string;
        relationshipToStudent: string;
        address: string;
        password: string;
      };
    }
  >({
    name: "",
    gender: Gender.FEMALE,
    dateOfBirth: new Date(),
    status: StudentStatus.PENDING,
    classIds: [],
    parentId: "",
    userId: "",
    parent: {
      name: "",
      phoneNumber: "",
      relationshipToStudent: RelationshipToStudent.MOTHER,
      address: "",
      password: "",
    },
  });
  const [classKeyword, setClassKeyword] = useState("");
  const [classMetadata, setClassMetadata] = useState(initialClassMetadata);
  const [classPage, setClassPage] = useState(1);
  const [classes, setClasses] = useState<Class[]>([]);
  const isFetchingClass = useRef(false);
  const [parentKeyword, setParentKeyword] = useState("");
  const [parentMetadata, setParentMetadata] = useState(initialParentMetadata);
  const [parentPage, setParentPage] = useState(1);
  const [parents, setParents] = useState<Parent[]>([]);
  const isFetchingParent = useRef(false);

  const [showParentForm, setShowParentForm] = useState(true);

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

  const fetchParents = useCallback(async (keyword: string, page: number) => {
    if (isFetchingParent.current) return;
    isFetchingParent.current = true;

    try {
      const res = await searchParent({ page, limit: CLASS_LIMIT, keyword });
      setParents((prev) => (page === 1 ? res.data : [...prev, ...res.data]));
      setParentMetadata(res.metadata);
      setParentPage(res.metadata.page);
    } catch (error) {
      console.error("Error loading parents:", error);
    } finally {
      isFetchingClass.current = false;
    }
  }, []);

  useEffect(() => {
    fetchClasses(classKeyword, 1);
    fetchParents(parentKeyword, 1);
  }, [classKeyword, fetchClasses, parentKeyword, fetchParents]);

  const handleClassNext = useCallback(() => {
    if (!classMetadata.hasNextPage || isFetchingClass.current) return;
    fetchClasses(classKeyword, classPage + 1);
  }, [classMetadata.hasNextPage, classKeyword, classPage, fetchClasses]);

  const handleParentNext = useCallback(() => {
    if (!parentMetadata.hasNextPage || isFetchingClass.current) return;
    fetchParents(parentKeyword, parentPage + 1);
  }, [parentMetadata.hasNextPage, parentKeyword, parentPage, fetchParents]);

  const handleClassSearch = useCallback(
    (keyword: string) => {
      setClassKeyword(keyword);
      setClassPage(1);
      fetchClasses(keyword, 1);
    },
    [fetchClasses]
  );

  const handleParentSearch = useCallback(
    (keyword: string) => {
      setParentKeyword(keyword);
      setParentPage(1);
      fetchParents(keyword, 1);
    },
    [fetchParents]
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

  const parentOptions = useMemo(
    () =>
      parents.map((prt) => (
        <option key={prt.id} value={prt.id}>
          {prt.name}
        </option>
      )),
    [parents]
  );

  const handleCreate = async (
    values: CreateStudentRequest & {
      parent?: {
        name: string;
        phoneNumber: string;
        relationshipToStudent: string;
        address: string;
        password: string;
      };
    },
    resetForm: () => void
  ) => {
    try {
      // Transform parent data: phoneNumber becomes username
      const payload: CreateStudentRequest & {
        parent?: {
          name: string;
          phoneNumber: string;
          relationshipToStudent: string;
          address: string;
          user: {
            username: string;
            password: string;
          };
        };
      } = {
        name: values.name,
        gender: values.gender,
        dateOfBirth: values.dateOfBirth,
        status: values.status,
        classIds: values.classIds || [],
        parentId: values.parentId,
        userId: values.userId,
      };

      // If creating new parent, map phoneNumber to username
      if (values.parent?.phoneNumber) {
        payload.parent = {
          name: values.parent.name,
          phoneNumber: values.parent.phoneNumber,
          relationshipToStudent: values.parent.relationshipToStudent,
          address: values.parent.address,
          user: {
            username: values.parent.phoneNumber, // phoneNumber is username
            password: values.parent.password,
          },
        };
      }

      const createdStudent = await createStudent(payload);
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
            title="Student created"
            description="The student has been successfully created."
            status="success"
          />
        ),
      });

      return createdStudent;
    } catch (err: unknown) {
      // Extract error message from API response
      const error = err as ApiError;
      const errorMessage =
        error?.message || "Failed to create student. Please try again.";

      // Show error toast with API message
      toast({
        duration: 5000,
        isClosable: true,
        position: "top-right",
        render: () => (
          <CustomToast
            title="Create failed"
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
      validationSchema={CreateStudentSchema}
      enableReinitialize={false}
      onSubmit={async (values, { resetForm }) => {
        await handleCreate(values, resetForm);
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
            <ModalContent borderRadius="full" boxShadow="2xl">
              <ModalHeader
                className="modal-title"
                bgGradient="linear(to-r, purple.500, purple.600)"
                color="white"
                py={5}
                fontSize="xl"
                fontWeight="700"
                display="flex"
                alignItems="center"
              >
                <Icon as={FiUserPlus} boxSize={6} />
                <Text>New Student</Text>
              </ModalHeader>
              <ModalCloseButton color="white" size="lg" top={4} right={4} />

              <Divider borderColor="purple.100" />

              <ModalBody px={8} py={6}>
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
                          <DateTimePicker<CreateStudentRequest>
                            name="dateOfBirth"
                            label="Date of Birth"
                            dateOnly
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
                        <Icon as={FiBookOpen} color="purple.500" boxSize={4} />
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

                    {/* Parent Information Section */}
                    <Box>
                      <HStack spacing={2} mb={3}>
                        <Icon as={FiUserPlus} color="purple.500" boxSize={4} />
                        <Text fontSize="md" fontWeight="600" color="gray.700">
                          Parent Information
                        </Text>
                      </HStack>
                      <Stack spacing={3}>
                        {!showParentForm ? (
                          <>
                            <SelectField
                              name="parentId"
                              label="Select Existing Parent"
                              placeholder="Search for parent"
                              isFetching={isFetchingParent}
                              hasNextPage={parentMetadata.hasNextPage}
                              handleNext={handleParentNext}
                              onSearch={handleParentSearch}
                            >
                              {parentOptions}
                            </SelectField>

                            <HStack justify="center">
                              <Divider flex={1} />
                              <Text
                                fontSize="sm"
                                color="gray.500"
                                fontWeight="500"
                              >
                                OR
                              </Text>
                              <Divider flex={1} />
                            </HStack>

                            <Button
                              leftIcon={<Icon as={FiUserPlus} />}
                              rightIcon={<Icon as={FiChevronDown} />}
                              variant="outline"
                              colorScheme="purple"
                              size="md"
                              w="full"
                              onClick={() => setShowParentForm(true)}
                              _hover={{
                                bg: "purple.50",
                                borderColor: "purple.500",
                              }}
                            >
                              Create New Parent
                            </Button>
                          </>
                        ) : (
                          <>
                            <HStack justify="space-between" align="center">
                              <Text
                                fontSize="md"
                                fontWeight="600"
                                color="purple.600"
                              >
                                New Parent
                              </Text>
                              <Button
                                size="sm"
                                variant="ghost"
                                colorScheme="gray"
                                rightIcon={<Icon as={FiChevronUp} />}
                                onClick={() => setShowParentForm(false)}
                              >
                                Use Existing
                              </Button>
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
                                height="3px"
                                bgGradient="linear(to-r, purple.400, pink.400)"
                              />

                              <Stack spacing={4} p={5} pt={6}>
                                <HStack spacing={4} align="flex-start">
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
                                    <InputField
                                      name="parent.name"
                                      placeholder="Enter parent full name"
                                    />
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
                                    <SelectField name="parent.relationshipToStudent">
                                      {Object.entries(
                                        RelationshipToStudent
                                      ).map(([key, value]) => (
                                        <option key={key} value={value}>
                                          {RelationshipToStudentLabels[value]}
                                        </option>
                                      ))}
                                    </SelectField>
                                  </Box>
                                </HStack>

                                <Divider borderColor="purple.100" />

                                <HStack spacing={4} align="flex-start">
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
                                        Phone Number (Username)
                                      </Text>
                                    </HStack>
                                    <InputField
                                      name="parent.phoneNumber"
                                      placeholder="Enter phone number"
                                    />
                                  </Box>
                                  <Box flex={1}>
                                    <HStack spacing={2} mb={2}>
                                      <Icon
                                        as={FiLock}
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
                                        Password
                                      </Text>
                                    </HStack>
                                    <InputField
                                      name="parent.password"
                                      type="password"
                                      placeholder="Enter password"
                                    />
                                  </Box>
                                </HStack>

                                <Box>
                                  <HStack spacing={2} mb={2}>
                                    <Icon
                                      as={FiMapPin}
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
                                  <InputField
                                    name="parent.address"
                                    placeholder="Enter home address"
                                  />
                                </Box>
                              </Stack>
                            </Box>
                          </>
                        )}
                      </Stack>
                    </Box>
                  </Stack>
                </form>
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
                    onClick={() => formik.handleSubmit()}
                    isLoading={formik.isSubmitting}
                    loadingText="Creating..."
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
                    Create
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
