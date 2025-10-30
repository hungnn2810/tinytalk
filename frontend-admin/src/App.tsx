// src/App.tsx
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider";
import { AppRouter } from "./routes/AppRoute";
import "./styles/custom-chakra.css";

export const App = () => {
  return (
    <ChakraProvider>
      <BrowserRouter>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </BrowserRouter>
    </ChakraProvider>
  );
};

export default App;
