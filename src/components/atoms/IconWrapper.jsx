import React from 'react'
import ApperIcon from '@/components/ApperIcon'
import { motion } from 'framer-motion'

const IconWrapper = ({ icon, color, size = 'w-8 h-8', className = '', animate = true }) => {
  const wrapperClass = `rounded-2xl flex items-center justify-center mb-4 mx-auto ${color} ${size}`
  const iconClass = `text-white ${size === 'w-8 h-8' ? 'w-8 h-8' : size === 'w-6 h-6' ? 'w-6 h-6' : 'w-12 h-12'}`

  const motionProps = animate ? {
    whileHover: { scale: 1.1 },
    transition: { type: "spring", stiffness: 400, damping: 10 }
  } : {}

  return (
    <motion.div 
      className={`${wrapperClass} ${className}`} 
      {...motionProps}
    >
      <ApperIcon name={icon} className={iconClass} />
    </motion.div>
  )
}

export default IconWrapper