import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api';

const currency = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const formatDate = (iso) => new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

export default function AccountDetails() {
  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [search, setSearch] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [txData, setTxData] = useState({ transactions: [], totalPages: 1, totalItems: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.getAccount(id).then((data) => setAccount(data.account)).catch((err) => setError(err.message));
  }, [id]);

  useEffect(() => {
    setLoading(true);
    api
      .getTransactions(id, { search, from, to, page, pageSize })
      .then(setTxData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, search, from, to, page]);

  useEffect(() => {
    setPage(1);
  }, [search, from, to]);

  if (error) return <div className="page" data-testid="account-details-error">{error}</div>;

  return (
    <div className="page" data-testid="account-details-page">
      <Link to="/dashboard" data-testid="back-to-dashboard">&larr; Back to Accounts</Link>

      {account && (
        <div className="page-header">
          <div>
            <h1>{account.nickname}</h1>
            <p className="muted">Account •••• {account.accountNumber.slice(-4)}</p>
          </div>
          <div className="summary-card" data-testid="account-detail-balance">
            <span>Current Balance</span>
            <strong>{currency(account.balance)}</strong>
          </div>
        </div>
      )}

      <div className="filters">
        <input
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          data-testid="transaction-search"
        />
        <label>
          From
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} data-testid="transaction-from" />
        </label>
        <label>
          To
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} data-testid="transaction-to" />
        </label>
      </div>

      <table className="transaction-table" data-testid="transaction-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Balance</th>
          </tr>
        </thead>
        <tbody>
          {txData.transactions.map((t) => (
            <tr key={t.id} data-testid={`transaction-row-${t.id}`}>
              <td>{formatDate(t.date)}</td>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td className={t.amount < 0 ? 'amount-debit' : 'amount-credit'}>
                {t.amount < 0 ? '-' : '+'}
                {currency(Math.abs(t.amount))}
              </td>
              <td>{currency(t.balanceAfter)}</td>
            </tr>
          ))}
          {!loading && txData.transactions.length === 0 && (
            <tr>
              <td colSpan={5} data-testid="no-transactions">
                No transactions found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <div className="pagination" data-testid="pagination">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page <= 1}
          data-testid="pagination-prev"
        >
          Previous
        </button>
        <span data-testid="pagination-status">
          Page {page} of {txData.totalPages} ({txData.totalItems} transactions)
        </span>
        <button
          onClick={() => setPage((p) => Math.min(txData.totalPages, p + 1))}
          disabled={page >= txData.totalPages}
          data-testid="pagination-next"
        >
          Next
        </button>
      </div>
    </div>
  );
}
