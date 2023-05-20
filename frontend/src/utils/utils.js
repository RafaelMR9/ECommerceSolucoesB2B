export const validateEmail = (email) => {
  const re = /^[\w-\.]+@([\w-]+\.)+com(\.br)?$/
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

export const validatePassword = (password) => {
  const re = /^\d+$/
  return password.length >= 8 && !re.test(password)
}

export const validateConfirmPassword = (password1, password2) => {
  return password1 === password2
}