// components/Sidebar/SidebarWrapper.tsx
import { auth } from '@/auth'; // Your custom auth logic
import Sidebar from './Sidebar';

const SidebarWrapper = async () => {
  const session = await auth(); // Fetch session

  if (!session || !session.user) {
    return null;
  }

  return <Sidebar session={session} />
};

export default SidebarWrapper;
