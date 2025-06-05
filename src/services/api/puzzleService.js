import puzzleData from '../mockData/puzzle.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...puzzleData]

export const puzzleService = {
  async getAll() {
    await delay(300)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const puzzle = data.find(item => item.id === id)
    return puzzle ? { ...puzzle } : null
  },

  async create(puzzle) {
    await delay(400)
    const newPuzzle = {
      ...puzzle,
      id: Date.now().toString()
    }
    data.push(newPuzzle)
    return { ...newPuzzle }
  },

  async update(id, updates) {
    await delay(350)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Puzzle not found')
    }
    data[index] = { ...data[index], ...updates }
    return { ...data[index] }
  },

  async delete(id) {
    await delay(250)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Puzzle not found')
    }
    const deleted = data.splice(index, 1)[0]
    return { ...deleted }
  }
}