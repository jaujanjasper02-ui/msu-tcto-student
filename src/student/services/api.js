const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

export async function createRequest(payload){
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(payload)
  })
  if(!res.ok) throw new Error('API error')
  return res.json()
}
