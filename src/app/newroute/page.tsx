import { auth } from '@/auth'
import React from 'react'

const page = async () => {
  const session = await auth()
  if (!session) return <div>Not authenticated</div>
  return (
    <div>
      new route only  accesbile in the middleware
    </div>
  )
}

export default page
