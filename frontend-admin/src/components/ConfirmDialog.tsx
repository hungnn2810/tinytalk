import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  Flex,
  Icon,
  Text,
} from "@chakra-ui/react";
import { useRef } from "react";
import { FiAlertTriangle } from "react-icons/fi";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColorScheme?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColorScheme = "red",
  isLoading = false,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      isCentered
      motionPreset="slideInBottom"
    >
      <AlertDialogOverlay bg="blackAlpha.400" backdropFilter="blur(4px)" />
      <AlertDialogContent
        mx={4}
        borderRadius="2xl"
        boxShadow="2xl"
        overflow="hidden"
      >
        <AlertDialogHeader
          fontSize="xl"
          fontWeight="bold"
          pt={6}
          pb={2}
          bg="gray.50"
          borderBottom="1px"
          borderColor="gray.200"
        >
          <Flex align="center" gap={3}>
            <Flex
              align="center"
              justify="center"
              w="40px"
              h="40px"
              borderRadius="full"
              bg={confirmColorScheme === "red" ? "red.100" : "orange.100"}
            >
              <Icon
                as={FiAlertTriangle}
                color={confirmColorScheme === "red" ? "red.500" : "orange.500"}
                boxSize={5}
              />
            </Flex>
            <Text>{title}</Text>
          </Flex>
        </AlertDialogHeader>

        <AlertDialogBody py={6} fontSize="md" color="gray.600">
          {message}
        </AlertDialogBody>

        <AlertDialogFooter
          bg="gray.50"
          borderTop="1px"
          borderColor="gray.200"
          gap={3}
        >
          <Button
            ref={cancelRef}
            onClick={onClose}
            isDisabled={isLoading}
            variant="ghost"
            colorScheme="gray"
            size="md"
            _hover={{
              bg: "gray.200",
            }}
          >
            {cancelText}
          </Button>
          <Button
            colorScheme={confirmColorScheme}
            onClick={handleConfirm}
            isLoading={isLoading}
            size="md"
            fontWeight="600"
            px={6}
            _hover={{
              transform: "translateY(-1px)",
              boxShadow: "lg",
            }}
            _active={{
              transform: "translateY(0)",
              boxShadow: "md",
            }}
          >
            {confirmText}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
