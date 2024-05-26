'use client';
import { createTheme } from '@mui/material/styles';
import { Lato } from 'next/font/google'

const lato = Lato({
    weight: "300",
    subsets: ['latin'],
    display: 'swap',
  });

const theme = createTheme({
    palette: {
        mode: 'light',
        primary: {
          main: '#f2aba5',
          contrastText: "#fff"
        },
        secondary: {
          main: '#945a5a',
        },
        background: {
          default: '#ffffff',
        },
        error: {
          main: '#d32f2f',
        },
        warning: {
          main: '#ecbc24',
        },
        info: {
          main: '#a794c7',
        },
        success: {
          main: '#2e7d32',
        },
        // divider: 'rgba(230,166,166,0.31)',
        divider: '#F9E7E7',
      },
      typography: {
        button: {
          fontFamily: lato.style.fontFamily,
        },
        fontFamily: lato.style.fontFamily,
        fontSize: 12,
      },
});

export default theme;