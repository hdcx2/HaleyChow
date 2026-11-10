const API_ORIGIN = window.location.port === '5500' ? 'http://127.0.0.1:5000' : '';

export async function request(path, options={}) {
  const response = await fetch(`${API_ORIGIN}${path}`, options);
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status}).`);
  return body;
}
export async function upload(file) { const data=new FormData(); data.append('file',file); return request('/api/upload',{method:'POST',body:data}); }
export async function post(path, body) { return request(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}); }
