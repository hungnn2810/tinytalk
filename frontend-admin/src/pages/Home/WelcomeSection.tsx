import { Box, Center, Text } from "@chakra-ui/react";
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
    </Box>
  );
};
