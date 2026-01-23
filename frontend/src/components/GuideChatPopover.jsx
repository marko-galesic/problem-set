import React, { useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';

export default function GuideChatPopover({
  isOpen,
  onClose,
  messages,
  inputValue,
  onInputChange,
  onSend,
  isLoading,
  error
}) {
  const messagesRef = useRef(null);

  useEffect(() => {
    if (isOpen && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [isOpen, messages, isLoading]);

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (onSend) {
        onSend();
      }
    }
  }

  if (!isOpen) {
    return null;
  }

  const trimmedInput = (inputValue || '').trim();
  const canSend = trimmedInput.length > 0 && !isLoading;

  return (
    <div className="guide-chat-popover-overlay" onClick={onClose}>
      <div
        className="guide-chat-popover"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="guide-chat-popover-header">
          <span>Guide me</span>
          <button
            className="guide-chat-popover-close"
            onClick={onClose}
            aria-label="Close"
          >
            x
          </button>
        </div>
        <div className="guide-chat-popover-content">
          <div className="guide-chat-banner">
            Guided mode is active. Your submission will be marked as Guided.
          </div>
          <div className="guide-chat-messages" ref={messagesRef}>
            {(!messages || messages.length === 0) && (
              <div className="guide-chat-empty">
                Ask a question to get guided help.
              </div>
            )}
            {(messages || []).map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`guide-chat-message ${message.role === 'user' ? 'user' : 'assistant'}`}
              >
                {message.role === 'assistant' ? (
                  <div className="guide-chat-message-content">
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                ) : (
                  <div className="guide-chat-message-content">
                    {message.content}
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="guide-chat-message assistant is-loading">
                <div className="guide-chat-message-content">
                  Thinking...
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="guide-chat-popover-footer">
          {error && (
            <div className="guide-chat-error">
              {error}
            </div>
          )}
          <div className="guide-chat-input-row">
            <textarea
              className="guide-chat-textarea"
              placeholder="Ask for guidance..."
              value={inputValue}
              onChange={(event) => onInputChange && onInputChange(event.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className="btn btn-guide-send"
              onClick={onSend}
              disabled={!canSend}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
