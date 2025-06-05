import dailyChallengeData from '../mockData/dailyChallenge.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...dailyChallengeData]

export const dailyChallengeService = {
  async getAll() {
    await delay(300)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const challenge = data.find(item => item.id === id)
    return challenge ? { ...challenge } : null
  },

  async create(challenge) {
    await delay(400)
    const newChallenge = {
      ...challenge,
      id: Date.now().toString()
    }
    data.push(newChallenge)
    return { ...newChallenge }
  },

  async update(id, updates) {
    await delay(350)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Daily challenge not found')
    }
    data[index] = { ...data[index], ...updates }
    return { ...data[index] }
  },

  async delete(id) {
    await delay(250)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Daily challenge not found')
    }
    const deleted = data.splice(index, 1)[0]
    return { ...deleted }
  }
}