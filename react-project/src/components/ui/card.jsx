import React from 'react'

export const Card = ({ children, className = '' }) => {
  return <div className={`bg-white shadow-md rounded-lg border p-6 ${className}`}>{children}</div>
}

export const CardHeader = ({ children }) => {
  return <div className='mb-4 border-b pb-2'>{children}</div>
}

export const CardTitle = ({ children }) => {
  return <h2 className='text-xl font-bold'>{children}</h2>
}

export const CardContent = ({ children }) => {
  return <div>{children}</div>
}
