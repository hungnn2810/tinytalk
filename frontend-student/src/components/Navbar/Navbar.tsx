import {
    Box,
    Flex,
    HStack,
    Input,
    InputGroup,
    InputLeftElement,
    IconButton,
    Button,
    Image,
    Text,
} from '@chakra-ui/react';
import { SearchIcon, AddIcon, HamburgerIcon } from '@chakra-ui/icons';
import logo from '../../assets/logo.png'

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
                <HStack spacing={3}>
                    <Image src={logo} alt="TinyTalk" boxSize="48px" />
                    <Box>
                        <Text fontWeight="bold" color="pink.500" fontSize="lg">
                            TinyTalk
                        </Text>
                    </Box>
                </HStack>

                {/* Center: Search bar */}
                <Box flex="1" mx={10} maxW="400px">
                    <InputGroup>
                        <InputLeftElement pointerEvents="none">
                            <SearchIcon color="gray.400" />
                        </InputLeftElement>
                        <Input
                            type="text"
                            placeholder="Find a quiz"
                            borderRadius="full"
                            bg="gray.50"
                            _focus={{ bg: 'white', borderColor: 'purple.400' }}
                        />
                    </InputGroup>
                </Box>

                {/* Right: menu */}
                <HStack spacing={4}>
                    <HStack spacing={4} display={{ base: 'none', md: 'flex' }}>
                        <Button variant="ghost" colorScheme="purple">
                            Home
                        </Button>
                        <Button variant="ghost">Activity</Button>
                        <Button variant="ghost">Classes</Button>
                        <Button variant="ghost">Flashcards</Button>
                    </HStack>

                    <Button
                        leftIcon={<AddIcon />}
                        colorScheme="gray"
                        variant="outline"
                        borderRadius="full"
                    >
                        Create a quiz
                    </Button>

                    <IconButton
                        aria-label="Menu"
                        icon={<HamburgerIcon />}
                        variant="ghost"
                        borderRadius="full"
                        display={{ base: 'flex', md: 'none' }}
                    />
                </HStack>
            </Flex>
        </Box>
    );
};
