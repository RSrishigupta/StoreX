'use client';

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
} from '@mui/material';
import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { addAdmin } from '@/API/api';

type Props = {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
};

const AddAdminModal = ({ open, onClose, onSuccess }: Props) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const { mutate, isPending } = useMutation({
        mutationFn: addAdmin,
        onSuccess: () => {
            setEmail('');
            setError('');
            onClose();
            onSuccess();
        },
        onError: (err: { response?: { status: number } }) => {
            if (err.response?.status === 409) {
                setError('An authorized user with this email already exists. Try a different email.');
            } else {
                setError('Failed to add admin. Please try again.');
            }
        },
    });

    const handleAdd = () => {
        if (!email.endsWith('@remotestate.com')) {
            setError('Only @remotestate.com emails are allowed.');
            return;
        }

        setError('');
        mutate(email);
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md"
            PaperProps={{
                sx: { width: '40vw', position: 'relative' },
            }}
        >
            <DialogTitle sx={{ fontWeight: 700, pr: 5 }}>
                Add New Authorized User
                <Button
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        minWidth: 'unset',
                        padding: 0,
                        color: 'grey.500',
                    }}
                >
                    ×
                </Button>
            </DialogTitle>

            <DialogContent>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Email Address"
                    type="email"
                    fullWidth
                    variant="outlined"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!error}
                    helperText={error || ''}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} color="inherit" disabled={isPending}>
                    Cancel
                </Button>
                <Button
                    onClick={handleAdd}
                    variant="contained"
                    sx={{ backgroundColor: '#0f172a', color: 'white' }}
                    disabled={isPending}
                >
                    {isPending ? 'Saving...' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddAdminModal;
