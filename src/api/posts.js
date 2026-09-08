import client from './client'

export const getPosts = (status) =>
  client.get('/posts', { params: status ? { status } : {} }).then(r => r.data)

export const getPost = (id) =>
  client.get(`/posts/${id}`).then(r => r.data)

export const createPost = (data) =>
  client.post('/posts', data).then(r => r.data)

export const updatePost = (id, data) =>
  client.put(`/posts/${id}`, data).then(r => r.data)

export const deletePost = (id) =>
  client.delete(`/posts/${id}`)

export const publishPost = (id) =>
  client.post(`/posts/${id}/publish`).then(r => r.data)
