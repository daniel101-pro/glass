'use client'

import GlassLoader from './components/GlassLoader/GlassLoader'

export default function Loading() {
  return (
    <div className="min-h-screen relative">
      <GlassLoader isVisible={true} message="Loading" submessage="Please wait" />
    </div>
  )
}



