import progressData from '../mockData/progress.json'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

let data = [...progressData]

export const progressService = {
  async getAll() {
    await delay(300)
    return [...data]
  },

  async getById(id) {
    await delay(200)
    const progress = data.find(item => item.id === id)
    return progress ? { ...progress } : null
  },

  async create(progress) {
    await delay(400)
    const newProgress = {
      ...progress,
      id: Date.now().toString()
    }
    data.push(newProgress)
    return { ...newProgress }
  },

  async update(id, updates) {
    await delay(350)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Progress not found')
    }
    data[index] = { ...data[index], ...updates }
    return { ...data[index] }
  },

  async delete(id) {
    await delay(250)
    const index = data.findIndex(item => item.id === id)
    if (index === -1) {
      throw new Error('Progress not found')
    }
    const deleted = data.splice(index, 1)[0]
    return { ...deleted }
  }
}