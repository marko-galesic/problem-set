import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import GuideChatPopover from '../components/GuideChatPopover';

describe('GuideChatPopover', () => {
  it('renders empty state and disables send', () => {
    render(
      <GuideChatPopover
        isOpen={true}
        messages={[]}
        inputValue=""
        onInputChange={() => {}}
        onSend={() => {}}
        isLoading={false}
      />
    );

    expect(screen.getByText(/ask a question/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  });

  it('renders messages and sends on enter', () => {
    const onSend = vi.fn();
    const onInputChange = vi.fn();

    render(
      <GuideChatPopover
        isOpen={true}
        messages={[
          { role: 'user', content: 'Help' },
          { role: 'assistant', content: 'Try a hash map' }
        ]}
        inputValue="Hi"
        onInputChange={onInputChange}
        onSend={onSend}
        isLoading={false}
        error=""
      />
    );

    expect(screen.getByText('Help')).toBeInTheDocument();
    expect(screen.getByText(/try a hash map/i)).toBeInTheDocument();

    const textarea = screen.getByRole('textbox');
    fireEvent.keyDown(textarea, { key: 'Enter', shiftKey: false, preventDefault: () => {} });
    expect(onSend).toHaveBeenCalledTimes(1);

    fireEvent.change(textarea, { target: { value: 'Next' } });
    expect(onInputChange).toHaveBeenCalledWith('Next');
  });

  it('shows loading and error states', () => {
    const { rerender } = render(
      <GuideChatPopover
        isOpen={true}
        messages={[]}
        inputValue="hello"
        onInputChange={() => {}}
        onSend={() => {}}
        isLoading={true}
        error=""
      />
    );

    expect(screen.getByText(/thinking/i)).toBeInTheDocument();

    rerender(
      <GuideChatPopover
        isOpen={true}
        messages={[]}
        inputValue="hello"
        onInputChange={() => {}}
        onSend={() => {}}
        isLoading={false}
        error="Oops"
      />
    );

    expect(screen.getByText('Oops')).toBeInTheDocument();
  });
});
