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
  Spinner,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Formik, FormikProvider } from "formik";
import { useEffect, useState } from "react";
import { FiCheck, FiEdit } from "react-icons/fi";
import * as Yup from "yup";
import { ColorPicker } from "../../components/ColorPicker";
import { CustomToast } from "../../components/CustomToast";
import { DateTimePicker } from "../../components/DateTimePicker";
import { InputField } from "../../components/InputField";
import type { ApiError } from "../../models/base/error.model";
import {
  getClassById,
  updateClass,
  type UpdateClassRequest,
} from "../../services/class.service";

const UpdateClassSchema = Yup.object().shape({
  name: Yup.string().required("Class name is required"),
  code: Yup.string().required("Class code is required"),
  colorCode: Yup.string().required("Class color code is required"),
  startTime: Yup.date().required("Start time is required"),
  endTime: Yup.date().nullable(),
});

interface UpdateClassModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  classId: string | null;
}

export const UpdateClassModal = ({
  isOpen,
  onClose,
  onSuccess,
  classId,
}: UpdateClassModalProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formValues, setFormValues] = useState<UpdateClassRequest>({
    name: "",
    code: "",
    colorCode: "",
    startTime: new Date(),
    endTime: null,
  });

  useEffect(() => {
    const fetchClassData = async () => {
      if (!classId) return;

      setIsLoading(true);
      try {
        const classData = await getClassById(classId);
        setFormValues({
          name: classData.name,
          code: classData.code,
          colorCode: classData.colorCode,
          startTime: new Date(classData.startTime),
          endTime: classData.endTime ? new Date(classData.endTime) : null,
        });
      } catch (error) {
        console.error("Error fetching class:", error);
        toast({
          duration: 5000,
          isClosable: true,
          position: "top-right",
          render: () => (
            <CustomToast
              title="Error"
              description="Failed to load class data"
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
      fetchClassData();
    }
  }, [classId, isOpen, onClose, toast]);

  const handleUpdate = async (
    values: UpdateClassRequest,
    resetForm: () => void
  ) => {
    if (!classId) return;

    try {
      const payload: UpdateClassRequest = {
        ...values,
        startTime: values.startTime,
        endTime: values.endTime ?? null,
      };

      await updateClass(classId, payload);
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
            title="Class updated"
            description="The class has been successfully updated."
            status="success"
          />
        ),
      });
    } catch (err: unknown) {
      // Extract error message from API response
      const error = err as ApiError;
      const errorMessage =
        error?.message || "Failed to update class. Please try again.";

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
      validationSchema={UpdateClassSchema}
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
            size="lg"
          >
            <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
            <ModalContent borderRadius="2xl" boxShadow="2xl" overflow="visible">
              <ModalHeader
                className="modal-title"
                bgGradient="linear(to-r, purple.500, purple.600)"
                color="white"
                py={6}
                fontSize="2xl"
                fontWeight="700"
                display="flex"
                alignItems="center"
                gap={3}
              >
                <Icon as={FiEdit} boxSize={6} />
                <Text>Update Class</Text>
              </ModalHeader>
              <ModalCloseButton color="white" size="lg" top={5} right={5} />

              <Divider borderColor="purple.100" />

              <ModalBody px={8} py={8}>
                {isLoading ? (
                  <Stack spacing={4} align="center" py={8}>
                    <Spinner size="xl" color="purple.500" thickness="4px" />
                    <Text color="gray.600">Loading class data...</Text>
                  </Stack>
                ) : (
                  <form onSubmit={formik.handleSubmit}>
                    <Stack spacing={6}>
                      {/* Class Name */}
                      <InputField
                        name="name"
                        label="Class Name"
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
                          label="Class Code"
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
                        <DateTimePicker<UpdateClassRequest>
                          name="startTime"
                          label="Start Time"
                        />
                        <DateTimePicker<UpdateClassRequest>
                          name="endTime"
                          label="End Time (optional)"
                        />
                      </HStack>
                    </Stack>
                  </form>
                )}
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
                    Update Class
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
