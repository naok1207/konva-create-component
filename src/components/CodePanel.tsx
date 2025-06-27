import { useState, useEffect, useRef, useCallback } from 'react';
import { FaCopy, FaDownload } from 'react-icons/fa';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import { generateReactCode } from '../utils/codeGenerator';
import { parseReactCode } from '../utils/codeParser';

function CodePanel() {
  const [isTypescript, setIsTypescript] = useState(false);
  const [localCode, setLocalCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { stage, setStage } = useStore();
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  
  const generatedCode = generateReactCode(stage, isTypescript);
  
  // Initialize local code when generated code changes
  useEffect(() => {
    setLocalCode(generatedCode);
  }, [generatedCode]);
  
  // Handle code changes with debouncing
  const handleCodeChange = useCallback((value: string | undefined) => {
    if (!value) return;
    
    setLocalCode(value);
    setError(null);
    
    // Clear existing timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Set new timer
    debounceTimer.current = setTimeout(() => {
      const result = parseReactCode(value);
      
      if (result.success && result.stage) {
        setStage(result.stage);
        setError(null);
      } else {
        setError(result.error || 'Failed to parse code');
      }
    }, 500);
  }, [setStage]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(localCode);
  };
  
  const handleDownload = () => {
    const blob = new Blob([localCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-component.${isTypescript ? 'tsx' : 'jsx'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);
  
  return (
    <div className="w-96 bg-white border-l border-gray-300 flex flex-col">
      <div className="h-10 border-b border-gray-300 flex items-center px-4 gap-4">
        <div className="flex gap-2">
          <button
            onClick={() => setIsTypescript(false)}
            className={`px-3 py-1 text-sm rounded ${!isTypescript ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            React
          </button>
          <button
            onClick={() => setIsTypescript(true)}
            className={`px-3 py-1 text-sm rounded ${isTypescript ? 'bg-primary text-white' : 'bg-gray-200'}`}
          >
            TypeScript
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden relative">
        <Editor
          height="100%"
          language={isTypescript ? 'typescript' : 'javascript'}
          theme="vs-light"
          value={localCode}
          onChange={handleCodeChange}
          options={{
            readOnly: false,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            overviewRulerLanes: 0,
            automaticLayout: true,
            tabSize: 2,
          }}
        />
        {error && (
          <div className="absolute bottom-0 left-0 right-0 bg-red-50 border-t border-red-200 p-2 text-sm text-red-600">
            {error}
          </div>
        )}
      </div>
      
      <div className="h-12 border-t border-gray-300 flex items-center justify-center gap-4 px-4">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded hover:bg-blue-600"
        >
          <FaCopy /> コピー
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          <FaDownload /> ダウンロード
        </button>
      </div>
    </div>
  );
}

export default CodePanel;