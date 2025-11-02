import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import {
  FaBook,
  FaChalkboardTeacher,
  FaFile,
  FaHome,
  FaUserGraduate,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";
import { CreateClassModal } from "../pages/Classes/CreateClassModal";

const navItems = [
  { label: "Home", path: "/", icon: FaHome },
  { label: "Classes", path: "/classes", icon: FaChalkboardTeacher },
  { label: "Students", path: "/students", icon: FaUserGraduate },
  { label: "Library", path: "/library", icon: FaBook },
];

export const Navbar = () => {
  const [isModalCreateClassOpen, setIsModalCreateClassOpen] = useState(false);

  const menuItems = [
    {
      label: "Class",
      icon: FaChalkboardTeacher,
      onClick: () => {
        setIsModalCreateClassOpen(true);
        console.log(isModalCreateClassOpen);
      },
    },
    { label: "Student", icon: FaUserGraduate },
    { label: "Library", icon: FaBook },
    { label: "Homework", icon: FaFile },
  ];
  return (
    <Box
      bg="white"
      px={8}
      py={3}
      boxShadow="0 2px 8px rgba(0, 0, 0, 0.05)"
      position="sticky"
      top={0}
      zIndex={1000}
      borderBottom="1px"
      borderColor="gray.100"
    >
      <Flex justifyContent="space-between" alignItems="center">
        {/* Left: Logo */}
        <HStack spacing={3}>
          <Image
            src={logo}
            alt="TinyTalk"
            boxSize="40px"
            transition="transform 0.2s"
            _hover={{ transform: "scale(1.05)" }}
          />
          <Box>
            <Text
              fontWeight="bold"
              bgGradient="linear(to-r, pink.500, purple.500)"
              bgClip="text"
              fontSize="xl"
              letterSpacing="tight"
            >
              TinyTalk
            </Text>
          </Box>
        </HStack>

        {/* Center: Navigation menu */}
        <HStack spacing={1}>
          {navItems.map(({ label, path, icon }) => (
            <NavLink key={path} to={path} end>
              {({ isActive }) => (
                <Box
                  as="span"
                  position="relative"
                  px={4}
                  py={2}
                  borderRadius="lg"
                  fontWeight="600"
                  fontSize="sm"
                  color={isActive ? "purple.600" : "gray.600"}
                  bg={isActive ? "purple.50" : "transparent"}
                  transition="all 0.2s ease"
                  cursor="pointer"
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    _hover: {
                      color: "purple.600",
                      bg: isActive ? "purple.50" : "gray.50",
                      transform: "translateY(-1px)",
                    },
                  }}
                >
                  <HStack spacing={2}>
                    <Icon
                      as={icon}
                      boxSize={4}
                      color={isActive ? "purple.500" : "gray.500"}
                    />
                    <Text>{label}</Text>
                  </HStack>
                </Box>
              )}
            </NavLink>
          ))}
        </HStack>

        {/* Right: Search bar and New button */}
        <HStack spacing={3}>
          {/* Search bar */}
          <Box w="240px">
            <InputGroup size="md">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" boxSize={4} />
              </InputLeftElement>
              <Input
                type="text"
                placeholder="Search..."
                borderRadius="full"
                bg="gray.50"
                border="1px"
                borderColor="gray.200"
                fontSize="sm"
                _hover={{
                  borderColor: "purple.300",
                  bg: "white",
                }}
                _focus={{
                  bg: "white",
                  borderColor: "purple.400",
                  boxShadow: "0 0 0 1px var(--chakra-colors-purple-400)",
                }}
                transition="all 0.2s"
              />
            </InputGroup>
          </Box>

          {/* New button */}
          <Menu>
            <MenuButton
              as={Button}
              leftIcon={<AddIcon boxSize={3} />}
              bgGradient="linear(to-r, purple.500, purple.600)"
              color="white"
              borderRadius="full"
              px={6}
              size="md"
              fontWeight="600"
              fontSize="sm"
              _hover={{
                bgGradient: "linear(to-r, purple.600, purple.700)",
                transform: "translateY(-2px)",
                boxShadow: "lg",
              }}
              _active={{
                transform: "translateY(0)",
                boxShadow: "md",
              }}
              boxShadow="md"
              transition="all 0.2s"
            >
              New
            </MenuButton>
            <MenuList
              boxShadow="xl"
              borderRadius="xl"
              py={2}
              border="1px"
              borderColor="gray.100"
              minW="200px"
              mt={2}
            >
              {menuItems.map(({ label, icon: IconComponent, onClick }) => (
                <MenuItem
                  key={label}
                  icon={
                    <Icon as={IconComponent} color="purple.500" boxSize={4} />
                  }
                  onClick={onClick}
                  borderRadius="md"
                  mx={2}
                  fontSize="sm"
                  fontWeight="500"
                  _hover={{
                    bg: "purple.50",
                    color: "purple.700",
                  }}
                  transition="all 0.15s"
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
            <CreateClassModal
              isOpen={isModalCreateClassOpen}
              onClose={() => setIsModalCreateClassOpen(false)}
              onSuccess={() => {}}
            />
          </Menu>
        </HStack>
      </Flex>
    </Box>
  );
};
