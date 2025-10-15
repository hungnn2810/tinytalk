import { Box, VStack } from "@chakra-ui/react";
import { ActivitySection } from "../components/Home/ClassSection";
import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { isAuthenticated, user } = useAuth();
  useEffect(() => {
    console.log("Authenticated:", isAuthenticated);
    console.log("User:", user);
  }, [isAuthenticated, user]);
  return (
    <Box p={6}>
      {/* Classes */}
      <VStack mt={8} spacing={10}>
        <ActivitySection />
      </VStack>
    </Box>
  );
}
