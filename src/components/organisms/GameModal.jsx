import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const GameModal = ({ show, timer, playerName, onPlayerNameChange, onSaveScore, onSkip }) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ApperIcon name="Trophy" className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Puzzle Completed!</h3>
              <p className="text-gray-600">Time: {formatTime(timer)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your name for the leaderboard:
                </label>
                <Input
                  type="text"
                  value={playerName}
                  onChange={onPlayerNameChange}
                  placeholder="Your name"
                  onKeyPress={(e) => e.key === 'Enter' && onSaveScore()}
                />
              </div>

              <div className="flex space-x-3">
                <Button
                  onClick={onSkip}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
                >
                  Skip
                </Button>
                <Button
                  onClick={onSaveScore}
                  className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark"
                >
                  Save Score
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default GameModal