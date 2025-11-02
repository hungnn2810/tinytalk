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
import { InputField } from "../../components/InputField";
import type { ApiError } from "../../models/base/error.model";
import {
  type CreateLibraryRequest,
  createLibrary,
} from "../../services/library.service";
import { CustomToast } from "../../utils/toast.util";

const CreateLibrarySchema = Yup.object().shape({
  name: Yup.string().required("Library name is required"),
});

interface CreateLibraryModelProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const CreateLibraryModal = ({
  isOpen,
  onClose,
  onSuccess,
}: CreateLibraryModelProps) => {
  const toast = useToast();
  const [formValues] = useState<CreateLibraryRequest>({
    name: "",
  });

  const handleCreate = async (
    values: CreateLibraryRequest,
    resetForm: () => void
  ) => {
    try {
      const payload: CreateLibraryRequest = {
        ...values,
      };

      const createdLibrary = await createLibrary(payload);
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
            description="The library has been successfully created."
            status="success"
          />
        ),
      });

      return createdLibrary;
    } catch (err: unknown) {
      // Extract error message from API response
      const error = err as ApiError;
      const errorMessage =
        error?.message || "Failed to create library. Please try again.";

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
      validationSchema={CreateLibrarySchema}
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
                      placeholder="e.g., Jolly Phonics"
                    />
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
