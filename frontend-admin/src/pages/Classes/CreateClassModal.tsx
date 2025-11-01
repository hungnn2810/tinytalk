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
import { ColorPicker } from "../../components/ColorPicker";
import { DateTimePicker } from "../../components/DateTimePicker";
import { InputField } from "../../components/InputField";
import { COLOR_CODE } from "../../constants/colorCode";
import type { ApiError } from "../../models/base/error.model";
import {
  createClass,
  type CreateClassRequest,
} from "../../services/class.service";
import { CustomToast } from "../../utils/toast.util";
import "./styles/create-class-modal.css";

const CreateClassSchema = Yup.object().shape({
  name: Yup.string().required("Class name is required"),
  code: Yup.string().required("Class code is required"),
  colorCode: Yup.string().required("Class color code is required"),
  startTime: Yup.date().required("Start time is required"),
  endTime: Yup.date().nullable(),
});

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateClassModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateClassModalProps) => {
  const toast = useToast();
  const [formValues] = useState<CreateClassRequest>({
    name: "",
    code: "",
    colorCode: COLOR_CODE[0],
    startTime: new Date(),
    endTime: null,
  });

  const handleCreate = async (
    values: CreateClassRequest,
    resetForm: () => void
  ) => {
    try {
      const payload: CreateClassRequest = {
        ...values,
        startTime: values.startTime,
        endTime: values.endTime ?? null,
      };

      const createdClass = await createClass(payload);
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
            title="Class created"
            description="The class has been successfully created."
            status="success"
          />
        ),
      });

      return createdClass;
    } catch (err: unknown) {
      // Extract error message from API response
      const error = err as ApiError;
      const errorMessage =
        error?.message || "Failed to create class. Please try again.";

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
      validationSchema={CreateClassSchema}
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
                <Text>Create New Class</Text>
              </ModalHeader>
              <ModalCloseButton color="white" size="lg" top={5} right={5} />

              <Divider borderColor="purple.100" />

              <ModalBody px={8} py={8}>
                <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={6}>
                    {/* Class Name */}
                    <InputField
                      name="name"
                      label="Name"
                      placeholder="e.g., Jolly Phonics"
                    />

                    {/* Code + Color */}
                    <HStack
                      display="grid"
                      align="stretch"
                      gridTemplateColumns="4fr 1fr"
                      gap={4}
                      w="full"
                    >
                      <InputField
                        name="code"
                        label="Code"
                        placeholder="e.g., JOLLY101"
                      />
                      <ColorPicker name="colorCode" label="Color" />
                    </HStack>

                    <HStack
                      display="grid"
                      align="stretch"
                      gridTemplateColumns="1fr 1fr"
                      gap={4}
                      w="full"
                    >
                      <DateTimePicker<CreateClassRequest>
                        name="startTime"
                        label="Start Time"
                        dateOnly
                      />
                      <DateTimePicker<CreateClassRequest>
                        name="endTime"
                        label="End Time (optional)"
                        dateOnly
                      />
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
                    onClick={formik.submitForm}
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
