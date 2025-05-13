'use client';
import Sidebar from '@/Component/Sidebar/Sidebar';
import { useSession } from 'next-auth/react';

const UserAvatar = () => {
  const { data: session } = useSession();

  return  (
    <div>
        {session?.user?.name || 'Guest'}
        <Sidebar/>
    </div>
  ) 
};

export default UserAvatar;