import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { dailyChallengeService, progressService, scoreService } from '@/services'
import MainLayout from '@/components/templates/MainLayout'
import DailyChallengeBanner from '@/components/organisms/DailyChallengeBanner'
import PuzzleCategories from '@/components/organisms/PuzzleCategories'
import PuzzleArena from '@/components/organisms/PuzzleArena'
import Leaderboard from '@/components/organisms/Leaderboard'
import Spinner from '@/components/atoms/Spinner'
import ApperIcon from '@/components/ApperIcon'
import AppLogo from '@/components/molecules/AppLogo'
import InfoCard from '@/components/molecules/InfoCard'

const HomePage = () => {
  const [dailyChallenge, setDailyChallenge] = useState(null)
  const [progress, setProgress] = useState(null)
  const [topScores, setTopScores] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadHomeData = async () => {
      setLoading(true)
      try {
        const [challengeData, progressData, scoresData] = await Promise.all([
          dailyChallengeService.getAll(),
          progressService.getAll(),
          scoreService.getAll()
        ])
        
        const todayChallenge = challengeData?.[0] || null
        setDailyChallenge(todayChallenge)
        setProgress(progressData?.[0] || {})
        
        const sortedScores = scoresData?.sort((a, b) => b.points - a.points).slice(0, 5) || []
        setTopScores(sortedScores)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    loadHomeData()
  }, [])

  const puzzleTypes = [
    { name: 'Jigsaw', icon: 'Puzzle', color: 'bg-blue-500', description: 'Classic piece fitting' },
    { name: 'Logic', icon: 'Brain', color: 'bg-purple-500', description: 'Mind-bending challenges' },
    { name: 'Crossword', icon: 'Grid3X3', color: 'bg-green-500', description: 'Word puzzles' },
    { name: 'Sudoku', icon: 'Hash', color: 'bg-orange-500', description: 'Number placement' },
    { name: 'Trivia', icon: 'HelpCircle', color: 'bg-pink-500', description: 'Knowledge tests' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <ApperIcon name="AlertTriangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <p className="text-red-600">Error loading data: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <MainLayout
      header={
        <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <AppLogo />
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="hidden md:flex items-center space-x-4"
              >
                <InfoCard icon="Flame" value={progress?.currentStreak || 0} label="Streak" iconColor="text-orange-500" />
                <InfoCard icon="Trophy" value={progress?.totalCompleted || 0} label="Solved" iconColor="text-yellow-500" />
              </motion.div>
            </div>
          </div>
        </header>
      }
      footer={
        <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
          <div className="border-t border-gray-200 pt-8">
            <p>&copy; 2024 PuzzleHub. Challenge your mind, every day.</p>
          </div>
        </footer>
      }
    >
      <DailyChallengeBanner challenge={dailyChallenge} />
      <PuzzleCategories puzzleTypes={puzzleTypes} />
      <PuzzleArena />
      <Leaderboard topScores={topScores} />
    </MainLayout>
  )
}

export default HomePage