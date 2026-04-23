import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';
import { User, Mail, Calendar, Shield, Lock, Save, Loader2, CheckCircle2 } from 'lucide-react';
import './AccountPage.css';

export default function AccountPage() {
  const { user, updateProfile, changePassword } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState('');

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const joinDate = user?.joinDate
    ? new Date(user.joinDate).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '-';

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError('');
    setSaving(true);
    try {
      await updateProfile({ username });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setProfileError(getFirebaseErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Mohon isi semua field');
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError('Password baru minimal 8 karakter');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Password baru tidak sama');
      return;
    }

    setPasswordSaving(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSaved(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err) {
      setPasswordError(getFirebaseErrorMessage(err));
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          Pengaturan <span className="gradient-text">Profil</span>
        </h1>
        <p className="page-subtitle">
          Kelola informasi pribadi dan tampilan profil akun Anda.
        </p>
      </div>

      <div className="account-grid">
        {/* Profile Card */}
        <div className="account-card glass-card">
          <div className="account-card__header">
            <h3><User size={18} /> Informasi Profil</h3>
          </div>

          <div className="account-avatar">
            <div className="account-avatar__circle">
              {user?.username?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>

          {profileError && <div className="auth-error">{profileError}</div>}

          <form onSubmit={handleSaveProfile} className="account-form">
            <div className="form-group">
              <label className="form-label" htmlFor="acc-username">Username</label>
              <input
                id="acc-username"
                type="text"
                className="form-input"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="acc-email">Email</label>
              <input
                id="acc-email"
                type="email"
                className="form-input"
                value={user?.email || ''}
                disabled
              />
              <span className="form-hint">Hubungi administrator untuk mengubah email</span>
            </div>

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? <Loader2 size={16} className="spin" /> : saved ? <><CheckCircle2 size={16} /> Tersimpan!</> : <><Save size={16} /> Simpan Perubahan</>}
            </button>
          </form>
        </div>

        {/* Account Info */}
        <div className="account-side">
          <div className="account-info glass-card">
            <h3><Shield size={18} /> Informasi Akun</h3>
            <div className="account-info__items">
              <div className="account-info__item">
                <Calendar size={16} />
                <div>
                  <span className="account-info__label">Bergabung sejak</span>
                  <span className="account-info__value">{joinDate}</span>
                </div>
              </div>
              <div className="account-info__item">
                <Shield size={16} />
                <div>
                  <span className="account-info__label">Status Akun</span>
                  <span className="account-info__value account-info__value--green">
                    Aktif — {user?.role || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div className="account-password glass-card">
            <h3><Lock size={18} /> Keamanan</h3>

            {passwordError && <div className="auth-error">{passwordError}</div>}
            {passwordSaved && (
              <div className="account-success">
                <CheckCircle2 size={16} /> Password berhasil diubah
              </div>
            )}

            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label className="form-label" htmlFor="cur-pass">Password Saat Ini</label>
                <input
                  id="cur-pass"
                  type="password"
                  className="form-input"
                  placeholder="Password saat ini"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="new-pass">Password Baru</label>
                <input
                  id="new-pass"
                  type="password"
                  className="form-input"
                  placeholder="Minimal 8 karakter"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirm-pass">Konfirmasi Password</label>
                <input
                  id="confirm-pass"
                  type="password"
                  className="form-input"
                  placeholder="Ulangi password baru"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-secondary" disabled={passwordSaving}>
                {passwordSaving ? <Loader2 size={16} className="spin" /> : <><Lock size={16} /> Ubah Password</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
