// test/context/AuthContext.test.jsx
import { render, screen, act, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';

// Mock firebase config (auth instance)
vi.mock('../../src/config/firebase', () => ({
  auth: {
    currentUser: { uid: 'uid123', email: 'test@example.com', displayName: 'Test User', photoURL: null },
  },
}));

// Mock firebase/auth module
vi.mock('firebase/auth', () => {
  const mockUser = { uid: 'uid123', email: 'test@example.com', displayName: 'Test User', photoURL: null };
  return {
    // Auth state listener
    onAuthStateChanged: (auth, cb) => {
      // Simulate async initial auth state change
      setTimeout(() => cb(mockUser), 0);
      return () => {};
    },
    createUserWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: mockUser })),
    signInWithEmailAndPassword: vi.fn(() => Promise.resolve({ user: mockUser })),
    signOut: vi.fn(() => Promise.resolve()),
    updateProfile: vi.fn(() => Promise.resolve()),
    updatePassword: vi.fn(() => Promise.resolve()),
    reauthenticateWithCredential: vi.fn(() => Promise.resolve()),
    EmailAuthProvider: { credential: vi.fn() },
  };
});

// Mock user service
vi.mock('../../src/services/userService', () => ({
  createUserProfile: vi.fn(() => Promise.resolve()),
  getUserProfile: vi.fn(() => Promise.resolve({ username: 'Test User', role: 'user', isPremium: false })),
  updateUserProfile: vi.fn(() => Promise.resolve()),
  upgradeUserToPremium: vi.fn(() => Promise.resolve()),
}));

// Helper component to expose auth values for assertions
function Helper() {
  const { user, loading, login, register, logout, updateProfile, changePassword, upgradePremium } = useAuth();
  return (
    <div>
      <div data-testid="user-id">{user?.uid ?? 'null'}</div>
      <div data-testid="loading">{loading ? 'true' : 'false'}</div>
      <button onClick={() => login('test@example.com', 'pwd')} data-testid="login-btn">Login</button>
      <button onClick={() => register('NewUser', 'new@example.com', 'pwd')} data-testid="register-btn">Register</button>
      <button onClick={logout} data-testid="logout-btn">Logout</button>
      <button onClick={() => updateProfile({ username: 'Updated' })} data-testid="update-btn">Update</button>
      <button onClick={() => changePassword('old', 'new')} data-testid="change-pwd-btn">ChangePwd</button>
      <button onClick={upgradePremium} data-testid="upgrade-btn">Upgrade</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('initial loading resolves and user is set', async () => {
    render(
      <AuthProvider>
        <Helper />
      </AuthProvider>
    );
    // loading initially true
    expect(screen.getByTestId('loading')).toHaveTextContent('true');
    // wait for auth state change
    await waitFor(() => expect(screen.getByTestId('loading')).toHaveTextContent('false'));
    expect(screen.getByTestId('user-id')).toHaveTextContent('uid123');
  });

  test('login calls firebase signIn and returns user', async () => {
    const { signInWithEmailAndPassword } = await import('firebase/auth');
    render(
      <AuthProvider>
        <Helper />
      </AuthProvider>
    );
    await waitFor(() => {}); // ensure init finished
    await act(async () => {
      screen.getByTestId('login-btn').click();
    });
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(expect.anything(), 'test@example.com', 'pwd');
  });

  test('register creates profile and updates firebase displayName', async () => {
    const { createUserWithEmailAndPassword, updateProfile: firebaseUpdateProfile } = await import('firebase/auth');
    const { createUserProfile } = await import('../../src/services/userService');
    render(
      <AuthProvider>
        <Helper />
      </AuthProvider>
    );
    await waitFor(() => {});
    await act(async () => {
      screen.getByTestId('register-btn').click();
    });
    expect(createUserWithEmailAndPassword).toHaveBeenCalled();
    expect(firebaseUpdateProfile).toHaveBeenCalled();
    expect(createUserProfile).toHaveBeenCalled();
  });

  test('logout clears user state', async () => {
    const { signOut } = await import('firebase/auth');
    render(
      <AuthProvider>
        <Helper />
      </AuthProvider>
    );
    await waitFor(() => {});
    await act(async () => {
      screen.getByTestId('logout-btn').click();
    });
    expect(signOut).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByTestId('user-id')).toHaveTextContent('null'));
  });

  test('updateProfile updates auth displayName and context user', async () => {
    const { updateProfile: firebaseUpdateProfile } = await import('firebase/auth');
    const { updateUserProfile } = await import('../../src/services/userService');
    render(
      <AuthProvider>
        <Helper />
      </AuthProvider>
    );
    await waitFor(() => {});
    await act(async () => {
      screen.getByTestId('update-btn').click();
    });
    expect(firebaseUpdateProfile).toHaveBeenCalled();
    expect(updateUserProfile).toHaveBeenCalled();
    expect(screen.getByTestId('user-id')).toHaveTextContent('uid123');
  });

  test('upgradePremium sets isPremium flag', async () => {
    const { upgradeUserToPremium } = await import('../../src/services/userService');
    render(
      <AuthProvider>
        <Helper />
      </AuthProvider>
    );
    await waitFor(() => {});
    await act(async () => {
      screen.getByTestId('upgrade-btn').click();
    });
    expect(upgradeUserToPremium).toHaveBeenCalled();
  });
});
