import { Button, Flex, Text } from "@chakra-ui/react";
import React from "react";

type Props = {
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onNext: () => void;
  onPrev: () => void;
};

const Pagination: React.FC<Props> = ({
  page,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onNext,
  onPrev,
}) => {
  if (totalPages <= 1) return null;

  return (
    <Flex justify="space-between" align="center" mt={4}>
      <Button
        onClick={onPrev}
        isDisabled={!hasPrevPage}
        colorScheme="purple"
        variant="outline"
      >
        Previous
      </Button>

      <Text fontSize="sm" color="gray.500">
        Page {page} of {totalPages}
      </Text>

      <Button onClick={onNext} isDisabled={!hasNextPage} colorScheme="purple">
        Next
      </Button>
    </Flex>
  );
};

export default Pagination;
