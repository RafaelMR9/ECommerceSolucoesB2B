export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validateCpf = (cpf) => {
  const re = /^\d{3}\.\d{3}\.\d{3}\-\d{2}$/
  return re.test(cpf)
}

export const validateCnpj = (cnpj) => {
  const re = /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/
  return re.test(cnpj)
}

export const validatePassword = (password) => password.length >= 8 && /\p{L}/u.test(password)
