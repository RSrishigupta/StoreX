'use client';
import logo from "@/assets/logo.svg"
import { ExpandMore } from '@mui/icons-material';
import { Box, Drawer, Typography, Divider, Avatar, ButtonBase} from '@mui/material';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import FolderOutlinedIcon from '@mui/icons-material/FolderOutlined';
import Image from 'next/image';
import Link from "next/link";
interface Session {
    user?: {
        name?: string;
        email?: string;
        image?: string;
    };
}

const Sidebar = ({ session }: { session: Session }) => {
    console.log(session);
    // const avatarSrc = session?.user?.image || '/avatar.png'; // Default avatar if not available
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

                <Divider />

                <Box display="flex" flexDirection="column" justifyContent="space-between" px={1} py={2}>
                    <Typography variant="caption" color="textSecondary" px={1}>Overview</Typography>

                    <Box display="flex" flexDirection="column">
                        <Link href="/dashboard">
                            <ButtonBase
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    py: 1,
                                    px: 1,
                                    borderRadius: 1,
                                    width: '100%',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <DashboardOutlinedIcon fontSize="small" />
                                <Typography variant="body2">Dashboard</Typography>
                            </ButtonBase>
                        </Link>
                    </Box>


                    <Box display="flex" flexDirection="column">
                        <Link href="/assets">
                            <ButtonBase
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    py: 1,
                                    px: 1,
                                    borderRadius: 1,
                                    width: '100%',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <FolderOutlinedIcon fontSize="small" />
                                <Typography variant="body2">Assets</Typography>
                            </ButtonBase>
                        </Link>
                    </Box>


                    <Box display="flex" flexDirection="column">
                        <Link href="/employee">
                            <ButtonBase
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: 1,
                                    py: 1,
                                    px: 1,
                                    borderRadius: 1,
                                    width: '100%',
                                    '&:hover': {
                                        backgroundColor: 'action.hover',
                                    },
                                }}
                            >
                                <PeopleAltOutlinedIcon fontSize="small" />
                                <Typography variant="body2">Employee</Typography>
                            </ButtonBase>
                        </Link>
                    </Box>

                </Box>
            </Box>
            {/* Bottom Profile Section */}
            <Box>
                <Divider />
                <Box p={1} display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                        <Avatar src={session?.user?.image} alt="xyz" sx={{ width: 32, height: 32 }} />
                        <Box>
                            <Typography variant="body2" fontWeight="bold">
                                {session?.user?.name || 'New User'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {session?.user?.email || ''}
                            </Typography>
                        </Box>
                    </Box>

                    <ExpandMore fontSize="small" />
                </Box>
            </Box>
        </Drawer>
    );
};

export default Sidebar;


