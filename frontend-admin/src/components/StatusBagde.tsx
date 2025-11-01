import { Badge } from "@chakra-ui/react";

interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<
  string,
  { bg: string; color: string; borderColor?: string }
> = {
  Warning: { bg: "yellow.100", color: "orange.500" },
  Fail: { bg: "red.100", color: "red.500" },
  Success: { bg: "green.100", color: "green.600" },
  Info: { bg: "blue.100", color: "blue.700" },
};

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const style = statusStyles[status] || { bg: "gray.100", color: "gray.600" };

  return (
    <Badge
      px={3}
      py={1}
      borderRadius="md"
      bg={style.bg}
      color={style.color}
      border={`1px solid ${style.color}`}
      fontSize="sm"
      textAlign="center"
      display="inline-block"
      whiteSpace="nowrap"
    >
      {status}
    </Badge>
  );
};
