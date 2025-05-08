import { auth, signOut } from '@/auth';
import { Button } from '@mui/material';
import React from 'react'

const page = async () => {
    const session = await auth()
    if (!session) return <div>Not authenticated</div>
    return (
        <>
            <div>
                this is the dashboarpage and is protected route
            </div>
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
        </>

    )
}

export default page
