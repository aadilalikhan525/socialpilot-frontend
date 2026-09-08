import client from './client'

export const generateContent = (data) =>
  client.post('/ai/generate', data).then(r => r.data)
