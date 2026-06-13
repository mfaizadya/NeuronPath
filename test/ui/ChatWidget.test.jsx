import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock ChatContext before importing the component
vi.mock('../../src/context/ChatContext', () => {
  const actual = vi.importActual('../../src/context/ChatContext');
  const mockSendMessage = vi.fn().mockResolvedValue('AI reply');
  return {
    ...actual,
    useChat: () => ({
      initialized: true,
      isLimitReached: false,
      activeSession: { messages: [] },
      sendMessage: mockSendMessage,
    }),
    ChatProvider: ({ children }) => <>{children}</>,
    mockSendMessage,
  };
});

import ChatWidget from '../../src/components/ChatWidget.jsx';

test('renders chat widget and sends a message', async () => {
  render(
    <MemoryRouter>
      <ChatWidget />
    </MemoryRouter>
  );

  const input = screen.getByPlaceholderText(/ketik pesan/i);
  expect(input).toBeInTheDocument();

  await fireEvent.change(input, { target: { value: 'halo' } });
  await fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

  // Verify that sendMessage was called with the user input
  const { mockSendMessage } = await import('../../src/context/ChatContext');
  await waitFor(() => expect(mockSendMessage).toHaveBeenCalledWith('halo'));
});
