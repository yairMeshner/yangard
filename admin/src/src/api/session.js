export function getSession() {
  return localStorage.getItem('uuid')
}

export function setSession(uuid, name) {
  localStorage.setItem('uuid', uuid)
  localStorage.setItem('name', name)
}

export function getName() {
  return localStorage.getItem('name')
}

export function clearSession() {
  localStorage.removeItem('uuid')
  localStorage.removeItem('name')
}
