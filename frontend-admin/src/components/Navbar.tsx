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
import { FaBook, FaChalkboardTeacher, FaHome } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const navItems = [
  { label: "Home", path: "/", icon: FaHome },
  { label: "Classes", path: "/classes", icon: FaChalkboardTeacher },
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
                  <Box textAlign="center" position="relative">
                    <HStack
                      spacing={2}
                      color={isActive ? "purple.600" : "gray.600"}
                    >
                      <Icon as={icon} boxSize={5} />
                      <Text fontWeight="600">{label}</Text>
                    </HStack>

                    {/* underline bar */}
                    {isActive && (
                      <Box
                        position="absolute"
                        bottom="0"
                        top="8"
                        left="50%"
                        transform="translateX(-50%)"
                        w="100%" // shorter than full width
                        h="3px"
                        bg="purple.500"
                        borderRadius="full"
                      />
                    )}
                  </Box>
                )}
              </NavLink>
            ))}
          </HStack>

          <Button
            leftIcon={<AddIcon />}
            colorScheme="gray"
            variant="outline"
            borderRadius="full"
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
