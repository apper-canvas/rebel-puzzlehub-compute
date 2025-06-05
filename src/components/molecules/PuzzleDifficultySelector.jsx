import React from 'react'
import Button from '@/components/atoms/Button'

const PuzzleDifficultySelector = ({ difficulties, selectedDifficulty, onSelectDifficulty }) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Select Difficulty</h3>
      <div className="flex flex-wrap gap-3">
        {difficulties.map((diff) => (
          <Button
            key={diff.value}
            onClick={() => onSelectDifficulty(diff.value)}
            className={`${
              selectedDifficulty === diff.value
                ? `${diff.color} text-white shadow-lg`
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {diff.label}
            <span className="block text-xs opacity-75">
              {Math.floor(diff.time / 60)}min limit
            </span>
          </Button>
        ))}
      </div>
    </div>
  )
}

export default PuzzleDifficultySelector