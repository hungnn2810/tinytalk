import { Box } from '@chakra-ui/react';
import { Navbar } from '../components/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

export const MainLayout = () => {
    return (
        <Box>
            <Navbar />
            {/* Phần nội dung trang */}
            <Box p={6}>
                <Outlet />
            </Box>
        </Box>
    );
};