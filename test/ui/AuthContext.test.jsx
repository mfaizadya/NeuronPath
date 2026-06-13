import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthContext, useAuth } from '../../src/context/AuthContext.jsx';
import { useState } from 'react';

const Dummy = () => {
  const { user, login } = useAuth();
  return (
    <div>
      {user ? user.email : 'guest'}
      <button onClick={() => login({ email: 'test@demo.com' })}>login</button>
    </div>
  );
};

test('AuthContext provides auth state', async () => {
  const MockAuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const login = async ({ email }) => {
      setUser({ email });
    };
    return (
      <AuthContext.Provider value={{ user, login }}>
        {children}
      </AuthContext.Provider>
    );
  };

  render(
    <MockAuthProvider>
      <Dummy />
    </MockAuthProvider>
  );
  expect(screen.getByText('guest')).toBeInTheDocument();
  await act(async () => {
    fireEvent.click(screen.getByText('login'));
  });
  expect(await screen.findByText('test@demo.com')).toBeInTheDocument();
});

