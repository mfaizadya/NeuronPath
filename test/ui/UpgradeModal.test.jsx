import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import UpgradeModal from '../../src/components/UpgradeModal.jsx';

test('renders upgrade modal and handles confirm', async () => {
  const onConfirm = vi.fn();
  render(
    <MemoryRouter>
      <UpgradeModal isOpen={true} onConfirm={onConfirm} onClose={() => {}} />
    </MemoryRouter>
  );

  // Modal title should be present
  expect(screen.getByRole('heading', { name: /upgrade ke premium/i })).toBeInTheDocument();

  // Click confirm button
  const confirmBtn = screen.getByRole('button', { name: /lanjut ke pembayaran/i });
  await fireEvent.click(confirmBtn);
  expect(onConfirm).toHaveBeenCalled();
});
