import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const AppLogo = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center space-x-3"
    >
      <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
        <ApperIcon name="Puzzle" className="w-6 h-6 text-white" />
      </div>
      <div>
        <h1 className="text-2xl font-bold gradient-text">PuzzleHub</h1>
        <p className="text-sm text-gray-600">Ultimate Puzzle Platform</p>
      </div>
    </motion.div>
  )
}

export default AppLogo