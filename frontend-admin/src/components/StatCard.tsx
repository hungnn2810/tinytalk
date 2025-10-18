import { InfoIcon } from "@chakra-ui/icons";
import { Box, Flex, Text, Tooltip } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  color?: string;
  tooltip?: string;
}

export const StatCard = ({
  icon,
  label,
  value,
  color = "orange.400",
  tooltip,
}: StatCardProps) => {
  return (
    <Box
      bg="white"
      p={6}
      rounded="2xl"
      shadow="md"
      flex="1"
      minW="200px"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      _hover={{ shadow: "lg", transform: "translateY(-3px)" }}
      transition="all 0.2s"
    >
      <Flex align="center" justify="space-between" mb={2}>
        <Flex align="center" gap={2}>
          <Box color={color} fontSize="xl">
            {icon}
          </Box>
          <Text fontWeight="semibold" color="gray.500" fontSize="sm">
            {label}
          </Text>
        </Flex>
        {tooltip && (
          <Tooltip label={tooltip} fontSize="sm">
            <InfoIcon color="gray.400" boxSize={4} />
          </Tooltip>
        )}
      </Flex>
      <Text fontSize="3xl" fontWeight="bold">
        {value}
      </Text>
    </Box>
  );
};
