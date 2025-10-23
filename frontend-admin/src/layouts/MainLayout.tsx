import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const MainLayout = () => {
  return (
    <Box backgroundColor="rgb(240, 242, 245)" minH="100vh">
      <Navbar />
      {/* Content area */}
      <Box maxW="1366px" mx="auto" p={6}>
        <Outlet />
      </Box>
    </Box>
  );
};
