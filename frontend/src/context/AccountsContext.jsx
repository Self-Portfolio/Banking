import { createContext, useCallback, useContext, useState } from 'react';
import { api } from '../api';

const AccountsContext = createContext(null);

export function AccountsProvider({ children }) {
  const [accounts, setAccounts] = useState(null);
  const [loading, setLoading] = useState(false);

  // NOTE: intentionally only fetches when we don't already have a cached
  // copy. Screens that mutate balances (Transfer, Bill Pay) update their own
  // local state for the confirmation screen but do not call refresh() here,
  // so the Dashboard can show a stale balance until the user manually
  // refreshes. This mirrors a common real-world caching bug.
  const ensureLoaded = useCallback(async () => {
    if (accounts !== null) return accounts;
    setLoading(true);
    try {
      const data = await api.getAccounts();
      setAccounts(data.accounts);
      return data.accounts;
    } finally {
      setLoading(false);
    }
  }, [accounts]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAccounts();
      setAccounts(data.accounts);
      return data.accounts;
    } finally {
      setLoading(false);
    }
  }, []);

  const clear = useCallback(() => setAccounts(null), []);

  return (
    <AccountsContext.Provider value={{ accounts, loading, ensureLoaded, refresh, clear }}>
      {children}
    </AccountsContext.Provider>
  );
}

export function useAccounts() {
  const ctx = useContext(AccountsContext);
  if (!ctx) throw new Error('useAccounts must be used within AccountsProvider');
  return ctx;
}
