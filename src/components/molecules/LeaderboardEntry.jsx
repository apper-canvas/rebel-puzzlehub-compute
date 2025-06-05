import React from 'react'
import { motion } from 'framer-motion'

const LeaderboardEntry = ({ score, index }) => {
  const getRankColor = (idx) => {
    switch (idx) {
      case 0: return 'bg-yellow-500'
      case 1: return 'bg-gray-400'
      case 2: return 'bg-orange-600'
      default: return 'bg-gray-300'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 * index }}
      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center space-x-4">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${getRankColor(index)}`}>
          {index + 1}
        </div>
        <div>
          <p className="font-semibold">{score.playerName}</p>
          <p className="text-sm text-gray-600">{score.time}s</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-primary">{score.points} pts</p>
      </div>
    </motion.div>
  )
}

export default LeaderboardEntry