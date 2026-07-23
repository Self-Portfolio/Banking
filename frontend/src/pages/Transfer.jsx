import { useEffect, useState } from 'react';
import { CheckCircle2, ArrowLeftRight } from 'lucide-react';
import { api } from '../api';

const currency = (n) => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const STEPS = [
  { key: 'form', label: 'Details' },
  { key: 'review', label: 'Review' },
  { key: 'success', label: 'Done' }
];

function StepIndicator({ current }) {
  const currentIndex = STEPS.findIndex((s) => s.key === current);
  return (
    <ol className="step-indicator" data-testid="transfer-step-indicator">
      {STEPS.map((s, idx) => (
        <li key={s.key} className={idx <= currentIndex ? 'step-active' : ''}>
          <span className="step-dot">{idx + 1}</span>
          <span>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}

export default function Transfer() {
  const [accounts, setAccounts] = useState([]);
  const [fromAccountId, setFromAccountId] = useState('');
  const [toAccountNumber, setToAccountNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');
  const [step, setStep] = useState('form'); // form | review | success
  const [error, setError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    api.getAccounts().then((data) => {
      setAccounts(data.accounts);
      if (data.accounts.length > 0) setFromAccountId(String(data.accounts[0].id));
    });
  }, []);

  const handleReview = (e) => {
    e.preventDefault();
    setError('');
    // NOTE: only guards against negative numbers, not zero - an
    // intentional client/server validation mismatch (the API rejects
    // amounts <= 0).
    const numeric = Number(amount);
    if (!toAccountNumber.trim()) {
      setValidationError('Destination account number is required');
      return;
    }
    if (!Number.isFinite(numeric) || numeric < 0) {
      setValidationError('Amount cannot be negative');
      return;
    }
    setValidationError('');
    setStep('review');
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setError('');
    try {
      const data = await api.transfer({
        fromAccountId: Number(fromAccountId),
        toAccountNumber: toAccountNumber.trim(),
        amount: Number(amount),
        memo: memo.trim() || undefined
      });
      setResult(data);
      setAccounts((prev) => prev.map((a) => (a.id === data.fromAccount.id ? data.fromAccount : a)));
      setStep('success');
    } catch (err) {
      setError(err.message || 'Transfer failed');
      setStep('form');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setToAccountNumber('');
    setAmount('');
    setMemo('');
    setResult(null);
    setStep('form');
  };

  const selectedAccount = accounts.find((a) => String(a.id) === String(fromAccountId));

  return (
    <div className="page" data-testid="transfer-page">
      <h1>Transfer Funds</h1>
      <StepIndicator current={step} />

      {step === 'form' && (
        <form className="card-form" onSubmit={handleReview} data-testid="transfer-form">
          {error && (
            <div className="alert alert-error" data-testid="transfer-error">
              {error}
            </div>
          )}
          {validationError && (
            <div className="alert alert-error" data-testid="transfer-validation-error">
              {validationError}
            </div>
          )}

          <label htmlFor="fromAccount">From Account</label>
          <select
            id="fromAccount"
            value={fromAccountId}
            onChange={(e) => setFromAccountId(e.target.value)}
            data-testid="transfer-from-account"
          >
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nickname} (•••• {a.accountNumber.slice(-4)}) — {currency(a.balance)}
              </option>
            ))}
          </select>

          <label htmlFor="toAccount">To Account Number</label>
          <input
            id="toAccount"
            value={toAccountNumber}
            onChange={(e) => setToAccountNumber(e.target.value)}
            placeholder="e.g. 1000200031"
            data-testid="transfer-to-account"
          />

          <label htmlFor="amount">Amount</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            data-testid="transfer-amount"
          />

          <label htmlFor="memo">Memo (optional)</label>
          <input id="memo" value={memo} onChange={(e) => setMemo(e.target.value)} data-testid="transfer-memo" />

          <button type="submit" data-testid="transfer-review-button">Review Transfer</button>
        </form>
      )}

      {step === 'review' && (
        <div className="card-form" data-testid="transfer-review">
          <h2>
            <ArrowLeftRight size={18} /> Review Transfer
          </h2>
          <dl className="review-list">
            <dt>From</dt>
            <dd data-testid="review-from">{selectedAccount?.nickname}</dd>
            <dt>To Account Number</dt>
            <dd data-testid="review-to">{toAccountNumber}</dd>
            <dt>Amount</dt>
            <dd data-testid="review-amount">{currency(Number(amount) || 0)}</dd>
            {memo && (
              <>
                <dt>Memo</dt>
                <dd data-testid="review-memo">{memo}</dd>
              </>
            )}
          </dl>
          <div className="button-row">
            <button onClick={() => setStep('form')} data-testid="transfer-edit-button" disabled={submitting}>
              Edit
            </button>
            <button onClick={handleConfirm} data-testid="transfer-confirm-button" disabled={submitting}>
              {submitting ? 'Processing...' : 'Confirm Transfer'}
            </button>
          </div>
        </div>
      )}

      {step === 'success' && result && (
        <div className="card-form" data-testid="transfer-success">
          <div className="alert alert-success" data-testid="transfer-success-message">
            <CheckCircle2 size={16} /> Transfer of {currency(result.transfer.amount)} completed successfully.
          </div>
          <p>
            New balance on {selectedAccount?.nickname}: <strong data-testid="transfer-new-balance">{currency(result.fromAccount.balance)}</strong>
          </p>
          <p className="muted">
            Note: the Dashboard total may not reflect this change until you click Refresh there.
          </p>
          <button onClick={resetForm} data-testid="transfer-another-button">Make Another Transfer</button>
        </div>
      )}
    </div>
  );
}
