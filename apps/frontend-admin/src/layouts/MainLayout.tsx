import { Box } from '@chakra-ui/react';
import { Navbar } from '../components/Navbar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <Box>
            <Navbar />
            {/* Content area */}
            <Box maxW="1366px" mx="auto" p={6}>
                <Outlet />
            </Box>
        </Box>
    );
};