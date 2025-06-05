import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Badge = ({ icon, text, colorClass = 'text-gray-700' }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="hidden md:flex items-center space-x-4"
    >
      <div className="glass-effect px-4 py-2 rounded-xl">
        <div className="flex items-center space-x-2">
          <ApperIcon name={icon} className={`w-5 h-5 ${colorClass}`} />
          <span className="text-sm font-medium">{text}</span>
        </div>
      </div>
    </motion.div>
  )
}

export default Badge