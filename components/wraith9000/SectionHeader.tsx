import React from 'react';
import { Typography, Box } from '@mui/material';

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    sx?: object;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, sx }) => (
    <Box sx={{ mb: 6, ...sx }}>
        <Typography variant="h2" sx={{ mb: 1 }}>
            {title}
        </Typography>
        {subtitle && (
            <Typography variant="subtitle1" color="text.secondary">
                {subtitle}
            </Typography>
        )}
    </Box>
);

export default SectionHeader; 