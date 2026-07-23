import { useAuth } from '../context/AuthContext.jsx';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div className="page" data-testid="profile-page">
      <h1>Profile</h1>
      <div className="card-form">
        <dl className="review-list">
          <dt>Full Name</dt>
          <dd data-testid="profile-fullname">{user.fullName}</dd>
          <dt>Username</dt>
          <dd data-testid="profile-username">{user.username}</dd>
          <dt>Email</dt>
          <dd data-testid="profile-email">{user.email}</dd>
        </dl>
      </div>
    </div>
  );
}
