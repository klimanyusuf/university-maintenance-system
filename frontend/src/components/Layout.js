import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
    AppBar, Toolbar, Typography, IconButton, Drawer, Box, List,
    ListItem, ListItemIcon, ListItemText, Divider, Avatar, Menu,
    MenuItem, Badge
} from '@mui/material';
import {
    Menu as MenuIcon, Dashboard, Assignment, AddCircle,
    Notifications, AdminPanelSettings, Assessment, Logout,
    Person
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';

const drawerWidth = 240;

export default function Layout() {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications ? useNotifications() : { unreadCount: 0 };

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
    const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        handleMenuClose();
    };

    const getNavigationItems = () => {
        const items = [
            { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
            { text: (user?.role_name === 'admin' || user?.role_name === 'officer' ? 'Requests' : 'My Requests'), icon: <Assignment />, path: '/requests' },
            { text: 'New Request', icon: <AddCircle />, path: '/requests/new' },
        ];
        if (user?.role?.name === 'officer') {
            items.push({ text: 'Assignments', icon: <Assignment />, path: '/assignments' });
        }
        if (user?.role?.name === 'admin') {
            items.push({ text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/admin' });
            items.push({ text: 'Reports', icon: <Assessment />, path: '/reports' });
        }
        return items;
    };

    const drawer = (
        <Box>
            <Toolbar><Typography variant="h6">Maintenance System</Typography></Toolbar>
            <Divider />
            <List>
                {getNavigationItems().map(item => (
                    <ListItem button key={item.text} onClick={() => { navigate(item.path); setMobileOpen(false); }}>
                        <ListItemIcon>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: 1201 }}>
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>University Maintenance System</Typography>
                    <IconButton color="inherit" onClick={() => navigate('/notifications')}>
                        <Badge badgeContent={unreadCount || 0} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                        <Avatar sx={{ width: 32, height: 32 }}>
                            {user?.first_name?.charAt(0) || user?.username?.charAt(0) || 'U'}
                        </Avatar>
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleLogout}>
                            <ListItemIcon><Logout fontSize="small" /></ListItemIcon>
                            <ListItemText>Logout</ListItemText>
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>
            <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
                <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ display: { xs: 'block', sm: 'none' } }}>
                    {drawer}
                </Drawer>
                <Drawer variant="permanent" sx={{ display: { xs: 'none', sm: 'block' } }} open>
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3, pt: 8 }}>
                <Outlet />
            </Box>
        </Box>
    );
}



