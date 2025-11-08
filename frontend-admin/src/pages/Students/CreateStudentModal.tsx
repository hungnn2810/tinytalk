import {
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
import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import * as Yup from "yup";
import { CustomToast } from "../../components/CustomToast";
import { DateTimePicker } from "../../components/DateTimePicker";
import { InputField } from "../../components/InputField";
import { SelectField } from "../../components/SelectField";
import { Gender } from "../../enums/gender";
import { StudentStatus } from "../../enums/StudentStatus";
import type { ApiError } from "../../models/base/error.model";
import {
  createStudent,
  type CreateStudentRequest,
} from "../../services/student.service";

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
  const [formValues] = useState<CreateStudentRequest>({
    name: "",
    gender: Gender.FEMALE,
    dateOfBirth: new Date(),
    status: StudentStatus.PENDING,
    classIds: [],
    parentId: "",
    userId: "",
  });

  const handleCreate = async (
    values: CreateStudentRequest,
    resetForm: () => void
  ) => {
    try {
      const payload: CreateStudentRequest = {
        ...values,
      };

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
            title="Library created"
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
            size="lg"
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
                <Text>New library</Text>
              </ModalHeader>
              <ModalCloseButton color="white" size="lg" top={5} right={5} />

              <Divider borderColor="purple.100" />

              <ModalBody px={8} py={8}>
                <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={6}>
                    <InputField
                      name="name"
                      label="Name"
                      placeholder="e.g., Katie Smith"
                    />
                  </Stack>

                  <Stack spacing={6}>
                    <HStack
                      display="grid"
                      align="stretch"
                      gridTemplateColumns="1fr 1fr"
                      gap={4}
                    >
                      <DateTimePicker<CreateStudentRequest>
                        name="dateOfBirth"
                        label="Date Of Birth"
                        dateOnly
                      />

                      <SelectField name="gender" label="Gender">
                        {Object.values(Gender).map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </SelectField>
                    </HStack>
                  </Stack>

                  <Stack spacing={6}>
                    <HStack
                      display="grid"
                      align="stretch"
                      gridTemplateColumns="1fr 1fr"
                      gap={4}
                    >
                      <SelectField name="status" label="Status">
                        {Object.values(StudentStatus).map((cls) => (
                          <option key={cls} value={cls}>
                            {cls}
                          </option>
                        ))}
                      </SelectField>

                      <SelectField name="classIds" label="Class" isMulti>
                        {/* {classes.map((cls) => (
                          <option key={cls.id} value={cls.id}>
                            {cls.name}
                          </option>
                        ))} */}
                      </SelectField>
                    </HStack>
                  </Stack>
                </form>
              </ModalBody>

              <ModalFooter px={8}>
                <HStack spacing={3} w="full" justify="flex-end">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                    _hover={{
                      bg: "gray.100",
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    // onClick={formik.submitForm}
                    onClick={() => console.log(formValues)}
                    isLoading={formik.isSubmitting}
                    loadingText="Creating..."
                    leftIcon={<Icon as={FiCheck} />}
                    bgGradient="linear(to-r, purple.500, purple.600)"
                    color="white"
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
