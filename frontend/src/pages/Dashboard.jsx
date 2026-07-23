import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAccounts } from '../context/AccountsContext.jsx';

const currency = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

export default function Dashboard() {
  const { accounts, loading, ensureLoaded, refresh } = useAccounts();

  useEffect(() => {
    ensureLoaded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalBalance = (accounts || []).reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="page" data-testid="dashboard-page">
      <div className="page-header">
        <h1>Accounts</h1>
        <button onClick={() => refresh()} data-testid="dashboard-refresh">Refresh</button>
      </div>

      <div className="summary-card" data-testid="total-balance">
        <span>Total Balance</span>
        <strong>{accounts ? currency(totalBalance) : '—'}</strong>
      </div>

      {loading && !accounts && <p data-testid="accounts-loading">Loading accounts...</p>}

      <div className="account-grid" data-testid="account-list">
        {(accounts || []).map((account) => (
          <Link
            to={`/accounts/${account.id}`}
            key={account.id}
            className="account-card"
            data-testid={`account-card-${account.id}`}
          >
            <div className="account-card-type">{account.type === 'checking' ? 'Checking' : 'Savings'}</div>
            <div className="account-card-nickname">{account.nickname}</div>
            <div className="account-card-number">•••• {account.accountNumber.slice(-4)}</div>
            <div className="account-card-balance" data-testid={`account-balance-${account.id}`}>
              {currency(account.balance)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
