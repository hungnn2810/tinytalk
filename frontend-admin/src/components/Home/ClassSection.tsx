import { Box, Heading, HStack, Text, VStack, Image, Button } from "@chakra-ui/react";

const mockData = [
    { id: 1, title: "Jolly Phonics Letter S", questions: 20, progress: 15 },
    { id: 2, title: "Moon English HW Group 2", questions: 45, progress: 39 },
];

export const ActivitySection = () => (
    <VStack align="start" spacing={4} w="full">
        <HStack justify="space-between" w="full">
            <Heading size="md">Classes</Heading>
            <Button variant="ghost" colorScheme="purple">See all</Button>
        </HStack>

        <HStack spacing={4} overflowX="auto" w="full">
            {mockData.map((item) => (
                <Box
                    key={item.id}
                    minW="200px"
                    bg="white"
                    p={4}
                    borderRadius="lg"
                    boxShadow="sm"
                >
                    <Image
                        src="/activity-cover.png"
                        borderRadius="md"
                        mb={3}
                    />
                    <Text fontWeight="semibold">{item.title}</Text>
                    <Text fontSize="sm" color="gray.500">{item.questions} questions</Text>
                    <Box bg="purple.100" borderRadius="full" mt={2}>
                        <Box
                            w={`${(item.progress / item.questions) * 100}%`}
                            h="6px"
                            bg="purple.400"
                            borderRadius="full"
                        />
                    </Box>
                </Box>
            ))}
        </HStack>
    </VStack>
);
