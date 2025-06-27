import { useState } from 'react';
import { FaCopy, FaDownload } from 'react-icons/fa';
import Editor from '@monaco-editor/react';
import { useStore } from '../store/useStore';
import { generateReactCode } from '../utils/codeGenerator';

function CodePanel() {
  const [isTypescript, setIsTypescript] = useState(false);
  const stage = useStore(state => state.stage);
  
  const code = generateReactCode(stage, isTypescript);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
  };
  
  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `generated-component.${isTypescript ? 'tsx' : 'jsx'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
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
      
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={isTypescript ? 'typescript' : 'javascript'}
          theme="vs-light"
          value={code}
          options={{
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            renderLineHighlight: 'none',
            overviewRulerLanes: 0,
          }}
        />
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