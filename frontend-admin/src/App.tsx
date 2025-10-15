// src/App.tsx
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./providers/AuthProvider";
import { AppRouter } from "./routes/AppRoute";

export const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
