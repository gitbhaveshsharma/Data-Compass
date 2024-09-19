import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const IPTable = ({ ips, onDeleteIP }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>IP</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {ips.map((ip) => (
                        <TableRow key={ip._id}>
                            <TableCell>{ip.ip}</TableCell>
                            <TableCell>{ip.name}</TableCell>
                            <TableCell>{ip.status}</TableCell>
                            <TableCell>
                                <IconButton onClick={() => onDeleteIP(ip._id)} color="secondary">
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default IPTable;
