import React from 'react'
import { motion } from 'framer-motion'
import PuzzleCategoryCard from '@/components/molecules/PuzzleCategoryCard'

const PuzzleCategories = ({ puzzleTypes }) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-3xl font-bold text-center mb-8">Choose Your Puzzle</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {puzzleTypes.map((type, index) => (
            <PuzzleCategoryCard key={type.name} type={type} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  )
}

export default PuzzleCategories