import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'
import { puzzleService, scoreService } from '../services'

function MainFeature() {
  const [puzzles, setPuzzles] = useState([])
  const [selectedPuzzle, setSelectedPuzzle] = useState(null)
  const [difficulty, setDifficulty] = useState('easy')
  const [isPlaying, setIsPlaying] = useState(false)
  const [timer, setTimer] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [gameState, setGameState] = useState('idle') // idle, playing, completed
  const [playerName, setPlayerName] = useState('')
  const [showNameModal, setShowNameModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Sudoku game state
  const [sudokuGrid, setSudokuGrid] = useState(Array(9).fill(null).map(() => Array(9).fill('')))
  const [sudokuSolution, setSudokuSolution] = useState([])
  const [selectedCell, setSelectedCell] = useState(null)

  useEffect(() => {
    const loadPuzzles = async () => {
      setLoading(true)
      try {
        const data = await puzzleService.getAll()
        setPuzzles(data || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    
    loadPuzzles()
  }, [])

  // Timer effect
  useEffect(() => {
    let interval = null
    if (isPlaying && !isPaused && gameState === 'playing') {
      interval = setInterval(() => {
        setTimer(time => time + 1)
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isPlaying, isPaused, gameState])

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'bg-green-500', time: 300 },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', time: 600 },
    { value: 'hard', label: 'Hard', color: 'bg-red-500', time: 900 }
  ]

  const puzzleTypes = [
    { type: 'sudoku', name: 'Sudoku', icon: 'Hash', color: 'bg-orange-500' },
    { type: 'jigsaw', name: 'Jigsaw', icon: 'Puzzle', color: 'bg-blue-500' },
    { type: 'logic', name: 'Logic', icon: 'Brain', color: 'bg-purple-500' },
    { type: 'crossword', name: 'Crossword', icon: 'Grid3X3', color: 'bg-green-500' },
    { type: 'trivia', name: 'Trivia', icon: 'HelpCircle', color: 'bg-pink-500' }
  ]

  const generateSudoku = (difficulty) => {
    // Simple Sudoku generator - creates a basic puzzle
    const solution = [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ]

    const cluesCount = difficulty === 'easy' ? 45 : difficulty === 'medium' ? 35 : 25
    const puzzle = solution.map(row => [...row])
    
    // Remove numbers to create puzzle
    let cellsToRemove = 81 - cluesCount
    while (cellsToRemove > 0) {
      const row = Math.floor(Math.random() * 9)
      const col = Math.floor(Math.random() * 9)
      if (puzzle[row][col] !== '') {
        puzzle[row][col] = ''
        cellsToRemove--
      }
    }

    return { puzzle, solution }
  }

  const startPuzzle = (type) => {
    const puzzle = puzzles.find(p => p.type === type && p.difficulty === difficulty)
    if (!puzzle) {
      toast.error("Puzzle not available for this difficulty")
      return
    }

    setSelectedPuzzle(puzzle)
    setGameState('playing')
    setIsPlaying(true)
    setTimer(0)
    setIsPaused(false)

    if (type === 'sudoku') {
      const { puzzle: sudokuPuzzle, solution } = generateSudoku(difficulty)
      setSudokuGrid(sudokuPuzzle)
      setSudokuSolution(solution)
      setSelectedCell(null)
    }

    toast.success(`Starting ${type} puzzle on ${difficulty} difficulty!`)
  }

  const pauseGame = () => {
    setIsPaused(!isPaused)
    toast.info(isPaused ? "Game resumed" : "Game paused")
  }

  const completePuzzle = () => {
    setGameState('completed')
    setIsPlaying(false)
    setShowNameModal(true)
    
    // Calculate score based on time and difficulty
    const baseScore = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300
    const timeBonus = Math.max(0, (600 - timer) * 2)
    const finalScore = baseScore + timeBonus

    toast.success(`Puzzle completed! Score: ${finalScore} points`)
  }

  const saveScore = async () => {
    if (!playerName.trim()) {
      toast.error("Please enter your name")
      return
    }

    try {
      const baseScore = difficulty === 'easy' ? 100 : difficulty === 'medium' ? 200 : 300
      const timeBonus = Math.max(0, (600 - timer) * 2)
      const finalScore = baseScore + timeBonus

      const scoreData = {
        puzzleId: selectedPuzzle.id,
        playerName: playerName.trim(),
        time: timer,
        points: finalScore,
        date: new Date().toISOString().split('T')[0]
      }

      await scoreService.create(scoreData)
      toast.success("Score saved successfully!")
      
      setShowNameModal(false)
      setPlayerName('')
      resetGame()
    } catch (err) {
      toast.error("Failed to save score")
    }
  }

  const resetGame = () => {
    setSelectedPuzzle(null)
    setGameState('idle')
    setIsPlaying(false)
    setTimer(0)
    setIsPaused(false)
    setSudokuGrid(Array(9).fill(null).map(() => Array(9).fill('')))
    setSudokuSolution([])
    setSelectedCell(null)
  }

  const handleSudokuInput = (row, col, value) => {
    if (sudokuSolution[row] && sudokuSolution[row][col] && sudokuGrid[row][col] === '') {
      const newGrid = [...sudokuGrid]
      newGrid[row][col] = value
      setSudokuGrid(newGrid)

      // Check if puzzle is completed
      const isComplete = newGrid.every((row, i) => 
        row.every((cell, j) => cell === sudokuSolution[i][j].toString())
      )

      if (isComplete) {
        completePuzzle()
      }
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
            />
            <p>Loading puzzles...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-card">
          <div className="text-center">
            <ApperIcon name="AlertTriangle" className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600">Error loading puzzles: {error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <section className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-card overflow-hidden"
      >
        {/* Game Header */}
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
                    onClick={pauseGame}
                    className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                  >
                    <ApperIcon name={isPaused ? "Play" : "Pause"} className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="p-6">
          {gameState === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Difficulty Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Select Difficulty</h3>
                <div className="flex flex-wrap gap-3">
                  {difficulties.map((diff) => (
                    <motion.button
                      key={diff.value}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setDifficulty(diff.value)}
                      className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                        difficulty === diff.value
                          ? `${diff.color} text-white shadow-lg`
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {diff.label}
                      <span className="block text-xs opacity-75">
                        {Math.floor(diff.time / 60)}min limit
                      </span>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Puzzle Type Selection */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Choose Puzzle Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {puzzleTypes.map((type, index) => (
                    <motion.button
                      key={type.type}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      onClick={() => startPuzzle(type.type)}
                      className="p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all group"
                    >
                      <div className={`w-12 h-12 ${type.color} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform`}>
                        <ApperIcon name={type.icon} className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold">{type.name}</h4>
                      <p className="text-sm text-gray-600 mt-1">
                        Start {difficulty} puzzle
                      </p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && selectedPuzzle?.type === 'sudoku' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-xl font-semibold">Sudoku - {difficulty}</h3>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={resetGame}
                  className="mt-2 sm:mt-0 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4 inline mr-2" />
                  Reset
                </motion.button>
              </div>

              {/* Sudoku Grid */}
              <div className="max-w-md mx-auto">
                <div className="grid grid-cols-9 gap-1 bg-gray-300 p-2 rounded-xl">
                  {sudokuGrid.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <motion.div
                        key={`${rowIndex}-${colIndex}`}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedCell([rowIndex, colIndex])}
                        className={`
                          aspect-square bg-white rounded flex items-center justify-center text-lg font-semibold cursor-pointer
                          ${selectedCell?.[0] === rowIndex && selectedCell?.[1] === colIndex ? 'ring-2 ring-primary' : ''}
                          ${cell ? 'text-gray-800' : 'text-gray-400'}
                          ${(Math.floor(rowIndex / 3) + Math.floor(colIndex / 3)) % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                        `}
                      >
                        {cell || ''}
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Number Input */}
                {selectedCell && sudokuGrid[selectedCell[0]][selectedCell[1]] === '' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 grid grid-cols-5 gap-2"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                      <motion.button
                        key={num}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleSudokuInput(selectedCell[0], selectedCell[1], num.toString())}
                        className="aspect-square bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                      >
                        {num}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}

          {gameState === 'playing' && selectedPuzzle?.type !== 'sudoku' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ApperIcon name="Puzzle" className="w-12 h-12 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-4">
                {selectedPuzzle?.type?.charAt(0).toUpperCase() + selectedPuzzle?.type?.slice(1)} Puzzle
              </h3>
              <p className="text-gray-600 mb-6">
                This puzzle type is coming soon! For now, enjoy our Sudoku implementation.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={completePuzzle}
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold"
              >
                Complete Puzzle (Demo)
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Name Input Modal */}
      <AnimatePresence>
        {showNameModal && (
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
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    placeholder="Your name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    onKeyPress={(e) => e.key === 'Enter' && saveScore()}
                  />
                </div>

                <div className="flex space-x-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      setShowNameModal(false)
                      resetGame()
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Skip
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={saveScore}
                    className="flex-1 px-4 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                  >
                    Save Score
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default MainFeature