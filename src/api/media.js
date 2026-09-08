import client from './client'

export const uploadMedia = (file) => {
  const formData = new FormData()
  formData.append('file', file)
  return client.post('/media/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data)
}
