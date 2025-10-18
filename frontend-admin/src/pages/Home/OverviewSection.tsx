import {
  Box,
  Flex,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";

const mockedData = [
  {
    name: "FLYER Bắc Ninh",
    role: "Admin",
    wallet: 0,
    admins: 1,
    classes: 2,
    teachers: 0,
    students: 3,
  },
  {
    name: "FLYER An Giang",
    role: "Admin",
    wallet: 0,
    admins: 1,
    classes: 6,
    teachers: 0,
    students: 11,
  },
  {
    name: "FLYER Nghệ An",
    role: "Admin",
    wallet: 0,
    admins: 1,
    classes: 5,
    teachers: 0,
    students: 7,
  },
  {
    name: "FLYER Bình Thuận",
    role: "Admin",
    wallet: 0,
    admins: 2,
    classes: 3,
    teachers: 0,
    students: 7,
  },
  {
    name: "FLYER Bình Dương",
    role: "Admin",
    wallet: 0,
    admins: 2,
    classes: 9,
    teachers: 0,
    students: 8,
  },
  {
    name: "FLYER Đà Nẵng",
    role: "Admin",
    wallet: 0,
    admins: 2,
    classes: 3,
    teachers: 0,
    students: 9,
  },
  {
    name: "Duyên Kỳ's school",
    role: "Admin",
    wallet: 0,
    admins: 2,
    classes: 8,
    teachers: 0,
    students: 90,
  },
  {
    name: "FLYER Hải Phòng",
    role: "Admin",
    wallet: 0,
    admins: 1,
    classes: 6,
    teachers: 0,
    students: 45,
  },
  {
    name: "FLYER Hồ Chí Minh",
    role: "Admin",
    wallet: 0,
    admins: 2,
    classes: 9,
    teachers: 1,
    students: 63,
  },
  {
    name: "Demo FLYER's school",
    role: "Admin",
    wallet: 204,
    admins: 4,
    classes: 11,
    teachers: 5,
    students: 180,
  },
];

export const OverviewSection = () => (
  <Box bg="white" borderRadius="2xl" p={6} shadow="sm">
    <Tabs colorScheme="purple" variant="enclosed">
      <TabList borderBottom="none">
        <Tab fontWeight="bold">Classes</Tab>
        <Tab fontWeight="bold">Students</Tab>
        <Tab fontWeight="bold">Homeworks</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>
          <Flex justify="space-between" align="center" mb={4}>
            <Text fontSize="xl" fontWeight="bold">
              Classes
            </Text>
            <Text fontSize="sm" color="gray.500">
              Total: {mockedData.length}
            </Text>
          </Flex>

          <Box overflow="auto">
            <Table variant="simple" minW="1200px">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Class</Th>
                  <Th>Student</Th>
                </Tr>
              </Thead>
            </Table>
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </Box>
);
