import client from './client'

export const getAccounts = () =>
  client.get('/social-accounts').then(r => r.data)

export const getAccount = (platform) =>
  client.get(`/social-accounts/${platform}`).then(r => r.data)

export const getConnectUrl = (platform) =>
  client.get(`/social-accounts/${platform}/connect-url`).then(r => r.data)

export const connectAccount = (platform, data) =>
  client.post(`/social-accounts/${platform}/connect`, data).then(r => r.data)

export const disconnectAccount = (platform) =>
  client.delete(`/social-accounts/${platform}`)

export const exchangeOAuthCode = (platform, code, state) =>
  client.post(`/social-accounts/${platform}/exchange`, null, { params: { code, state } }).then(r => r.data)

export const syncAccounts = () =>
  client.post('/social-accounts/sync').then(r => r.data)

