import React from 'react'
import { motion } from 'framer-motion'

const Card = ({ children, className = '', animation = {} }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      {...animation}
      className={`bg-white rounded-2xl p-6 shadow-card ${className}`}
    >
      {children}
    </motion.div>
  )
}

export default Card