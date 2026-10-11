import { apiOrdersUrl } from '@/config'
import { apiRequest } from './request'
const action = (order, kind, data) =>
  apiRequest(`${apiOrdersUrl}/${kind}Order/${order.id}/action/`, 'POST', data)
export const cancelOrder = (order) => action(order, 'sales', { action: 'cancel' })
export const prepareOrder = (order) => action(order, 'sales', { action: 'prepare' })
export function sendOrder(order, carrier) {
  if (!carrier) throw new Error('Selecione a transportadora responsável pelo envio.')
  return action(order, 'sales', { action: 'send', carrier: Number(carrier) })
}
export const receiveOrder = (order, supplier, received = true) =>
  action(order, supplier ? 'supplier' : 'sales', { action: received ? 'receive' : 'unreceived' })
export const recordPayment = (order, paid) =>
  action(order, 'sales', { action: paid ? 'paid' : 'unpaid' })
