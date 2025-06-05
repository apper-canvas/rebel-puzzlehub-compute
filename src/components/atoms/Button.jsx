import React from 'react'
import { motion } from 'framer-motion'

const Button = ({ children, onClick, className = '', whileHover = { scale: 1.05 }, whileTap = { scale: 0.95 }, ...props }) => {
  return (
    <motion.button
      whileHover={whileHover}
      whileTap={whileTap}
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-semibold transition-all ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  )
}

export default Button