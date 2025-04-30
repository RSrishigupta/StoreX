import { Box, Button, Typography } from '@mui/material';
import './globals.css';
import { auth, signOut } from '../auth';
import { redirect } from 'next/navigation';
export default async function Home() {
  const session = await auth();
  if (!session) return redirect('/login');
  const userEmail = session?.user?.email;
  console.log("SESSION --------------------->", session);
  // console.log("token --------------------->", token);
  return (
    <Box>
      <Typography variant="h5" color="initial">
        Welcome to the page, {userEmail}
        <Button
          variant="contained"
          onClick={async () => {
            "use server";
            await signOut();
          }}
          sx={{
            backgroundColor: "#d32f2f",
            color: "#fff",
            "&:hover": {
              backgroundColor: "#b71c1c",
            },
          }}
        >
          Sign Out
        </Button>
      </Typography>
    </Box>
  );
}