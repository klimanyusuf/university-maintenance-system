import React from 'react';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
import { GetApp } from '@mui/icons-material';
import api from '../services/api';

export default function Reports() {
    const handleExport = async (format) => {
        try {
            const response = await api.get(`/requests/export_${format}/`, { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `requests.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error(`Export to ${format} failed:`, err);
            alert(`Export to ${format} failed. Please try again.`);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Typography variant="h4" gutterBottom>Reports</Typography>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Export Service Requests</Typography>
                <Box display="flex" gap={2}>
                    <Button variant="contained" startIcon={<GetApp />} onClick={() => handleExport('csv')}>Export CSV</Button>
                    <Button variant="contained" startIcon={<GetApp />} onClick={() => handleExport('pdf')}>Export PDF</Button>
                </Box>
            </Paper>
        </Container>
    );
}
