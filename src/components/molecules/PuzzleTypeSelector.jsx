import React from 'react'
import { motion } from 'framer-motion'
import IconWrapper from '@/components/atoms/IconWrapper'
import Button from '@/components/atoms/Button'

const PuzzleTypeSelector = ({ puzzleTypes, onStartPuzzle, difficulty }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Choose Puzzle Type</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {puzzleTypes.map((type, index) => (
          <motion.div
            key={type.type}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -5, scale: 1.02 }}
            onClick={() => onStartPuzzle(type.type)}
            className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group cursor-pointer"
          >
            <IconWrapper icon={type.icon} color={type.color} size="w-12 h-12" className="group-hover:scale-110 transition-transform" />
            <h4 className="font-semibold">{type.name}</h4>
            <p className="text-sm text-gray-600 mt-1">
              Start {difficulty} puzzle
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default PuzzleTypeSelector