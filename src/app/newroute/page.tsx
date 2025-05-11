import { auth } from '@/auth'
import SidebarWrapper from '@/Component/Sidebar/SidebarWrapper'
import React from 'react'
const page = async () => {
  const session = await auth()
  if (!session) return <div>Not authenticated</div>
  // console.log(session);
  return (
    <div>
      <SidebarWrapper />
      new route only  accesbile in the middleware
    </div>
  )
}
export default page
