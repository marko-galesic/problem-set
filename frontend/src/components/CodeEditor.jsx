import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

const DEFAULT_CODE = `class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return null;
    }
}`;

export default function CodeEditor({ code, onChange, language, onTyping }) {
  const editorRef = useRef(null);
  const wrapperRef = useRef(null);
  const [editorHeight, setEditorHeight] = useState(400);
  const onTypingRef = useRef(onTyping);
  const typingDisposablesRef = useRef([]);

  useEffect(() => {
    onTypingRef.current = onTyping;
  }, [onTyping]);

  useEffect(() => {
    function updateHeight() {
      if (wrapperRef.current) {
        const height = wrapperRef.current.clientHeight;
        if (height > 0) {
          setEditorHeight(height);
        }
      }
    }

    // Initial update with a small delay to ensure DOM is ready
    const timeoutId = setTimeout(updateHeight, 100);
    
    // Use ResizeObserver for container size changes
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });
    
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    // Also listen to window resize as fallback
    window.addEventListener('resize', updateHeight);

    return () => {
      clearTimeout(timeoutId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  useEffect(() => {
    return () => {
      typingDisposablesRef.current.forEach((disposable) => {
        if (disposable && typeof disposable.dispose === 'function') {
          disposable.dispose();
        }
      });
      typingDisposablesRef.current = [];
    };
  }, []);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;

    typingDisposablesRef.current.forEach((disposable) => {
      if (disposable && typeof disposable.dispose === 'function') {
        disposable.dispose();
      }
    });
    typingDisposablesRef.current = [];

    const handleTyping = () => {
      if (onTypingRef.current) {
        onTypingRef.current();
      }
    };

    const typingDisposables = [editor.onDidType(handleTyping)];
    if (typeof editor.onDidPaste === 'function') {
      typingDisposables.push(editor.onDidPaste(handleTyping));
    }
    typingDisposablesRef.current = typingDisposables;
    
    // Configure Java language features
    monaco.languages.setLanguageConfiguration('java', {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/']
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')']
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
        { open: "'", close: "'" }
      ]
    });

    // Add autocomplete suggestions
    monaco.languages.registerCompletionItemProvider('java', {
      provideCompletionItems: () => {
        return {
          suggestions: [
            {
              label: 'twoSum',
              kind: monaco.languages.CompletionItemKind.Method,
              insertText: 'twoSum(int[] nums, int target)',
              documentation: 'Find indices of two numbers that add to target'
            },
            {
              label: 'TwoSum',
              kind: monaco.languages.CompletionItemKind.Class,
              insertText: 'TwoSum',
              documentation: 'Class for implementing Two Sum'
            }
          ]
        };
      }
    });
  }

  return (
    <div className="code-editor-container">
      <div className="editor-wrapper" ref={wrapperRef}>
        <Editor
          height={editorHeight}
          defaultLanguage={language || 'java'}
          language={language || 'java'}
          value={code || DEFAULT_CODE}
          onChange={onChange}
          onMount={handleEditorDidMount}
          theme="vs"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true
          }}
        />
      </div>
    </div>
  );
}
