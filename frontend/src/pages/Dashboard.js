import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Grid, Paper, Typography, Box, Card, CardContent, Avatar, Button, LinearProgress } from '@mui/material';
import { Assignment, CheckCircle, Pending, Build, People, Assessment, AddCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

        const fetchDashboardData = async () => {
        try {
            const response = await api.get('/requests/');
            console.log('🔍 Dashboard API Response:', response.data);
            
            // SAFE: Ensure data is always an array
            let rawData = response.data.results || response.data;
            const requests = Array.isArray(rawData) ? rawData : [];
            
            console.log('📊 Requests count:', requests.length);
            
            setStats({
                total: requests.length,
                pending: requests.filter(r => r.status === 'pending').length,
                inProgress: requests.filter(r => r.status === 'in_progress').length,
                completed: requests.filter(r => r.status === 'completed').length,
            });
            setRecentRequests(requests.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            // Set empty stats to avoid crash
            setStats({ total: 0, pending: 0, inProgress: 0, completed: 0 });
            setRecentRequests([]);
        } finally {
            setLoading(false);
        }
    };);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LinearProgress />;

    // Use role_name (from serializer) or fallback to role.name
    const roleName = user?.role_name || user?.role?.name || 'student';

    // ---------- Student / Staff Dashboard ----------
    const StudentStaffDashboard = () => (
        <Box>
            <Typography variant="h4" gutterBottom>Welcome, {user?.first_name || user?.username}!</Typography>
            <Typography variant="body1" paragraph>Track and manage your service requests.</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Card><CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box><Typography color="textSecondary">Total Requests</Typography><Typography variant="h4">{stats.total}</Typography></Box>
                            <Avatar sx={{ bgcolor: '#1976d2' }}><Assignment /></Avatar>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card><CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box><Typography color="textSecondary">Pending</Typography><Typography variant="h4">{stats.pending}</Typography></Box>
                            <Avatar sx={{ bgcolor: '#ff9800' }}><Pending /></Avatar>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card><CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box><Typography color="textSecondary">Completed</Typography><Typography variant="h4">{stats.completed}</Typography></Box>
                            <Avatar sx={{ bgcolor: '#4caf50' }}><CheckCircle /></Avatar>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" startIcon={<AddCircle />} onClick={() => navigate('/requests/new')}>Submit New Request</Button>
                </Grid>
            </Grid>
        </Box>
    );

    // ---------- Officer Dashboard ----------
    const OfficerDashboard = () => (
        <Box>
            <Typography variant="h4" gutterBottom>Welcome, {user?.first_name || user?.username}!</Typography>
            <Typography variant="body1" paragraph>Manage your assigned maintenance tasks.</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                    <Card><CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box><Typography color="textSecondary">Assigned</Typography><Typography variant="h4">{stats.pending}</Typography></Box>
                            <Avatar sx={{ bgcolor: '#2196f3' }}><Assignment /></Avatar>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card><CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box><Typography color="textSecondary">In Progress</Typography><Typography variant="h4">{stats.inProgress}</Typography></Box>
                            <Avatar sx={{ bgcolor: '#ff9800' }}><Build /></Avatar>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card><CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box><Typography color="textSecondary">Completed</Typography><Typography variant="h4">{stats.completed}</Typography></Box>
                            <Avatar sx={{ bgcolor: '#4caf50' }}><CheckCircle /></Avatar>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={() => navigate('/assignments')}>View My Assignments</Button>
                </Grid>
            </Grid>
        </Box>
    );

    // ---------- Admin Dashboard ----------
    const AdminDashboard = () => (
        <Box>
            <Typography variant="h4" gutterBottom>Welcome, {user?.first_name || user?.username}!</Typography>
            <Typography variant="body1" paragraph>Manage users, requests, and system reports.</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={3}>
                    <Card><CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box><Typography color="textSecondary">Total Requests</Typography><Typography variant="h4">{stats.total}</Typography></Box>
                            <Avatar sx={{ bgcolor: '#1976d2' }}><Assignment /></Avatar>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card><CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box><Typography color="textSecondary">Pending</Typography><Typography variant="h4">{stats.pending}</Typography></Box>
                            <Avatar sx={{ bgcolor: '#ff9800' }}><Pending /></Avatar>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card><CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box><Typography color="textSecondary">In Progress</Typography><Typography variant="h4">{stats.inProgress}</Typography></Box>
                            <Avatar sx={{ bgcolor: '#2196f3' }}><Build /></Avatar>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Card><CardContent>
                        <Box display="flex" justifyContent="space-between">
                            <Box><Typography color="textSecondary">Completed</Typography><Typography variant="h4">{stats.completed}</Typography></Box>
                            <Avatar sx={{ bgcolor: '#4caf50' }}><CheckCircle /></Avatar>
                        </Box>
                    </CardContent></Card>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" onClick={() => navigate('/admin')} sx={{ mr: 2 }}>Admin Panel</Button>
                    <Button variant="contained" color="secondary" onClick={() => navigate('/reports')}>Reports</Button>
                </Grid>
            </Grid>
        </Box>
    );

    // ---------- Render based on role ----------
    let DashboardComponent;
    if (roleName === 'admin') DashboardComponent = AdminDashboard;
    else if (roleName === 'officer') DashboardComponent = OfficerDashboard;
    else DashboardComponent = StudentStaffDashboard;

    return (
        <Box sx={{ p: 3 }}>
            <DashboardComponent />
        </Box>
    );
}

