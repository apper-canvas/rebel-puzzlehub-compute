import { useState, useEffect } from 'react'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'
import { motion } from 'framer-motion'
import { dailyChallengeService, progressService, scoreService } from '../services'

function Home() {
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
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full"
        />
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
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-white/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center">
                <ApperIcon name="Puzzle" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">PuzzleHub</h1>
                <p className="text-sm text-gray-600">Ultimate Puzzle Platform</p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center space-x-4"
            >
              <div className="glass-effect px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Flame" className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-medium">Streak: {progress?.currentStreak || 0}</span>
                </div>
              </div>
              <div className="glass-effect px-4 py-2 rounded-xl">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Trophy" className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium">Solved: {progress?.totalCompleted || 0}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Daily Challenge Banner */}
      {dailyChallenge && (
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
                      <span>{dailyChallenge.participants || 0} participants</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <ApperIcon name="Star" className="w-4 h-4" />
                      <span>Best: {dailyChallenge.topScore || 0} pts</span>
                    </span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white text-primary px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-shadow"
                >
                  Start Challenge
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Puzzle Categories */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-bold text-center mb-8">Choose Your Puzzle</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
            {puzzleTypes.map((type, index) => (
              <motion.div
                key={type.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="group"
              >
                <div className="bg-white rounded-2xl p-6 shadow-card hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100">
                  <div className={`w-16 h-16 ${type.color} rounded-2xl flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform`}>
                    <ApperIcon name={type.icon} className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-center mb-2">{type.name}</h3>
                  <p className="text-gray-600 text-center text-sm">{type.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Main Feature */}
      <MainFeature />

      {/* Leaderboard */}
      <section className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-card"
        >
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <ApperIcon name="Trophy" className="w-6 h-6 text-yellow-500 mr-2" />
            Today's Top Players
          </h2>
          
          {topScores.length > 0 ? (
            <div className="space-y-3">
              {topScores.map((score, index) => (
                <motion.div
                  key={score.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-600' : 'bg-gray-300'
                    }`}>
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
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <ApperIcon name="Users" className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No scores yet today. Be the first to play!</p>
            </div>
          )}
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center text-gray-600">
        <div className="border-t border-gray-200 pt-8">
          <p>&copy; 2024 PuzzleHub. Challenge your mind, every day.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home