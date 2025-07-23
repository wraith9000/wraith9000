import React from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import wraith9000DarkTheme from './theme';

interface ThemeProviderProps {
    children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => (
    <MuiThemeProvider theme={wraith9000DarkTheme}>
        <CssBaseline />
        {children}
    </MuiThemeProvider>
);

export default ThemeProvider; 