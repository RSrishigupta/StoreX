import { Box, Typography, Button } from "@mui/material";
import Image from "next/image";
import loginImage from "../../assets/login-cover.svg"; // your login SVG

const Page = () => {
    return (
        <Box height="100vh" display="flex">
            <Box flex={1} bgcolor="#f9fafb" display="flex" justifyContent="center" alignItems="center"
            >
                <Box position="relative" width="80%" height="80%">
                    <Image src={loginImage} alt="Login" layout="fill" />
                </Box>
            </Box>
            <Box
                flex={1}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
                px={4}
            >
                <Typography variant="h3">
                    StoreX
                </Typography>
                <Typography color="textSecondary" p={2}>
                    Sign in to continue
                </Typography>

                <Button
                    variant="outlined"
                    fullWidth
                    startIcon={
                        <Box
                            component="img"
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google Icon"
                            width={24}
                            height={24}
                        />
                    }
                    sx={{
                        maxWidth: 300,
                        color: "#1f1f1f",
                        borderColor: "#e0e0e0",
                    }}
                >
                    Sign in with Google
                </Button>
            </Box>
        </Box>
    );
};

export default Page;
