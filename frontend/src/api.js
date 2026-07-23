const API_BASE = 'http://localhost:4000/api';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    data = null;
  }

  if (!res.ok) {
    const error = new Error((data && data.error) || `Request failed with status ${res.status}`);
    error.status = res.status;
    error.data = data;
    throw error;
  }

  return data;
}

export const api = {
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password }, auth: false }),
  register: (payload) => request('/auth/register', { method: 'POST', body: payload, auth: false }),
  me: () => request('/auth/me'),
  getAccounts: () => request('/accounts'),
  getAccount: (id) => request(`/accounts/${id}`),
  getTransactions: (accountId, params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
    ).toString();
    return request(`/accounts/${accountId}/transactions${query ? `?${query}` : ''}`);
  },
  transfer: (payload) => request('/transfers', { method: 'POST', body: payload }),
  getPayees: () => request('/payees'),
  addPayee: (payload) => request('/payees', { method: 'POST', body: payload }),
  deletePayee: (id) => request(`/payees/${id}`, { method: 'DELETE' }),
  payBill: (payeeId, payload) => request(`/payees/${payeeId}/pay`, { method: 'POST', body: payload })
};
