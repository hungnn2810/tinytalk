import { Box, VStack } from "@chakra-ui/react";
import { useEffect } from "react";
import { ActivitySection } from "../components/Home/ClassSection";
import { useAuth } from "../hooks/useAuth";

export default function HomePage() {
  const { user } = useAuth();
  useEffect(() => {}, [user]);
  return (
    <Box p={6}>
      {/* Classes */}
      <VStack mt={8} spacing={10}>
        <ActivitySection />
      </VStack>
    </Box>
  );
}
