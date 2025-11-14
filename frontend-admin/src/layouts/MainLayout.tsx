import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar";

export const MainLayout = () => {
  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-br, purple.50, blue.50, pink.50)"
      position="relative"
      _before={{
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgGradient:
          "radial(circle at 20% 50%, purple.100, transparent 50%), radial(circle at 80% 80%, blue.100, transparent 50%), radial(circle at 40% 90%, pink.100, transparent 50%)",
        opacity: 0.4,
        pointerEvents: "none",
      }}
    >
      <Navbar />
      {/* Content area */}
      <Box maxW="1366px" mx="auto" p={6} position="relative" zIndex={1}>
        <Outlet />
      </Box>
    </Box>
  );
};
