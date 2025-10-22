import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Spinner,
  Tab,
  Table,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { FaBolt, FaClock, FaSuitcase, FaUserGraduate } from "react-icons/fa";
import { StatCard } from "../../components/StatCard";
import type { SearchResponse } from "../../models/base/search.model";
import type { Class } from "../../models/class.model";
import { searchClass } from "../../services/class.service";
import { parseToZonedDate } from "../../utils/datetime.util";

export const OverviewSection = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [total] = useState(0);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState<SearchResponse<Class>["metadata"]>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  useEffect(() => {
    setLoading(true);
    searchClass({ page, limit: 10 }).then((res) => {
      setClasses(res.data);
      setMetadata(res.metadata);
      setLoading(false);
    });
  }, [page]);

  const handlePrev = () => {
    if (metadata.hasPrevPage) setPage((p) => p - 1);
  };

  const handleNext = () => {
    if (metadata.hasNextPage) setPage((p) => p + 1);
  };

  return (
    <VStack spacing={6} align="stretch" w="full" px={6}>
      <HStack spacing={5} align="stretch" flexWrap="wrap" w="full">
        <StatCard
          icon={<FaSuitcase />}
          label="TOTAL CLASSES"
          value={62}
          tooltip="Total registered classes"
        />
        <StatCard
          icon={<FaSuitcase />}
          label="PEDING CLASSES"
          value={62}
          tooltip="Total pending classes"
        />
        <StatCard
          icon={<FaUserGraduate />}
          label="TOTAL STUDENTS"
          value={422}
          tooltip="Total enrolled students"
        />
        <StatCard
          icon={<FaBolt />}
          label="COMPLETED TESTS"
          value="2,333"
          tooltip="Number of completed tests"
        />
        <StatCard
          icon={<FaClock />}
          label="STUDY HOURS"
          value="378.5"
          tooltip="Total study hours (hours)"
        />
      </HStack>

      <Tabs variant="unstyled" w="full">
        <TabList
          borderBottom="1px solid"
          borderColor="gray.100"
          display="flex"
          alignItems="center"
          gap={6}
          px={4}
        >
          {["Classes", "Students", "Homeworks"].map((label) => (
            <Tab
              key={label}
              flex="none"
              px={2}
              py={3}
              position="relative"
              fontWeight="semibold"
              color="gray.500"
              _selected={{
                color: "purple.600",
                fontWeight: "bold",
                _after: {
                  opacity: 1,
                  transform: "translateX(-50%) scaleX(1)",
                },
              }}
              _after={{
                content: '""',
                position: "absolute",
                height: "3px",
                width: "100%",
                left: "50%",
                bottom: "-1px",
                transform: "translateX(-50%) scaleX(0)",
                transformOrigin: "center",
                bg: "purple.500",
                borderRadius: "full",
                transition: "transform 180ms ease, opacity 120ms ease",
                opacity: 0,
              }}
            >
              {label}
            </Tab>
          ))}
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="xl" fontWeight="bold">
                Classes
              </Text>
              <Text fontSize="sm" color="gray.500">
                Total: {total}
              </Text>
            </Flex>
            {loading ? (
              <Center py={10}>
                <Spinner size="lg" color="purple.500" />
              </Center>
            ) : (
              <>
                <Box overflowX="auto" w="full">
                  <Table variant="simple" minW="1200px">
                    <Thead bg="gray.50">
                      <Tr>
                        <Th>Name</Th>
                        <Th>Code</Th>
                        <Th>Start</Th>
                        <Th>End</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {classes.map((c) => (
                        <Tr key={c.id}>
                          <Td>{c.name}</Td>
                          <Td>{c.code}</Td>
                          <Td>
                            {format(
                              parseToZonedDate(
                                c.startTime,
                                "dd/MM/yyyy",
                                "Asia/Bangkok"
                              ),
                              "yyyy-MM-dd'T'HH:mm:ss"
                            )}
                          </Td>
                          <Td>
                            {c.endTime
                              ? new Date(c.endTime).toLocaleString()
                              : ""}
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
                <Flex justify="space-between" align="center" mt={4}>
                  <Button
                    onClick={handlePrev}
                    isDisabled={!metadata.hasPrevPage}
                  >
                    Previous
                  </Button>
                  <Text fontSize="sm" color="gray.500">
                    Page {metadata.page} of {metadata.totalPages}
                  </Text>
                  <Button
                    onClick={handleNext}
                    isDisabled={!metadata.hasNextPage}
                  >
                    Next
                  </Button>
                </Flex>
              </>
            )}
            {/* <Box overflow="auto">
            <Table variant="simple" minW="1200px">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Class</Th>
                  <Th>Student</Th>
                </Tr>
              </Thead>
            </Table>
          </Box> */}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
