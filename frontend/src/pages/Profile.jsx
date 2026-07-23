import { Mail, AtSign, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const initials = (name) =>
  name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page" data-testid="profile-page">
      <h1>Profile</h1>
      <div className="card-form profile-card">
        <div className="profile-header">
          <span className="avatar-circle avatar-circle-lg">{initials(user.fullName)}</span>
          <div>
            <h2 className="profile-name">{user.fullName}</h2>
            <p className="muted">Account holder</p>
          </div>
        </div>
        <dl className="review-list profile-fields">
          <dt>
            <UserIcon size={14} /> Full Name
          </dt>
          <dd data-testid="profile-fullname">{user.fullName}</dd>
          <dt>
            <AtSign size={14} /> Username
          </dt>
          <dd data-testid="profile-username">{user.username}</dd>
          <dt>
            <Mail size={14} /> Email
          </dt>
          <dd data-testid="profile-email">{user.email}</dd>
        </dl>
      </div>
    </div>
  );
}
