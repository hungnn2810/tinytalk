import { AtSignIcon, LockIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Checkbox,
  Heading,
  Image,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import logo from "../assets/logo.png";
import { InputField } from "../components/InputField";

export const LoginPage = () => {
  return (
    <Center h="100vh" bg="purple.200">
      <Box
        bg="white"
        p="20"
        rounded="xl"
        boxShadow="lg"
        width={{ base: "90%", sm: "400px", md: "500px", lg: "600px" }} // 👈 wider container
      >
        <Image src={logo} maxWidth="100" mb="8" mx="auto" />
        <Heading as="h1">Log in.</Heading>

        <Formik
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              console.log(values);
              setSubmitting(false);
            }, 1000);
          }}
          initialValues={{ email: "", password: "" }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack my="4" spacing="6">
                <InputField
                  name="email"
                  type="email"
                  label="Email"
                  leftAddon={<AtSignIcon color="purple.500" />}
                />
                <InputField
                  name="password"
                  type="password"
                  label="Password"
                  leftAddon={<LockIcon color="purple.500" />}
                />
                <Checkbox colorScheme="purple">Keep me logged in</Checkbox>
                <Button
                  isLoading={isSubmitting}
                  loadingText="Whispering to our servers"
                  size="lg"
                  colorScheme="purple"
                  type="submit"
                >
                  Login
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>

        <Stack justify="center" color="gray.600" spacing="3">
          <Text as="div" textAlign="center">
            <span>Don't have an account? </span>
            <Button colorScheme="purple" variant="link">
              Sign up
            </Button>
          </Text>
          <Button colorScheme="purple" variant="link">
            Forgot password?
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};
