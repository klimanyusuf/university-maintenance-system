import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { SnackbarProvider } from 'notistack';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RequestsList from './pages/RequestsList';
import RequestForm from './pages/RequestForm';
import RequestDetail from './pages/RequestDetail';
import AdminPanel from './pages/AdminPanel';
import Notifications from './pages/Notifications';
import Reports from './pages/Reports';
import Assignments from './pages/Assignments';

const theme = createTheme({
    palette: { primary: { main: '#1976d2' } }
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <SnackbarProvider maxSnack={3}>
                <Router>
                    <AuthProvider><NotificationProvider>
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route element={<PrivateRoute />}>
                                <Route element={<Layout />}>
                                    <Route path="/" element={<Navigate to="/dashboard" />} />
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/requests" element={<RequestsList />} />
                                    <Route path="/requests/new" element={<RequestForm />} />
                                    <Route path="/requests/:id" element={<RequestDetail />} />
                                    <Route path="/assignments" element={<Assignments />} />
                                    <Route path="/admin" element={<AdminPanel />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/notifications" element={<Notifications />} />
                                </Route>
                            </Route>
                        </Routes>
                    </NotificationProvider></AuthProvider>
                </Router>
            </SnackbarProvider>
        </ThemeProvider>
    );
}

export default App;


