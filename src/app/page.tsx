import { Box, Button } from '@mui/material';
import './globals.css';
// import {signOut } from '../auth';
import { auth } from '../auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
// import { redirect } from 'next/navigation';
export default async function Home() {
  const session = await auth();
  // if (!session) return redirect('/login');
  // const userEmail = session?.user?.email;
  // console.log("SESSION --------------------->", session);
  // console.log("token --------------------->", token);
  return (
    <Box>
      {!session && (
        <div>
          <p>NOT AUTHENTICATED. Please login.</p>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "#1976d2",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#115293",
              },
            }}
          >
            <Link href='/login'>
              Go to Login
            </Link>
          </Button>
        </div>
      )}
      {session && (redirect('/dashboard')
      )}
      
    </Box>
  );
}