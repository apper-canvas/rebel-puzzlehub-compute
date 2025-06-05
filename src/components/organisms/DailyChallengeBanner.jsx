import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const DailyChallengeBanner = ({ challenge }) => {
  if (!challenge) return null

  return (
    <motion.section 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="container mx-auto px-4 py-6"
    >
      <div className="bg-gradient-to-r from-primary to-purple-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12" />
        
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h2 className="text-2xl font-bold mb-2">Daily Challenge</h2>
              <p className="text-white/90 mb-2">Today's featured puzzle awaits!</p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="flex items-center space-x-1">
                  <ApperIcon name="Users" className="w-4 h-4" />
                  <span>{challenge.participants || 0} participants</span>
                </span>
                <span className="flex items-center space-x-1">
                  <ApperIcon name="Star" className="w-4 h-4" />
                  <span>Best: {challenge.topScore || 0} pts</span>
                </span>
              </div>
            </div>
            
            <Button
              className="bg-white text-primary px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
            >
              Start Challenge
            </Button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default DailyChallengeBanner