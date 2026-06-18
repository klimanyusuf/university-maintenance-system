import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Chip, Button, Grid, TextField, Divider, Alert, LinearProgress, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function RequestDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [notes, setNotes] = useState('');
    const [officers, setOfficers] = useState([]);
    const [selectedOfficer, setSelectedOfficer] = useState('');

    useEffect(() => {
        fetchRequest();
        if (user?.role_name === 'admin') {
            fetchOfficers();
        }
    }, [id, user]);

    const fetchRequest = async () => {
        try {
            const response = await api.get(`/requests/requests/${id}/`);
            setRequest(response.data);
        } catch (err) {
            setError('Failed to load request');
        } finally {
            setLoading(false);
        }
    };

    const fetchOfficers = async () => {
        try {
            const response = await api.get('/auth/users/', { params: { role: 'officer' } });
            setOfficers(response.data.results || response.data || []);
        } catch (err) {
            console.error('Failed to fetch officers:', err);
        }
    };

    const handleAssign = async () => {
        if (!selectedOfficer) {
            setError('Please select an officer');
            return;
        }
        setUpdating(true);
        try {
            await api.post(`/requests/requests/${id}/assign/`), { officer_id: selectedOfficer });
            setSuccess('Request assigned successfully');
            fetchRequest();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to assign');
        } finally {
            setUpdating(false);
        }
    };

    const handleComplete = async () => {
        setUpdating(true);
        try {
            await api.post(`/requests/requests/${id}/complete/`), { notes });
            setSuccess('Request marked as completed');
            fetchRequest();
        } catch (err) {
            setError(err.response?.data?.error || 'Failed to complete');
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <LinearProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!request) return <Typography>Request not found</Typography>;

    const isOfficer = user?.role_name === 'officer';
    const isAdmin = user?.role_name === 'admin';
    const canComplete = isOfficer && request.status !== 'completed' && request.assigned_to?.id === user?.id;
    const canAssign = isAdmin && request.status === 'pending';

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper sx={{ p: 3 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5">Request #{request.id}</Typography>
                    <Chip label={request.status} color={request.status === 'completed' ? 'success' : 'warning'} />
                </Box>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">{request.title}</Typography>
                <Typography variant="body1" paragraph>{request.description}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="body2"><strong>Category:</strong> {request.category_name || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Box>
                            <Typography variant="body2" component="span"><strong>Priority:</strong> </Typography>
                            <Chip label={request.priority} size="small" color={request.priority === 'urgent' ? 'error' : 'default'} />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2"><strong>Building:</strong> {request.building || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body2"><strong>Room:</strong> {request.room_number || 'N/A'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2"><strong>Requester:</strong> {request.requester_name || 'Unknown'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2"><strong>Assigned To:</strong> {request.assigned_to_name || 'Not assigned'}</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="body2"><strong>Created:</strong> {new Date(request.created_at).toLocaleString()}</Typography>
                    </Grid>
                </Grid>

                {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                {canAssign && (
                    <Box mt={3}>
                        <FormControl fullWidth>
                            <InputLabel>Select Officer</InputLabel>
                            <Select value={selectedOfficer} onChange={(e) => setSelectedOfficer(e.target.value)} label="Select Officer">
                                {officers.map(o => (
                                    <MenuItem key={o.id} value={o.id}>{o.username}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button variant="contained" color="primary" onClick={handleAssign} disabled={updating} sx={{ mt: 2 }}>
                            {updating ? 'Assigning...' : 'Assign to Officer'}
                        </Button>
                    </Box>
                )}

                {canComplete && (
                    <Box mt={3}>
                        <TextField label="Completion Notes" multiline rows={2} fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} />
                        <Button variant="contained" color="success" onClick={handleComplete} disabled={updating} sx={{ mt: 2 }}>
                            {updating ? 'Completing...' : 'Mark Completed'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
}


