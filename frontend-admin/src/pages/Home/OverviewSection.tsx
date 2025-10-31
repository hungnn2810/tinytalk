import {
  Box,
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
import { useEffect, useRef, useState } from "react";
import { FaBolt, FaClock, FaSuitcase, FaUserGraduate } from "react-icons/fa";
import { StatCard } from "../../components/StatCard";
import type { SearchResponse } from "../../models/base/search.model";
import type { Class } from "../../models/class.model";
import { searchClass } from "../../services/class.service";
import { parseToZonedDate } from "../../utils/datetime.util";

export const OverviewSection = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setPage] = useState(1);
  const [metadata, setMetadata] = useState<SearchResponse<Class>["metadata"]>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const isFetching = useRef(false); // ✅ ngăn gọi API trùng
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchClasses = async (page: number) => {
    if (isFetching.current) return;
    isFetching.current = true;

    // ✅ chỉ set loading khi page = 1 (tức là load lần đầu)
    if (page === 1) setLoading(true);
    else setIsFetchingMore(true);

    try {
      const res = await searchClass({ page, limit: 10 });

      if (page === 1) setClasses(res.data);
      else setClasses((prev) => [...prev, ...res.data]);

      setMetadata(res.metadata);
      setPage(res.metadata.page);
    } catch (error) {
      console.error("Error loading classes:", error);
    } finally {
      if (page === 1) setLoading(false);
      else setIsFetchingMore(false);
      isFetching.current = false;
    }
  };

  useEffect(() => {
    fetchClasses(1);
  }, []);

  const handleNext = () => {
    if (!metadata.hasNextPage || isFetching.current) return;
    fetchClasses(metadata.page + 1);
  };

  return (
    <VStack spacing={6} align="stretch" w="full" px={6}>
      {/* --- Stat Cards --- */}
      <HStack spacing={5} align="stretch" flexWrap="wrap" w="full">
        <StatCard
          icon={<FaSuitcase />}
          label="TOTAL CLASSES"
          value={metadata.total}
          tooltip="Total registered classes"
        />
        <StatCard
          icon={<FaSuitcase />}
          label="PENDING CLASSES"
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

      {/* --- Tabs --- */}
      <Tabs w="full" rounded="2xl" shadow="sm" bg="white" p={5}>
        <TabList
          borderBottom="1px solid"
          borderColor="gray.100"
          display="flex"
          alignItems="center"
          gap={6}
          px={2}
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
              _hover={{ color: "purple.600" }}
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
                transition: "transform 200ms ease, opacity 120ms ease",
                opacity: 0,
              }}
            >
              {label}
            </Tab>
          ))}
        </TabList>

        {/* --- Tab Panels --- */}
        <TabPanels>
          <TabPanel>
            <Flex justify="space-between" align="center" mb={4}>
              <Text fontSize="xl" fontWeight="bold">
                Classes
              </Text>
              <Text fontSize="sm" color="gray.500">
                Total: {metadata.total}
              </Text>
            </Flex>

            {loading ? (
              <Center py={10}>
                <Spinner size="lg" color="purple.500" />
              </Center>
            ) : (
              <>
                {/* --- Table --- */}
                <Box
                  overflowY="auto"
                  maxH="500px"
                  border="1px solid"
                  borderColor="gray.100"
                  rounded="xl"
                  onScroll={(e) => {
                    const target = e.currentTarget;
                    const nearBottom =
                      target.scrollHeight - target.scrollTop <=
                      target.clientHeight + 100;
                    if (
                      nearBottom &&
                      metadata.hasNextPage &&
                      !isFetching.current
                    ) {
                      handleNext();
                    }
                  }}
                >
                  <Table variant="simple">
                    <Thead bg="purple.50" position="sticky" top={0} zIndex={1}>
                      <Tr>
                        <Th>Name</Th>
                        <Th>Code</Th>
                        <Th>Start</Th>
                        <Th>End</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {classes.map((c, i) => (
                        <Tr
                          key={c.id}
                          _hover={{ bg: "purple.50" }}
                          bg={i % 2 === 0 ? "white" : "gray.50"}
                        >
                          <Td>{c.name}</Td>
                          <Td>{c.code}</Td>
                          <Td>{parseToZonedDate(c.startTime, "dd/MM/yyyy")}</Td>
                          <Td>
                            {c.endTime
                              ? parseToZonedDate(c.endTime, "dd/MM/yyyy")
                              : "-"}
                          </Td>
                        </Tr>
                      ))}
                      {loading && (
                        <Tr>
                          <Td colSpan={4}>
                            <Center py={4}>
                              <Spinner size="sm" color="purple.500" />
                            </Center>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  </Table>
                  {isFetchingMore && (
                    <Center py={4}>
                      <Spinner size="sm" />
                    </Center>
                  )}
                </Box>
              </>
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  );
};
