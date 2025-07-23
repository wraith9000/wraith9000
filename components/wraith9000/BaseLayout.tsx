import React from 'react';
import { Box } from '@mui/material';

interface BaseLayoutProps {
    children: React.ReactNode;
    sx?: object;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children, sx }) => (
    <Box
        sx={{
            minHeight: '100vh',
            bgcolor: 'background.default',
            color: 'text.primary',
            display: 'flex',
            flexDirection: 'column',
            ...sx,
        }}
    >
        {children}
    </Box>
);

export default BaseLayout; 