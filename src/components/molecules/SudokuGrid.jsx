import React from 'react'
import { motion } from 'framer-motion'
import Button from '@/components/atoms/Button'

const SudokuGrid = ({ grid, solution, selectedCell, onCellClick, onNumberInput }) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="grid grid-cols-9 gap-1 bg-gray-300 p-2 rounded-xl">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <motion.div
              key={`${rowIndex}-${colIndex}`}
              whileHover={{ scale: 1.1 }}
              onClick={() => onCellClick([rowIndex, colIndex])}
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

      {selectedCell && grid[selectedCell[0]][selectedCell[1]] === '' && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 grid grid-cols-5 gap-2"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              onClick={() => onNumberInput(selectedCell[0], selectedCell[1], num.toString())}
              className="aspect-square bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark"
            >
              {num}
            </Button>
          ))}
        </motion.div>
      )}
    </div>
  )
}

export default SudokuGrid