import { useState } from 'react';
import { FaUndo, FaRedo, FaDownload, FaEye, FaObjectGroup, FaObjectUngroup } from 'react-icons/fa';
import { useStore } from '../store/useStore';
import { useGroupSelection } from '../hooks/useGroupSelection';

function Header() {
  const { gridSize, setGridSize, snapToGrid, toggleSnapToGrid, selectedShapeId, stage } = useStore();
  const [customGridSize, setCustomGridSize] = useState(gridSize.toString());
  const { selectedShapeIds, createGroup, ungroupSelectedGroup } = useGroupSelection();
  
  const selectedShape = stage.layers.flatMap(layer => layer.shapes).find(shape => shape.id === selectedShapeId);
  const isGroupSelected = selectedShape?.type === 'group';

  const handleGridSizeChange = (value: string) => {
    setCustomGridSize(value);
    const size = parseInt(value);
    if (!isNaN(size) && size > 0) {
      setGridSize(size);
    }
  };

  const gridPresets = [4, 8, 16, 32];

  return (
    <header className="h-12 bg-gray-900 text-white flex items-center px-4 gap-4">
      <div className="font-bold text-lg">React-Konva Builder</div>
      
      <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
        <button className="px-3 py-1 hover:bg-gray-800 rounded">新規</button>
        <button className="px-3 py-1 hover:bg-gray-800 rounded">開く</button>
        <button className="px-3 py-1 hover:bg-gray-800 rounded">保存</button>
      </div>
      
      <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
        <button className="p-1 hover:bg-gray-800 rounded" title="元に戻す">
          <FaUndo />
        </button>
        <button className="p-1 hover:bg-gray-800 rounded" title="やり直す">
          <FaRedo />
        </button>
      </div>
      
      <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
        <button 
          className="p-1 hover:bg-gray-800 rounded disabled:opacity-50" 
          title="グループ化 (Ctrl+G)"
          onClick={createGroup}
          disabled={selectedShapeIds.length < 2}
        >
          <FaObjectGroup />
        </button>
        <button 
          className="p-1 hover:bg-gray-800 rounded disabled:opacity-50" 
          title="グループ解除 (Ctrl+Shift+G)"
          onClick={() => selectedShapeId && ungroupSelectedGroup(selectedShapeId)}
          disabled={!isGroupSelected}
        >
          <FaObjectUngroup />
        </button>
      </div>
      
      <div className="flex items-center gap-2 border-l border-gray-700 pl-4">
        <label className="text-sm">グリッド:</label>
        <input
          type="number"
          value={customGridSize}
          onChange={(e) => handleGridSizeChange(e.target.value)}
          className="w-16 px-2 py-1 text-black rounded text-sm"
          min="1"
        />
        <span className="text-sm">px</span>
        <div className="flex gap-1">
          {gridPresets.map((preset) => (
            <button
              key={preset}
              onClick={() => handleGridSizeChange(preset.toString())}
              className={`px-2 py-1 text-xs rounded hover:bg-gray-800 ${
                gridSize === preset ? 'bg-gray-700' : ''
              }`}
            >
              {preset}
            </button>
          ))}
        </div>
        <button
          onClick={toggleSnapToGrid}
          className={`px-3 py-1 text-sm rounded hover:bg-gray-800 ${
            snapToGrid ? 'bg-primary' : 'bg-gray-700'
          }`}
        >
          スナップ {snapToGrid ? 'ON' : 'OFF'}
        </button>
      </div>
      
      <div className="flex items-center gap-2 border-l border-gray-700 pl-4 ml-auto">
        <button className="px-3 py-1 hover:bg-gray-800 rounded flex items-center gap-2">
          <FaEye /> プレビュー
        </button>
        <button className="px-3 py-1 bg-primary hover:bg-blue-600 rounded flex items-center gap-2">
          <FaDownload /> エクスポート
        </button>
      </div>
    </header>
  );
}

export default Header;