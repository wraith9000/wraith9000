import { createTheme } from '@mui/material/styles';

const wraith9000DarkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#2effbf', // Neon green used for buttons
        },
        secondary: {
            main: '#fff',
        },
        background: {
            default: '#000',
            paper: '#101010',
        },
        text: {
            primary: '#fff',
            secondary: 'rgba(255,255,255,0.66)',
        },
    },
    typography: {
        fontFamily: 'Sarpanch, Arial, sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '92px',
            lineHeight: 1,
        },
        h2: {
            fontWeight: 700,
            fontSize: '48px',
            lineHeight: 1.1,
        },
        subtitle1: {
            fontSize: '20px',
            color: 'rgba(255,255,255,0.66)',
        },
        subtitle2: {
            fontSize: '16px',
            color: 'rgba(255,255,255,0.66)',
        },
        button: {
            fontWeight: 600,
            fontSize: '18px',
            textTransform: 'none',
        },
    },
    shape: {
        borderRadius: 12,
    },
});

export default wraith9000DarkTheme; 