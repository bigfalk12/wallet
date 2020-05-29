import Vue from 'vue'
import { random } from 'lodash-es'
import axios from 'axios'

export const TIMEOUTS = []

export const INTERVALS = []

export const CHAIN_LOCK = {}

export const emitter = new Vue()

export const waitForRandom = (min, max) => new Promise(resolve => setTimeout(() => resolve(), random(min, max)))

export const timestamp = () => Math.ceil(Date.now() / 1000)

export const getChainFromAsset = asset => {
  if (['dai', 'usdc'].includes(asset)) return 'eth'

  return asset
}

export const attemptToLockAsset = (network, walletId, asset) => {
  const chain = getChainFromAsset(asset)
  const key = [network, walletId, chain].join('-')

  if (CHAIN_LOCK[key]) return key

  CHAIN_LOCK[key] = true

  return true
}

export const unlockAsset = (network, walletId, asset) => {
  const chain = getChainFromAsset(asset)
  const key = [network, walletId, chain].join('-')

  CHAIN_LOCK[key] = false

  emitter.$emit(`unlock:${key}`)
}

export const newOrder = (agent, data) => {
  return axios({
    url: agent + '/api/swap/order',
    method: 'post',
    data,
    headers: {
      'x-requested-with': 'wallet',
      'x-liquality-user-agent': 'wallet'
    }
  }).then(res => res.data)
}

export const updateOrder = (agent, id, data) => {
  return axios({
    url: agent + '/api/swap/order/' + id,
    method: 'post',
    data,
    headers: {
      'x-requested-with': 'wallet',
      'x-liquality-user-agent': 'wallet'
    }
  }).then(res => res.data)
}

export const getMarketData = agent => {
  return axios({
    url: agent + '/api/swap/marketinfo',
    method: 'get',
    headers: {
      'x-requested-with': 'wallet',
      'x-liquality-user-agent': 'wallet'
    }
  }).then(res => res.data)
}