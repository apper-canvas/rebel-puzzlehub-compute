import React from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Card from '@/components/atoms/Card'
import LeaderboardEntry from '@/components/molecules/LeaderboardEntry'

const Leaderboard = ({ topScores }) => {
  return (
    <section className="container mx-auto px-4 py-8">
      <Card animation={{ transition: { delay: 0.4 } }} className="shadow-card">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <ApperIcon name="Trophy" className="w-6 h-6 text-yellow-500 mr-2" />
          Today's Top Players
        </h2>
        
        {topScores.length > 0 ? (
          <div className="space-y-3">
            {topScores.map((score, index) => (
              <LeaderboardEntry key={score.id} score={score} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <ApperIcon name="Users" className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No scores yet today. Be the first to play!</p>
          </div>
        )}
      </Card>
    </section>
  )
}

export default Leaderboard