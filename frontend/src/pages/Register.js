import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Paper, TextField, Button, Typography, Box, Alert, MenuItem } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

export default function Register() {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', first_name: '', last_name: '', user_type: 'student' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        const success = await register(formData);
        if (success) navigate('/login');
        else setError('Registration failed');
        setLoading(false);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Typography variant="h4" align="center" gutterBottom>Create Account</Typography>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth label="Username" value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} margin="normal" required />
                    <TextField fullWidth label="Email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} margin="normal" required />
                    <TextField fullWidth label="Password" type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} margin="normal" required />
                    <TextField fullWidth label="First Name" value={formData.first_name} onChange={(e) => setFormData({...formData, first_name: e.target.value})} margin="normal" />
                    <TextField fullWidth label="Last Name" value={formData.last_name} onChange={(e) => setFormData({...formData, last_name: e.target.value})} margin="normal" />
                    <TextField select fullWidth label="User Type" value={formData.user_type} onChange={(e) => setFormData({...formData, user_type: e.target.value})} margin="normal">
                        <MenuItem value="student">Student</MenuItem>
                        <MenuItem value="staff">Staff</MenuItem>
                    </TextField>
                    <Button type="submit" fullWidth variant="contained" size="large" disabled={loading} sx={{ mt: 3 }}>
                        {loading ? 'Creating...' : 'Register'}
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}
