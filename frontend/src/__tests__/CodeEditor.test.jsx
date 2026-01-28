import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import CodeEditor from '../components/CodeEditor';

let defineThemeSpy;
let setLangSpy;

vi.mock('@monaco-editor/react', () => {
  const React = require('react');
  return {
    default: (props) => {
      React.useEffect(() => {
        const monaco = {
          editor: { defineTheme: defineThemeSpy },
          languages: { setLanguageConfiguration: setLangSpy }
        };
        const editor = {
          onDidType: (cb) => {
            cb();
            return { dispose: () => {} };
          },
          onDidPaste: (cb) => {
            cb();
            return { dispose: () => {} };
          }
        };
        if (props.beforeMount) {
          props.beforeMount(monaco);
        }
        if (props.onMount) {
          props.onMount(editor, monaco);
        }
        if (props.onChange) {
          props.onChange('new code');
        }
      }, []);
      return React.createElement('div', { 'data-testid': 'monaco-editor' });
    }
  };
});

describe('CodeEditor', () => {
  beforeEach(() => {
    defineThemeSpy = vi.fn();
    setLangSpy = vi.fn();
  });

  it('initializes monaco theme and typing callbacks', () => {
    const onTyping = vi.fn();
    const onChange = vi.fn();

    render(
      <CodeEditor
        code="class X {}"
        onChange={onChange}
        language="java"
        onTyping={onTyping}
      />
    );

    expect(defineThemeSpy).toHaveBeenCalled();
    expect(setLangSpy).toHaveBeenCalled();
    expect(onTyping).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalledWith('new code');
  });
});
