import { Box, Typography } from "@mui/material";
import Image from "next/image";
import loginImage from "../../images/login-cover.svg";
import { signIn } from "../../auth"
import { Button } from "@mui/material";
import GoogleIcon from '@mui/icons-material/Google';


const Page = async () => {

    return (
        <Box height="100vh" display="flex">
            <Box flex={1} bgcolor="#f9fafb" display="flex" justifyContent="center" alignItems="center">
                <Box position="relative" width="80%" height="80%">
                    <Image src={loginImage} alt="Login" layout="fill" />
                </Box>
            </Box>
            <Box flex={1} display="flex" flexDirection="column" justifyContent="center" alignItems="center" px={4}>
                <Typography variant="h3">StoreX</Typography>
                <Typography color="textSecondary" p={2}>Sign in to continue</Typography>
               
               
                <form action={async () => {
                    "use server";
                    await signIn("google"
                        , { redirectTo: "/dashboard" }
                    );
                }}>
                    
                    <Button type="submit" variant="contained" startIcon={<GoogleIcon />}
                        sx={{
                            backgroundColor: "#4285F4",
                            color: "#fff",
                            "&:hover": {
                                backgroundColor: "#357ae8",
                            },
                        }}
                    >
                        Sign in with Google
                    </Button>

                </form>


            </Box>
        </Box >
    );
};

export default Page;
