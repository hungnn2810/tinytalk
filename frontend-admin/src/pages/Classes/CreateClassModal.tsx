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
import { useState } from "react";

import { Form, Formik } from "formik";
import * as Yup from "yup";
import { ColorPicker } from "../../components/ColorPicker";
import { DateTimePicker } from "../../components/DateTimePicker";
import { InputField } from "../../components/InputField";
import { CLASS_COLORS } from "../../constants/classColor";
import { createClass } from "../../services/class.service";

const CreateClassSchema = Yup.object().shape({
  name: Yup.string().required("Class name is required"),
  code: Yup.string().required("Class code is required"),
  colorCode: Yup.string().required("Class color code is required"),
  startTime: Yup.string().required("Start time is required"),
  endTime: Yup.string(),
});

interface CreateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateClassModal = ({
  isOpen,
  onClose,
}: CreateClassModalProps) => {
  const [selectedColor, setSelectedColor] = useState(CLASS_COLORS[0]);

  const handleCreate = async (values: {
    name: string;
    code: string;
    colorCode: string;
    startTime: string;
    endTime: string;
  }) => {
    try {
      await createClass(values);
    } catch (err: unknown) {
      console.error(err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <ModalOverlay bg="rgba(0, 0, 0, 0.4)" backdropFilter="blur(8px)" />
      <ModalContent>
        <ModalHeader fontWeight="bold" fontSize="lg">
          Create a new class
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Formik
            initialValues={{
              name: "",
              code: "",
              colorCode: CLASS_COLORS[0],
              startTime: "",
              endTime: "",
            }}
            validationSchema={CreateClassSchema}
            onSubmit={async (values, { setSubmitting, resetForm }) => {
              await handleCreate(values);
              setSubmitting(false);
              resetForm();
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <VStack align="stretch" spacing={3}>
                  <HStack spacing={2}>
                    <InputField name="name" type="text" label="Name" />
                    <InputField name="code" type="text" label="Code" />
                  </HStack>
                  <ColorPicker name="colorCode" />
                  <HStack spacing={2}>
                    <DateTimePicker name="startTime" label="Start Time" />
                    <DateTimePicker
                      name="endTime"
                      label="End Time (optional)"
                    />
                  </HStack>
                  <Button
                    mt={3}
                    colorScheme="purple"
                    type="submit"
                    isLoading={isSubmitting}
                    width="full"
                  >
                    Create
                  </Button>
                </VStack>
              </Form>
            )}
          </Formik>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
