import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { puzzleService, scoreService } from '@/services'
import MainFeatureHeader from '@/components/molecules/MainFeatureHeader'
import PuzzleDifficultySelector from '@/components/molecules/PuzzleDifficultySelector'
import PuzzleTypeSelector from '@/components/molecules/PuzzleTypeSelector'
import SudokuGrid from '@/components/molecules/SudokuGrid'
import GameModal from '@/components/organisms/GameModal'
import Spinner from '@/components/atoms/Spinner'
import Button from '@/components/atoms/Button'
import ApperIcon from '@/components/ApperIcon'
const PuzzleArena = () => {
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
            <Spinner className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
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
        <MainFeatureHeader 
          isPlaying={isPlaying} 
          timer={timer} 
          onPauseGame={pauseGame} 
          formatTime={formatTime} 
          isPaused={isPaused} 
        />

        <div className="p-6">
          {gameState === 'idle' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <PuzzleDifficultySelector
                difficulties={difficulties}
                selectedDifficulty={difficulty}
                onSelectDifficulty={setDifficulty}
              />
              <PuzzleTypeSelector
                puzzleTypes={puzzleTypes}
                onStartPuzzle={startPuzzle}
                difficulty={difficulty}
              />
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
                <Button
                  onClick={resetGame}
                  className="mt-2 sm:mt-0 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                >
                  <ApperIcon name="RotateCcw" className="w-4 h-4 inline mr-2" />
                  Reset
                </Button>
              </div>

              <SudokuGrid
                grid={sudokuGrid}
                solution={sudokuSolution}
                selectedCell={selectedCell}
                onCellClick={setSelectedCell}
                onNumberInput={handleSudokuInput}
              />
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
              <Button
                onClick={completePuzzle}
                className="bg-primary text-white px-8 py-3 rounded-xl font-semibold"
              >
                Complete Puzzle (Demo)
              </Button>
            </motion.div>
          )}
        </div>
      </motion.div>

      <GameModal
        show={showNameModal}
        timer={timer}
        playerName={playerName}
        onPlayerNameChange={(e) => setPlayerName(e.target.value)}
        onSaveScore={saveScore}
        onSkip={() => {
          setShowNameModal(false)
          resetGame()
        }}
      />
    </section>
  )
}

export default PuzzleArena