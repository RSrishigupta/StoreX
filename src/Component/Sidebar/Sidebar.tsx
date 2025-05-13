'use client';
import { useState } from 'react';
import logo from "@/images/logo.svg";
import { ExpandMore } from '@mui/icons-material';
import {
    Box, Drawer, Typography, Divider, Avatar, ButtonBase, Menu,
    MenuItem,
} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import Image from 'next/image';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const Sidebar = () => {
    const { data: session } = useSession();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            sx={{
                width: 240,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: 240,
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                },
            }}
        >
            {/* Top Section */}
            <Box>
                <Box display="flex" alignItems="center" gap={1} p={1}>
                    <Image src={logo} alt="StoreX Logo" width={30} height={30} />
                    <Box>
                        <Typography variant="body2" fontWeight="bold">StoreX</Typography>
                        <Typography variant="caption" color="textSecondary">
                            A Remotestate Product
                        </Typography>
                    </Box>
                </Box>

                <Box display="flex" flexDirection="column" justifyContent="space-between" px={1} py={2}>
                    <Typography variant="caption" color="textSecondary" px={1}>Overview</Typography>

                    <Link href="/dashboard"  >
                        <ButtonBase
                            sx={{
                                justifyContent: 'flex-start',
                                width: '100%',
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                gap: 1,
                                '&:hover': { backgroundColor: '#f3f4f6' },
                            }}
                        >
                            <DashboardOutlinedIcon sx={{ fontSize: 20 }} />
                            <Typography variant="body2">Dashboard</Typography>
                        </ButtonBase>
                    </Link>

                    <Link href="/dashboard/assets" >
                        <ButtonBase
                            sx={{
                                justifyContent: 'flex-start',
                                width: '100%',
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                gap: 1,
                                '&:hover': { backgroundColor: '#f3f4f6' },
                            }}
                        >
                            <FolderOutlinedIcon sx={{ fontSize: 20 }} />
                            <Typography variant="body2">Assets</Typography>
                        </ButtonBase>
                    </Link>

                    <Link href="/dashboard/employee">
                        <ButtonBase
                            sx={{
                                justifyContent: 'flex-start',
                                width: '100%',
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                gap: 1,
                                '&:hover': { backgroundColor: '#f3f4f6' },
                            }}
                        >
                            <PeopleAltOutlinedIcon sx={{ fontSize: 20 }} />
                            <Typography variant="body2">Employees</Typography>
                        </ButtonBase>
                    </Link>

                    <Link href="/dashboard/setting/authorized" >
                        <ButtonBase
                            sx={{
                                justifyContent: 'flex-start',
                                width: '100%',
                                px: 2,
                                py: 1,
                                borderRadius: 2,
                                gap: 1,
                                '&:hover': { backgroundColor: '#f3f4f6' },
                            }}
                        >
                            <SettingsOutlinedIcon sx={{ fontSize: 20 }} />
                            <Typography variant="body2">Settings</Typography>
                        </ButtonBase>
                    </Link>
                </Box>
            </Box>

            {/* Bottom Profile Section */}
            <Box>
                <Divider />
                <Box p={1} display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar src={session?.user?.image || ''} alt="User" sx={{ width: 32, height: 32 }} />
                        <Box>
                            <Typography variant="body2" fontWeight="bold">
                                {session?.user?.name || 'New User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {session?.user?.email || ''}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ cursor: 'pointer' }} onClick={handleMenuOpen}>
                        <ExpandMore fontSize="small" />
                    </Box>
                </Box>

                {/* Popup Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    sx={{ mt: 1 }}
                    slotProps={{
                        paper: {
                            elevation: 5,
                            sx: {
                                borderRadius: 2,
                                width: 250,
                                p: 0.5,
                            },
                        },
                    }}
                >
                    {/* User Info */}
                    <Box px={2} py={1} display="flex" alignItems="center" gap={1.5}>
                        <Avatar src={session?.user?.image || ''} sx={{ width: 40, height: 40 }} />
                        <Box>
                            <Typography fontWeight={600} fontSize="0.9rem">
                                {session?.user?.name || 'New User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {session?.user?.email || ''}
                            </Typography>
                        </Box>
                    </Box>

                    <Divider sx={{ my: 0.5 }} />

                    {/* Log Out */}
                    <MenuItem
                        onClick={() => {
                            signOut();
                            handleMenuClose();
                        }}
                        sx={{
                            gap: 1,
                            fontSize: '0.85rem',
                            px: 2,
                            py: 1.2,
                        }}
                    >
                        <LogoutOutlinedIcon fontSize="small" />
                        Log out
                    </MenuItem>
                </Menu>
            </Box>
        </Drawer>
    );
};

export default Sidebar;
