import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Wallet, PiggyBank, RefreshCw, ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useAccounts } from '../context/AccountsContext.jsx';
import { api } from '../api';

const currency = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const CHART_COLORS = ['#1b998b', '#0b2545', '#e8a33d', '#c0392b', '#5b7fb5', '#8e6bbf'];

const ACCOUNT_ICON = { checking: Wallet, savings: PiggyBank };

export default function Dashboard() {
  const { accounts, loading, ensureLoaded, refresh } = useAccounts();
  const [recentTx, setRecentTx] = useState([]);
  const [txLoading, setTxLoading] = useState(true);

  useEffect(() => {
    ensureLoaded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!accounts || accounts.length === 0) return;
    setTxLoading(true);
    Promise.all(accounts.map((a) => api.getTransactions(a.id, { page: 1, pageSize: 50 })))
      .then((results) => {
        const merged = results.flatMap((r, idx) =>
          r.transactions.map((t) => ({ ...t, accountNickname: accounts[idx].nickname }))
        );
        merged.sort((a, b) => new Date(b.date) - new Date(a.date));
        setRecentTx(merged);
      })
      .finally(() => setTxLoading(false));
  }, [accounts]);

  const totalBalance = (accounts || []).reduce((sum, a) => sum + a.balance, 0);

  const categoryData = useMemo(() => {
    const totals = {};
    recentTx
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        totals[t.category] = (totals[t.category] || 0) + Math.abs(t.amount);
      });
    return Object.entries(totals)
      .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
      .sort((a, b) => b.value - a.value);
  }, [recentTx]);

  return (
    <div className="page" data-testid="dashboard-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Welcome back</p>
          <h1>Accounts Overview</h1>
        </div>
        <button className="btn-outline" onClick={() => refresh()} data-testid="dashboard-refresh">
          <RefreshCw size={15} /> Refresh
        </button>
      </div>

      <div className="dashboard-grid">
        <div className="summary-card hero-balance" data-testid="total-balance">
          <span>Total Balance</span>
          <strong>{accounts ? currency(totalBalance) : '—'}</strong>
          <div className="hero-balance-sub">Across {accounts ? accounts.length : 0} accounts</div>
        </div>

        <div className="chart-card" data-testid="spending-chart">
          <h3>Spending by Category</h3>
          {categoryData.length === 0 ? (
            <p className="muted chart-empty" data-testid="spending-chart-empty">
              {txLoading ? 'Loading...' : 'No spending in the recent transaction history yet.'}
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={2}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => currency(value)} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {loading && !accounts && <p data-testid="accounts-loading">Loading accounts...</p>}

      <h2 className="section-heading">Your Accounts</h2>
      <div className="account-grid" data-testid="account-list">
        {(accounts || []).map((account) => {
          const Icon = ACCOUNT_ICON[account.type] || Wallet;
          return (
            <Link
              to={`/accounts/${account.id}`}
              key={account.id}
              className="account-card"
              data-testid={`account-card-${account.id}`}
            >
              <div className="account-card-top">
                <span className="account-icon">
                  <Icon size={18} strokeWidth={2} />
                </span>
                <div className="account-card-type">{account.type === 'checking' ? 'Checking' : 'Savings'}</div>
              </div>
              <div className="account-card-nickname">{account.nickname}</div>
              <div className="account-card-number">•••• {account.accountNumber.slice(-4)}</div>
              <div className="account-card-balance" data-testid={`account-balance-${account.id}`}>
                {currency(account.balance)}
              </div>
            </Link>
          );
        })}
      </div>

      <h2 className="section-heading">Recent Activity</h2>
      <div className="card-form recent-activity" data-testid="recent-transactions-list">
        {recentTx.slice(0, 6).map((t) => (
          <div className="activity-row" key={`${t.accountId}-${t.id}`} data-testid={`activity-row-${t.id}`}>
            <span className={`activity-icon ${t.amount < 0 ? 'activity-icon-debit' : 'activity-icon-credit'}`}>
              {t.amount < 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
            </span>
            <div className="activity-details">
              <span className="activity-desc">{t.description}</span>
              <span className="muted activity-meta">
                {t.accountNickname} &middot; {formatDate(t.date)}
              </span>
            </div>
            <span className={t.amount < 0 ? 'amount-debit' : 'amount-credit'}>
              {t.amount < 0 ? '-' : '+'}
              {currency(Math.abs(t.amount))}
            </span>
          </div>
        ))}
        {!txLoading && recentTx.length === 0 && <p className="muted" data-testid="no-recent-activity">No recent activity.</p>}
      </div>
    </div>
  );
}
