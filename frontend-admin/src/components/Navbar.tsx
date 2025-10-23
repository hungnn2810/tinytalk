import { AddIcon, HamburgerIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
} from "@chakra-ui/react";
import {
  FaBook,
  FaChalkboardTeacher,
  FaHome,
  FaUserGraduate,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const navItems = [
  { label: "Home", path: "/", icon: FaHome },
  { label: "Classes", path: "/classes", icon: FaChalkboardTeacher },
  { label: "Students", path: "/students", icon: FaUserGraduate },
  { label: "Homeworks", path: "/homeworks", icon: FaBook },
];

export const Navbar = () => {
  return (
    <Box
      bg="white"
      px={4}
      py={2}
      boxShadow="sm"
      position="sticky"
      top="0"
      zIndex="1000"
    >
      <Flex alignItems="center" justifyContent="space-between">
        {/* Left: Logo */}
        <HStack spacing={1} w="35%">
          <Image src={logo} alt="TinyTalk" boxSize="48px" />
          <Box>
            <Text fontWeight="bold" color="pink.500" fontSize="lg">
              TinyTalk
            </Text>
          </Box>

          {/* Search bar */}
          <Box flex="1" mx={5}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                type="text"
                borderRadius="full"
                bg="gray.50"
                _focus={{ bg: "white", borderColor: "purple.400" }}
              />
            </InputGroup>
          </Box>
        </HStack>

        {/* Right: menu */}
        <HStack spacing={4}>
          <HStack spacing={10} display={{ base: "none", md: "flex" }}>
            {navItems.map(({ label, path, icon }) => (
              <NavLink key={path} to={path} end>
                {({ isActive }) => (
                  <Box
                    as="span"
                    position="relative"
                    textAlign="center"
                    px={2}
                    py={1.5}
                    fontWeight={isActive ? "bold" : "semibold"}
                    color={isActive ? "purple.600" : "gray.600"}
                    sx={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      _after: {
                        content: '""',
                        position: "absolute",
                        height: "3px",
                        width: "70%", // chiếm 70% chiều rộng text
                        left: "50%",
                        bottom: "-3px", // nằm gần text hơn
                        transform: isActive
                          ? "translateX(-50%) scaleX(1)"
                          : "translateX(-50%) scaleX(0)",
                        transformOrigin: "center",
                        bg: "purple.500",
                        borderRadius: "full",
                        transition: "transform 200ms ease, opacity 150ms ease",
                        opacity: isActive ? 1 : 0,
                      },
                      _hover: {
                        color: "purple.500",
                        _after: {
                          transform: "translateX(-50%) scaleX(1)",
                          opacity: 0.5,
                        },
                      },
                    }}
                  >
                    <HStack
                      spacing={2}
                      color={isActive ? "purple.600" : "gray.600"}
                    >
                      <Icon as={icon} boxSize={5} />
                      <Text fontWeight="600">{label}</Text>
                    </HStack>

                    {/* {isActive && (
                      <Box
                        position="absolute"
                        bottom="0"
                        top="8"
                        left="50%"
                        transform="translateX(-50%)"
                        w="full" // shorter than full width
                        h="3px"
                        bg="purple.500"
                        borderRadius="full"
                      />
                    )} */}
                  </Box>
                )}
              </NavLink>
            ))}
          </HStack>

          <Button
            leftIcon={<AddIcon />}
            colorScheme="purple"
            variant="outline"
            borderRadius="full"
            sx={{
              color: "var(--chakra-colors-purple-500) !important",
              borderColor: "var(--chakra-colors-purple-500) !important",
            }}
          >
            Assign homework
          </Button>

          <IconButton
            aria-label="Menu"
            icon={<HamburgerIcon />}
            variant="ghost"
            borderRadius="full"
            display={{ base: "flex", md: "none" }}
          />
        </HStack>
      </Flex>
    </Box>
  );
};
