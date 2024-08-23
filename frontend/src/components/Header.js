// Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import Profile from './Profile';

const Header = ({ title }) => {
    return (
        <AppBar position="sticky" sx={{ backgroundColor: '#621f88', top: 0 }} elevation={3}>
            <Container maxWidth={false} sx={{ paddingLeft: 0, paddingRight: 0 }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography variant="h6" color="inherit">
                        SevenZin: {title}
                    </Typography>
                    <Box>
                        <Profile />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Header;
