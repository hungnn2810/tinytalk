import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { Formik, FormikProvider } from "formik";
import { useState } from "react";
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
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader className="modal-title">
                Create a new class
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody px={6} py={5}>
                <form onSubmit={formik.handleSubmit}>
                  <Stack spacing={6}>
                    {/* Class Name */}
                    <InputField name="name" label="Name" />

                    {/* Code + Color */}
                    <HStack
                      display="grid"
                      align="stretch"
                      gridTemplateColumns="4fr 1fr"
                      gap={4}
                      w="full"
                    >
                      <InputField name="code" label="Code" />
                      <ColorPicker name="colorCode" label="Color" />
                    </HStack>

                    <HStack
                      display="grid"
                      align="stretch"
                      gridTemplateColumns="1fr 1fr"
                      gap={4}
                      w="full"
                    >
                      {" "}
                      <DateTimePicker<CreateClassRequest>
                        name="startTime"
                        label="Start Time"
                      />
                      <DateTimePicker<CreateClassRequest>
                        name="endTime"
                        label="End Time (optional)"
                      />
                    </HStack>

                    <Button
                      type="submit"
                      isLoading={formik.isSubmitting}
                      loadingText="Creating..."
                      bg="purple.500"
                      color="white"
                      fontWeight="600"
                      _hover={{
                        bgGradient: "linear(to-r, #6b46c1, #805ad5)",
                        transform: "translateY(-1px)",
                        boxShadow: "md",
                      }}
                      _active={{
                        transform: "translateY(0)",
                        boxShadow: "sm",
                      }}
                      _disabled={{
                        opacity: 0.6,
                        cursor: "not-allowed",
                      }}
                    >
                      Create Class
                    </Button>
                  </Stack>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </FormikProvider>
      )}
    </Formik>
  );
};
