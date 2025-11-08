import { Box, Flex, Icon, Text } from "@chakra-ui/react";
import {
  FiAlertCircle,
  FiCheckCircle,
  FiInfo,
  FiXCircle,
} from "react-icons/fi";

interface CustomToastProps {
  title: string;
  description?: string;
  status: "success" | "error" | "warning" | "info";
}

const statusConfig = {
  success: {
    icon: FiCheckCircle,
    bgColor: "green.50",
    iconColor: "green.500",
    borderColor: "green.500",
    toastBg: "green.50",
  },
  error: {
    icon: FiXCircle,
    bgColor: "red.50",
    iconColor: "red.500",
    borderColor: "red.500",
    toastBg: "red.50",
  },
  warning: {
    icon: FiAlertCircle,
    bgColor: "orange.50",
    iconColor: "orange.500",
    borderColor: "orange.500",
    toastBg: "orange.50",
  },
  info: {
    icon: FiInfo,
    bgColor: "blue.50",
    iconColor: "blue.500",
    borderColor: "blue.500",
    toastBg: "blue.50",
  },
};

export const CustomToast = ({
  title,
  description,
  status,
}: CustomToastProps) => {
  const config = statusConfig[status];

  return (
    <Box
      bg={config.toastBg}
      borderRadius="xl"
      boxShadow="xl"
      p={4}
      mr={4}
      minW="300px"
      maxW="400px"
      border="1px solid"
      borderColor="gray.200"
      borderLeftWidth="4px"
      borderLeftColor={config.borderColor}
    >
      <Flex align="start" gap={3}>
        <Flex
          align="center"
          justify="center"
          w="40px"
          h="40px"
          minW="40px"
          borderRadius="full"
          bg={config.bgColor}
        >
          <Icon as={config.icon} color={config.iconColor} boxSize={5} />
        </Flex>
        <Box flex="1" pt={1}>
          <Text fontWeight="600" fontSize="md" color="gray.800" mb={1}>
            {title}
          </Text>
          {description && (
            <Text fontSize="sm" color="gray.600">
              {description}
            </Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
