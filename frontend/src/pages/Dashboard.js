import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Grid, Typography, Box, Card, CardContent, Avatar, Button, LinearProgress } from '@mui/material';
import { Assignment, CheckCircle, Pending, Build, AddCircle } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) fetchDashboardData();
    }, [user]);

        const fetchDashboardData = async () => {
        try {
            const response = await api.get('/requests/');
            console.log('🔍 API Response:', response.data);
            
            // The API returns { requests: [...], categories: ... }
            // We need to extract the requests array
            let requests = [];
            if (response.data && response.data.requests) {
                requests = response.data.requests;
            } else if (Array.isArray(response.data)) {
                requests = response.data;
            } else if (response.data.results) {
                requests = response.data.results;
            }
            
            // Ensure requests is an array
            if (!Array.isArray(requests)) {
                requests = [];
            }
            
            setStats({
                total: requests.length,
                pending: requests.filter(r => r.status === 'pending').length,
                inProgress: requests.filter(r => r.status === 'in_progress').length,
                completed: requests.filter(r => r.status === 'completed').length,
            });
            setRecentRequests(requests.slice(0, 5));
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setStats({ total: 0, pending: 0, inProgress: 0, completed: 0 });
            setRecentRequests([]);
        } finally {
            setLoading(false);
        }
    };);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
            setStats({ total: 0, pending: 0, inProgress: 0, completed: 0 });
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LinearProgress />;

    const roleName = user?.role_name || user?.role?.name || 'student';

    const StudentDashboard = () => (
        <Box>
            <Typography variant="h4" gutterBottom>Welcome, {user?.first_name || user?.username}!</Typography>
            <Typography variant="body1" paragraph>Track and manage your service requests.</Typography>
            <Grid container spacing={3}>
                {[{ title: 'Total', value: stats.total, icon: <Assignment />, color: '#1976d2' },
                  { title: 'Pending', value: stats.pending, icon: <Pending />, color: '#ff9800' },
                  { title: 'Completed', value: stats.completed, icon: <CheckCircle />, color: '#4caf50' }].map((stat, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                        <Card><CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Box><Typography color="textSecondary">{stat.title}</Typography><Typography variant="h4">{stat.value}</Typography></Box>
                                <Avatar sx={{ bgcolor: stat.color }}>{stat.icon}</Avatar>
                            </Box>
                        </CardContent></Card>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button variant="contained" startIcon={<AddCircle />} onClick={() => navigate('/requests/new')}>Submit New Request</Button>
                </Grid>
            </Grid>
        </Box>
    );

    const OfficerDashboard = () => (
        <Box>
            <Typography variant="h4" gutterBottom>Welcome, {user?.first_name || user?.username}!</Typography>
            <Typography variant="body1" paragraph>Manage your assigned maintenance tasks.</Typography>
            <Grid container spacing={3}>
                {[{ title: 'Assigned', value: stats.pending, icon: <Assignment />, color: '#2196f3' },
                  { title: 'In Progress', value: stats.inProgress, icon: <Build />, color: '#ff9800' },
                  { title: 'Completed', value: stats.completed, icon: <CheckCircle />, color: '#4caf50' }].map((stat, i) => (
                    <Grid item xs={12} sm={4} key={i}>
                        <Card><CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Box><Typography color="textSecondary">{stat.title}</Typography><Typography variant="h4">{stat.value}</Typography></Box>
                                <Avatar sx={{ bgcolor: stat.color }}>{stat.icon}</Avatar>
                            </Box>
                        </CardContent></Card>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button variant="contained" onClick={() => navigate('/assignments')}>View My Assignments</Button>
                </Grid>
            </Grid>
        </Box>
    );

    const AdminDashboard = () => (
        <Box>
            <Typography variant="h4" gutterBottom>Welcome, {user?.first_name || user?.username}!</Typography>
            <Typography variant="body1" paragraph>Manage users, requests, and system reports.</Typography>
            <Grid container spacing={3}>
                {[{ title: 'Total', value: stats.total, icon: <Assignment />, color: '#1976d2' },
                  { title: 'Pending', value: stats.pending, icon: <Pending />, color: '#ff9800' },
                  { title: 'In Progress', value: stats.inProgress, icon: <Build />, color: '#2196f3' },
                  { title: 'Completed', value: stats.completed, icon: <CheckCircle />, color: '#4caf50' }].map((stat, i) => (
                    <Grid item xs={12} sm={3} key={i}>
                        <Card><CardContent>
                            <Box display="flex" justifyContent="space-between">
                                <Box><Typography color="textSecondary">{stat.title}</Typography><Typography variant="h4">{stat.value}</Typography></Box>
                                <Avatar sx={{ bgcolor: stat.color }}>{stat.icon}</Avatar>
                            </Box>
                        </CardContent></Card>
                    </Grid>
                ))}
                <Grid item xs={12}>
                    <Button variant="contained" onClick={() => navigate('/admin')} sx={{ mr: 2 }}>Admin Panel</Button>
                    <Button variant="contained" color="secondary" onClick={() => navigate('/reports')}>Reports</Button>
                </Grid>
            </Grid>
        </Box>
    );

    let DashboardComponent;
    if (roleName === 'admin') DashboardComponent = AdminDashboard;
    else if (roleName === 'officer') DashboardComponent = OfficerDashboard;
    else DashboardComponent = StudentDashboard;

    return <Box sx={{ p: 3 }}><DashboardComponent /></Box>;
}

