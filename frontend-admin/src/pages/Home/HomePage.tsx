import { Box, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { ClassSection } from "./ClassSection";
import { WelcomeSection } from "./WelcomeSection";

export default function HomePage() {
  const { user } = useAuth();
  useEffect(() => {}, [user]);
  return (
    <Box p={6}>
      {/* Classes */}
      <VStack mt={8} spacing={10}>
        <WelcomeSection />
        <ClassSection />
      </VStack>
    </Box>
  );
}
