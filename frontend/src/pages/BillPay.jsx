import { useEffect, useState } from 'react';
import { Receipt, Trash2, Plus, CheckCircle2 } from 'lucide-react';
import { api } from '../api';

const currency = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const PAYEE_COLORS = ['#1b998b', '#0b2545', '#e8a33d', '#5b7fb5', '#8e6bbf', '#c0392b'];
const payeeColor = (name) => PAYEE_COLORS[name.charCodeAt(0) % PAYEE_COLORS.length];

export default function BillPay() {
  const [accounts, setAccounts] = useState([]);
  const [payees, setPayees] = useState([]);
  const [fromAccountId, setFromAccountId] = useState('');
  const [selectedPayeeId, setSelectedPayeeId] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [showAddPayee, setShowAddPayee] = useState(false);
  const [newPayeeName, setNewPayeeName] = useState('');
  const [newPayeeAccount, setNewPayeeAccount] = useState('');
  const [newPayeeCategory, setNewPayeeCategory] = useState('');

  const loadAll = () => {
    api.getAccounts().then((data) => {
      setAccounts(data.accounts);
      if (data.accounts.length > 0) setFromAccountId((prev) => prev || String(data.accounts[0].id));
    });
    api.getPayees().then((data) => {
      setPayees(data.payees);
      if (data.payees.length > 0) setSelectedPayeeId((prev) => prev || String(data.payees[0].id));
    });
  };

  useEffect(() => {
    loadAll();
  }, []);

  const handlePay = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      const data = await api.payBill(Number(selectedPayeeId), {
        fromAccountId: Number(fromAccountId),
        amount: Number(amount),
        memo: memo.trim() || undefined
      });
      setSuccess(`Payment of ${currency(Math.abs(data.payment.amount))} sent successfully.`);
      setAccounts((prev) => prev.map((a) => (a.id === data.fromAccount.id ? data.fromAccount : a)));
      setAmount('');
      setMemo('');
    } catch (err) {
      setError(err.message || 'Payment failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddPayee = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.addPayee({ name: newPayeeName, accountNumber: newPayeeAccount, category: newPayeeCategory });
      setNewPayeeName('');
      setNewPayeeAccount('');
      setNewPayeeCategory('');
      setShowAddPayee(false);
      loadAll();
    } catch (err) {
      setError(err.message || 'Could not add payee');
    }
  };

  const handleDeletePayee = async (id) => {
    await api.deletePayee(id);
    loadAll();
  };

  return (
    <div className="page" data-testid="billpay-page">
      <h1>Bill Pay</h1>

      {error && (
        <div className="alert alert-error" data-testid="billpay-error">
          {error}
        </div>
      )}
      {success && (
        <div className="alert alert-success" data-testid="billpay-success">
          <CheckCircle2 size={16} /> {success}
        </div>
      )}

      <div className="two-column">
        <form className="card-form" onSubmit={handlePay} data-testid="billpay-form">
          <h2>
            <Receipt size={18} /> Pay a Bill
          </h2>

          <label htmlFor="billFromAccount">From Account</label>
          <select
            id="billFromAccount"
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
            data-testid="billpay-from-account"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nickname} — {currency(a.balance)}
              </option>
            ))}
          </select>

          <label htmlFor="payee">Payee</label>
          <select
            id="payee"
            value={selectedPayeeId}
            onChange={(e) => setSelectedPayeeId(e.target.value)}
            data-testid="billpay-payee-select"
          >
            {payees.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          <label htmlFor="billAmount">Amount</label>
          <input
            id="billAmount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            data-testid="billpay-amount"
          />

          <label htmlFor="billMemo">Memo (optional)</label>
          <input id="billMemo" value={memo} onChange={(e) => setMemo(e.target.value)} data-testid="billpay-memo" />

          <button type="submit" disabled={submitting || payees.length === 0} data-testid="billpay-submit">
            {submitting ? 'Sending...' : 'Send Payment'}
          </button>
          {payees.length === 0 && <p className="muted">Add a payee first.</p>}
        </form>

        <div className="card-form" data-testid="payee-list">
          <h2>Payees</h2>
          <ul className="payee-list">
            {payees.map((p) => (
              <li key={p.id} data-testid={`payee-row-${p.id}`}>
                <span className="payee-info">
                  <span className="payee-avatar" style={{ background: payeeColor(p.name) }}>
                    {p.name[0].toUpperCase()}
                  </span>
                  <span>
                    <strong>{p.name}</strong> <span className="muted">({p.category})</span>
                  </span>
                </span>
                <button onClick={() => handleDeletePayee(p.id)} className="icon-button-danger" data-testid={`payee-delete-${p.id}`}>
                  <Trash2 size={15} />
                </button>
              </li>
            ))}
            {payees.length === 0 && <li data-testid="no-payees">No payees yet.</li>}
          </ul>

          {!showAddPayee && (
            <button onClick={() => setShowAddPayee(true)} className="btn-outline" data-testid="show-add-payee">
              <Plus size={15} /> Add Payee
            </button>
          )}

          {showAddPayee && (
            <form className="inline-form" onSubmit={handleAddPayee} data-testid="add-payee-form">
              <label htmlFor="newPayeeName">Name</label>
              <input
                id="newPayeeName"
                value={newPayeeName}
                onChange={(e) => setNewPayeeName(e.target.value)}
                required
                data-testid="new-payee-name"
              />
              <label htmlFor="newPayeeAccount">Account Number</label>
              <input
                id="newPayeeAccount"
                value={newPayeeAccount}
                onChange={(e) => setNewPayeeAccount(e.target.value)}
                required
                data-testid="new-payee-account"
              />
              <label htmlFor="newPayeeCategory">Category</label>
              <input
                id="newPayeeCategory"
                value={newPayeeCategory}
                onChange={(e) => setNewPayeeCategory(e.target.value)}
                data-testid="new-payee-category"
              />
              <div className="button-row">
                <button type="button" onClick={() => setShowAddPayee(false)} data-testid="cancel-add-payee">
                  Cancel
                </button>
                <button type="submit" data-testid="save-add-payee">Save Payee</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
