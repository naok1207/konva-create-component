import { FaMousePointer, FaSquare, FaCircle, FaMinus, FaFont, FaImage, FaDrawPolygon } from 'react-icons/fa';
import { useStore } from '../store/useStore';
import { ShapeType } from '../types';
import clsx from 'clsx';

interface Tool {
  id: ShapeType | 'select';
  icon: React.ReactNode;
  title: string;
  shortcut: string;
}

const tools: Tool[] = [
  { id: 'select', icon: <FaMousePointer />, title: '選択ツール', shortcut: 'V' },
  { id: 'rect', icon: <FaSquare />, title: '矩形', shortcut: 'R' },
  { id: 'circle', icon: <FaCircle />, title: '円', shortcut: 'C' },
  { id: 'line', icon: <FaMinus />, title: '線', shortcut: 'L' },
  { id: 'text', icon: <FaFont />, title: 'テキスト', shortcut: 'T' },
  { id: 'image', icon: <FaImage />, title: '画像', shortcut: 'I' },
  { id: 'path', icon: <FaDrawPolygon />, title: 'パス', shortcut: 'P' },
];

function ToolPalette() {
  const { selectedTool, setSelectedTool } = useStore();

  return (
    <div className="w-14 bg-gray-800 flex flex-col items-center py-2 gap-1">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={() => setSelectedTool(tool.id)}
          className={clsx(
            'w-10 h-10 flex items-center justify-center rounded hover:bg-gray-700 text-white',
            selectedTool === tool.id && 'bg-primary'
          )}
          title={`${tool.title} (${tool.shortcut})`}
        >
          {tool.icon}
        </button>
      ))}
    </div>
  );
}

export default ToolPalette;