import { apiUserUrl } from '../config'

const getUserInfo = async () => {
  const token = localStorage.getItem('token')
  const response = await fetch(`${apiUserUrl}/info/`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.detail);
  }
  return data
}

export default { getUserInfo }