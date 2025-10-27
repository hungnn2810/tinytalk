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
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import logo from "../assets/logo.png";
import { InputField } from "../components/InputField";
import { useAuth } from "../hooks/useAuth";
import { login } from "../services/auth.service";

const LoginSchema = Yup.object().shape({
  username: Yup.string()
    .matches(
      /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/,
      "Username must be a valid Vietnamese phone number"
    )
    .required("Username is required"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must have at least 6 characters"),
});

export const LoginPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const res = await login(values);
      auth.login({ name: res.user.name, username: res.user.username });
      navigate("/");
    } catch (err: unknown) {
      console.error(err);
    }
  };

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
          initialValues={{ username: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting }) => {
            await handleLogin(values);
            setSubmitting(false);
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <Stack my="4" spacing="6">
                <InputField
                  name="username"
                  type="text"
                  label="Phone Number"
                  placeholder="0912345678"
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
                  type="submit"
                  bg="purple.500"
                  color="white"
                  fontWeight="600"
                  _hover={{
                    bgGradient: "linear(to-r, #6b46c1, #805ad5)",
                    transform: "translateY(-1px)",
                    boxShadow: "md",
                  }}
                  _active={{
                    transform: "translateY(0)",
                    boxShadow: "sm",
                  }}
                  _disabled={{
                    opacity: 0.6,
                    cursor: "not-allowed",
                  }}
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
