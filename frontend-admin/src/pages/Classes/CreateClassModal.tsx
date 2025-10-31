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
} from "@chakra-ui/react";
import { Formik, FormikProvider } from "formik";
import { useState } from "react";
import { FiCheck } from "react-icons/fi";
import * as Yup from "yup";
import { ColorPicker } from "../../components/ColorPicker";
import { DateTimePicker } from "../../components/DateTimePicker";
import { InputField } from "../../components/InputField";
import { COLOR_CODE } from "../../constants/colorCode";
import {
  createClass,
  type CreateClassRequest,
} from "../../services/class.service";
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
      return createdClass;
    } catch (err: unknown) {
      console.error(err);
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
                      label="Class Name"
                      placeholder="e.g., Mathematics 101"
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
                        label="Class Code"
                        placeholder="e.g., MATH101"
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
                      />
                      <DateTimePicker<CreateClassRequest>
                        name="endTime"
                        label="End Time (optional)"
                      />
                    </HStack>
                  </Stack>
                </form>
              </ModalBody>

              <Divider borderColor="gray.100" />

              <ModalFooter px={8} py={6} bg="gray.50">
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
                    Create Class
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
