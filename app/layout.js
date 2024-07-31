"use client"; // Add this line at the top

import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Inter } from 'next/font/google';

// Import the Inter font
const inter = Inter({ subsets: ['latin'] });

// Create a Material UI theme
const theme = createTheme();

// RootLayout function which includes the Material UI ThemeProvider
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
