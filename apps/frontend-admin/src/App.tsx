// src/App.tsx
import { ChakraProvider } from '@chakra-ui/react';
import { AuthProvider } from '@providers/AuthProvider';
import AppRouter from '@routes/AppRouter';
import { BrowserRouter } from 'react-router-dom';

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
