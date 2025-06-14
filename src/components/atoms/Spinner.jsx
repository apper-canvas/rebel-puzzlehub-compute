import React from 'react'
import { motion } from 'framer-motion'

const Spinner = ({ className = 'w-12 h-12 border-4 border-primary border-t-transparent rounded-full' }) => {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={className}
    />
  )
}

export default Spinner