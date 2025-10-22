import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
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
              <ModalHeader>Create a new class</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <form onSubmit={formik.handleSubmit}>
                  <VStack align="stretch" spacing={3}>
                    <InputField name="name" label="Name" />
                    <HStack
                      display="grid"
                      align="stretch"
                      gridTemplateColumns="4fr 1fr"
                      gap={3}
                      w="full"
                    >
                      <InputField name="code" label="Code" />
                      <ColorPicker name="colorCode" label="Color" />
                    </HStack>

                    <HStack
                      display="grid"
                      align="stretch"
                      gridTemplateColumns="2fr 2fr"
                      gap={3}
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

                    <Button colorScheme="purple" type="submit" width="full">
                      Create
                    </Button>
                  </VStack>
                </form>
              </ModalBody>
            </ModalContent>
          </Modal>
        </FormikProvider>
      )}
    </Formik>
  );
};
