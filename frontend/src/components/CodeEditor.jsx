import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';

const DEFAULT_CODE = `class TwoSum {
    public int[] twoSum(int[] nums, int target) {
        return null;
    }
}`;

const MONACO_THEME = 'calm-light';
const MONACO_THEME_DEFINITION = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '6b7785' },
    { token: 'keyword', foreground: '0b5cad' },
    { token: 'number', foreground: '8c5a0b' },
    { token: 'string', foreground: '2f7d32' },
    { token: 'type.identifier', foreground: '2b6f87' },
    { token: 'delimiter', foreground: '556170' },
    { token: 'delimiter.bracket', foreground: '556170' },
    { token: 'operator', foreground: '4f5b66' },
    { token: 'annotation', foreground: '6b3fa0' }
  ],
  colors: {
    'editor.background': '#f6f5f0',
    'editor.foreground': '#2b2b2b',
    'editorLineNumber.foreground': '#a0a7ae',
    'editorLineNumber.activeForeground': '#2f5fb3',
    'editorCursor.foreground': '#2b2b2b',
    'editor.selectionBackground': '#cfe2ff',
    'editor.inactiveSelectionBackground': '#e6efff',
    'editor.selectionHighlightBackground': '#e9f1ff',
    'editor.lineHighlightBackground': '#eef2e9',
    'editorBracketMatch.background': '#e7f0ff',
    'editorBracketMatch.border': '#9fb5e6',
    'editorWhitespace.foreground': '#d1d6db',
    'editorIndentGuide.background': '#e1e4e8',
    'editorIndentGuide.activeBackground': '#c9d3df',
    'editorGutter.background': '#f6f5f0',
    'scrollbarSlider.background': '#c9d4e688',
    'scrollbarSlider.hoverBackground': '#b7c6deaa',
    'scrollbarSlider.activeBackground': '#a8bbd7cc',
    'editorSuggestWidget.background': '#ffffff',
    'editorSuggestWidget.border': '#d6dde6',
    'editorSuggestWidget.selectedBackground': '#e6f0ff',
    'editorHoverWidget.background': '#ffffff',
    'editorHoverWidget.border': '#d6dde6',
    'editorWidget.background': '#ffffff',
    'editorWidget.border': '#d6dde6',
    'editorError.foreground': '#c0392b',
    'editorWarning.foreground': '#b07a00',
    'editorInfo.foreground': '#2f5fb3',
    'editorInlayHint.foreground': '#6f7b85',
    'editorInlayHint.background': '#eef2f6',
    'editorRuler.foreground': '#e0e5eb'
  }
};

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

  function handleEditorWillMount(monaco) {
    monaco.editor.defineTheme(MONACO_THEME, MONACO_THEME_DEFINITION);
  }

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
          beforeMount={handleEditorWillMount}
          onMount={handleEditorDidMount}
          theme={MONACO_THEME}
          options={{
            minimap: { enabled: false },
            fontSize: 15,
            lineHeight: 22,
            fontFamily:
              "JetBrains Mono, Fira Code, SF Mono, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
            fontLigatures: true,
            letterSpacing: 0.2,
            lineNumbers: 'on',
            renderLineHighlight: 'all',
            renderWhitespace: 'selection',
            roundedSelection: false,
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            padding: { top: 10, bottom: 10 },
            scrollbar: {
              verticalScrollbarSize: 12,
              horizontalScrollbarSize: 12,
              useShadows: false
            },
            automaticLayout: true,
            tabSize: 4,
            wordWrap: 'on',
            suggestOnTriggerCharacters: false,
            quickSuggestions: false,
            wordBasedSuggestions: 'off',
            tabCompletion: 'off',
            inlineSuggest: { enabled: false },
            parameterHints: { enabled: false },
            hover: { enabled: false },
            acceptSuggestionOnEnter: 'off',
            suggest: {
              showWords: false,
              showStatusBar: false,
              preview: false
            }
          }}
        />
      </div>
    </div>
  );
}
