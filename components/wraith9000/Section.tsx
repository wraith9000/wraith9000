import React from 'react';
import { Box } from '@mui/material';

interface SectionProps {
    children: React.ReactNode;
    id?: string;
    sx?: object;
}

const Section: React.FC<SectionProps> = ({ children, id, sx }) => (
    <Box
        id={id}
        sx={{
            width: '100%',
            py: { xs: 4, sm: 6, md: 8, lg: 12 },
            px: { xs: 2, sm: 3, md: 4, lg: 6 },
            // Ensure proper mobile spacing
            minHeight: { xs: 'auto', sm: 'auto' },
            // Better mobile container handling
            overflow: 'hidden',
            position: 'relative',
            ...sx,
        }}
    >
        {children}
    </Box>
);

export default Section; 