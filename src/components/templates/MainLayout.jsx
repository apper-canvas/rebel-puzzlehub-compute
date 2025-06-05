import React from 'react'

const MainLayout = ({ header, children, footer }) => {
  return (
    <div className="min-h-screen">
      {header}
      <main>
        {children}
      </main>
      {footer}
    </div>
  )
}

export default MainLayout