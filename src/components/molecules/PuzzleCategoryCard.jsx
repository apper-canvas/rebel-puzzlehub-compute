import React from 'react'
import { motion } from 'framer-motion'
import IconWrapper from '@/components/atoms/IconWrapper'

const PuzzleCategoryCard = ({ type, onClick, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="group"
      onClick={onClick}
    >
      <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
        <IconWrapper icon={type.icon} color={type.color} size="w-16 h-16" className="group-hover:scale-110 transition-transform" />
        <h3 className="text-xl font-semibold text-center mb-2">{type.name}</h3>
        <p className="text-gray-600 text-center text-sm">{type.description}</p>
      </div>
    </motion.div>
  )
}

export default PuzzleCategoryCard