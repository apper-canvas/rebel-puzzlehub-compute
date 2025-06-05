import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const MainFeatureHeader = ({ isPlaying, timer, onPauseGame, formatTime, isPaused }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-purple-600 p-6 text-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Puzzle Arena</h2>
          <p className="text-white/90">Choose your challenge and start playing!</p>
        </div>
        
        {isPlaying && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 md:mt-0 glass-effect px-4 py-2 rounded-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Clock" className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timer)}</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onPauseGame}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              >
                <ApperIcon name={isPaused ? "Play" : "Pause"} className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MainFeatureHeader