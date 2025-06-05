import scoreData from '../mockData/score.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...scoreData]

export const scoreService = {
  async getAll() {
    await delay(300)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const score = data.find(item => item.id === id)
    return score ? { ...score } : null
  },

  async create(score) {
    await delay(400)
    const newScore = {
      ...score,
      id: Date.now().toString()
    }
    data.push(newScore)
    return { ...newScore }
  },

  async update(id, updates) {
    await delay(350)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Score not found')
    }
    data[index] = { ...data[index], ...updates }
    return { ...data[index] }
  },

  async delete(id) {
    await delay(250)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Score not found')
    }
    const deleted = data.splice(index, 1)[0]
    return { ...deleted }
  }
}