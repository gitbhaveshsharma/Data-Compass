// Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                marginTop: 'auto',
                textAlign: 'center',
                marginBottom: 0,
            }}
        >
            <Typography variant="body2">
                This product is under development and test. If you are having problems, please reach out to the admin.{' '}
                {/* <Link href="/contact-admin" underline="hover">admin</Link>. */}
            </Typography>
            <Typography variant="body2">
                All rights reserved © SevenZin
            </Typography>
        </Box>
    );
};

export default Footer;
