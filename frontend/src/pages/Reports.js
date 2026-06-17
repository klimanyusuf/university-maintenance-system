import React from 'react';
import { Container, Typography, Paper, Button, Box } from '@mui/material';
import { GetApp } from '@mui/icons-material';
import api from '../services/api';

export default function Reports() {
    const handleExportCSV = async () => {
        try {
            const response = await api.get('/requests/export_csv/', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'requests.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Export failed');
        }
    };

    const handleExportPDF = async () => {
        try {
            const response = await api.get('/requests/export_pdf/', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'requests.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            alert('Export failed');
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 3 }}>
            <Typography variant="h4" gutterBottom>Reports</Typography>
            <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>Export Service Requests</Typography>
                <Box display="flex" gap={2}>
                    <Button variant="contained" startIcon={<GetApp />} onClick={handleExportCSV}>Export CSV</Button>
                    <Button variant="contained" startIcon={<GetApp />} onClick={handleExportPDF}>Export PDF</Button>
                </Box>
            </Paper>
        </Container>
    );
}
