'use client';

import { Button } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { useMutation } from '@tanstack/react-query';
import { deleteAdmin } from '@/API/api';
import { useSession } from 'next-auth/react';

type Props = {
    id: string;
    email: string;
    onSuccess: () => void;
};

const DeleteAdminButton = ({ id, email, onSuccess }: Props) => {
    const { data: session } = useSession();
    const isSelf = email === session?.user?.email;

    const { mutate, isPending } = useMutation({
        mutationFn: deleteAdmin,
        onSuccess,
        onError: (err) => {
            console.error('Failed to delete admin:', err);
        },
    });

    const handleDelete = () => {
        if (!isSelf) {
            mutate(id);
        }
    };

    return (
        <Button
            size="small"
            onClick={handleDelete}
            disabled={isPending || isSelf}
            sx={{
                border: '1px solid rgba(211, 211, 211, 0.7)',
                borderRadius: '4px',
                opacity: isSelf ? 0.5 : 1,
                cursor: isSelf ? 'not-allowed' : 'pointer',
            }}
        >
            <DeleteOutlineOutlinedIcon sx={{ color: isSelf ? 'grey' : 'red' }} />
        </Button>
    );
};

export default DeleteAdminButton;

