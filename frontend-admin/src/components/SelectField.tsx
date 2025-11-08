import {
  Box,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  List,
  ListItem,
  Spinner,
} from "@chakra-ui/react";
import { useField, useFormikContext } from "formik";
import {
  Children,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface ISelectFieldProps {
  name: string;
  label?: string;
  placeholder?: string;
  children?: React.ReactNode;
  isMulti?: boolean;
  isFetching?: React.RefObject<boolean>;
  hasNextPage?: boolean;
  handleNext?: () => void;
  onSearch?: (keyword: string) => void;
}

export const SelectField = (props: ISelectFieldProps) => {
  const {
    label,
    placeholder,
    children,
    isMulti = false,
    isFetching = { current: false },
    hasNextPage = false,
    handleNext = () => {},
    onSearch,
  } = props;
  const [field, meta] = useField(props.name);
  const { setFieldValue } = useFormikContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const isUserTyping = useRef(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounce search when user types
  useEffect(() => {
    if (!onSearch || !isUserTyping.current) return;

    const timer = setTimeout(() => {
      onSearch(searchTerm);
      isUserTyping.current = false;
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, onSearch]);

  // Memoize parsed options from children
  const options = useMemo(() => {
    const result: { value: string; label: string }[] = [];
    Children.forEach(children, (child) => {
      if (!child) return;
      const elem = child as React.ReactElement<{
        value?: string | number;
        children?: React.ReactNode;
      }>;
      if (
        elem?.props &&
        (elem.props.value !== undefined || elem.props.children !== undefined)
      ) {
        const value = String(elem.props.value ?? elem.props.children ?? "");
        const label = String(elem.props.children ?? elem.props.value ?? "");
        result.push({ value, label });
      }
    });
    return result;
  }, [children]);

  // Memoize selected values
  const selectedValues = useMemo<string[]>(() => {
    return Array.isArray(field.value)
      ? (field.value as string[])
      : field.value
      ? [String(field.value)]
      : [];
  }, [field.value]);

  // Memoize filtered options
  const filteredOptions = useMemo(
    () =>
      options.filter((opt) =>
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [options, searchTerm]
  );

  // Memoize display value
  const displayValue = useMemo(() => {
    if (isMulti) {
      if (selectedValues.length === 0) return "";
      return selectedValues
        .map((val) => {
          const opt = options.find((o) => o.value === val);
          return opt ? opt.label : val;
        })
        .join(", ");
    }
    if (!field.value) return "";
    const opt = options.find((o) => o.value === String(field.value));
    return opt ? opt.label : String(field.value);
  }, [isMulti, selectedValues, field.value, options]);

  // Handle selection with useCallback
  const handleSelect = useCallback(
    (val: string) => {
      if (isMulti) {
        const currentValues = (field.value || []) as string[];
        const isSelected = currentValues.includes(val);
        const next = isSelected
          ? currentValues.filter((v) => v !== val)
          : [...currentValues, val];
        setFieldValue(props.name, next);
        setSearchTerm("");
      } else {
        setFieldValue(props.name, val);
        setIsOpen(false);
        setSearchTerm("");
      }
    },
    [isMulti, field.value, props.name, setFieldValue]
  );

  // Handle input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      isUserTyping.current = true;
      setSearchTerm(e.target.value);
      setIsOpen(true);
    },
    []
  );

  // Handle scroll
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLUListElement>) => {
      const target = e.currentTarget;
      const nearBottom =
        target.scrollHeight - target.scrollTop <= target.clientHeight + 100;
      if (nearBottom && hasNextPage && !isFetching.current) {
        handleNext();
      }
    },
    [hasNextPage, isFetching, handleNext]
  );

  return (
    <FormControl id={props.name} isInvalid={!!meta.error && !!meta.touched}>
      {/* Label */}
      {label && (
        <FormLabel mb="1" htmlFor={props.name}>
          {label}
        </FormLabel>
      )}

      {/* Searchable Input + Dropdown */}
      <Box position="relative" ref={containerRef}>
        <Input
          value={searchTerm || displayValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          focusBorderColor="purple.500"
          borderRadius="lg"
          bg="white"
          autoComplete="off"
        />

        {/* Dropdown list */}
        {isOpen && filteredOptions.length > 0 && (
          <List
            position="absolute"
            top="100%"
            left={0}
            right={0}
            mt={1}
            bg="white"
            border="1px solid"
            borderColor="gray.200"
            borderRadius="lg"
            boxShadow="lg"
            maxH="200px"
            overflowY="auto"
            zIndex={10}
            onScroll={handleScroll}
          >
            {filteredOptions.map((opt) => {
              const isSelected = isMulti && selectedValues.includes(opt.value);
              return (
                <ListItem
                  key={opt.value}
                  px={4}
                  py={2}
                  cursor="pointer"
                  bg={isSelected ? "purple.50" : "white"}
                  fontWeight={isSelected ? "600" : "normal"}
                  _hover={{
                    bg: isSelected ? "purple.100" : "purple.50",
                  }}
                  onClick={() => {
                    handleSelect(opt.value);
                  }}
                >
                  {opt.label}
                  {isSelected && " ✓"}
                </ListItem>
              );
            })}
            {isFetching.current && hasNextPage && (
              <Center py={4}>
                <Spinner size="sm" />
              </Center>
            )}
          </List>
        )}
      </Box>

      {/* Error message */}
      <Box minH="20px" mt="1">
        <FormErrorMessage m="0" fontSize="sm">
          {meta.touched ? meta.error : ""}
        </FormErrorMessage>
      </Box>
    </FormControl>
  );
};
