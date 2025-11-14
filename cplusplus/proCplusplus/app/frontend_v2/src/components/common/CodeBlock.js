import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';

const CodeBlock = ({ code, language = 'cpp', showLineNumbers = true, title = null }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy code:', error);
    }
  };

  return (
    <div className="code-block my-6">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-800 dark:bg-black border-b border-neutral-700">
        {title && (
          <span className="text-sm font-medium text-neutral-300">
            {title}
          </span>
        )}
        <button
          onClick={handleCopy}
          className="ml-auto flex items-center space-x-2 px-3 py-1 rounded-md hover:bg-neutral-700 transition-colors text-sm text-neutral-300 hover:text-white"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-success-400" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.875rem',
          lineHeight: '1.75',
          fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, monospace',
        }}
        codeTagProps={{
          style: {
            fontFamily: 'JetBrains Mono, Fira Code, Consolas, Monaco, monospace',
          }
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

export default CodeBlock;
