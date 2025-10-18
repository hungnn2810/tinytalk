import { Box, Center, HStack, Text } from "@chakra-ui/react";
import { FaBolt, FaClock, FaSuitcase, FaUserGraduate } from "react-icons/fa";
import { StatCard } from "../../components/StatCard";
import { useAuth } from "../../hooks/useAuth";

export const WelcomeSection = () => {
  const { user } = useAuth();

  return (
    <Box p={4}>
      <Center mb={8}>
        <Text as="h1" fontWeight="bold" fontSize="3xl">
          Welcome{" "}
          <Text as="span" color="purple.400" fontWeight="bold">
            {user?.name ? `Mr/Mrs ${user.name}` : "Guest"}
          </Text>{" "}
          👋
        </Text>
      </Center>

      <HStack spacing={5} align="stretch" flexWrap="wrap" justify="center">
        <StatCard
          icon={<FaSuitcase />}
          label="TOTAL CLASSES"
          value={62}
          tooltip="Total registered classes"
        />
        <StatCard
          icon={<FaUserGraduate />}
          label="TOTAL STUDENTS"
          value={422}
          tooltip="Total enrolled students"
        />
        <StatCard
          icon={<FaBolt />}
          label="COMPLETED TESTS"
          value="2,333"
          tooltip="Number of completed tests"
        />
        <StatCard
          icon={<FaClock />}
          label="STUDY HOURS"
          value="378.5"
          tooltip="Total study hours (hours)"
        />
      </HStack>
    </Box>
  );
};
