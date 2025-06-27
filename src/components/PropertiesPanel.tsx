import { useStore } from '../store/useStore';
import { Shape } from '../types';

function PropertiesPanel() {
  const { stage, selectedShapeId, updateShape } = useStore();
  
  const selectedShape = stage.layers
    .flatMap(layer => layer.shapes)
    .find(shape => shape.id === selectedShapeId);
  
  if (!selectedShape) {
    return (
      <div className="flex-1 bg-gray-50 flex items-center justify-center text-gray-500">
        図形を選択してプロパティを編集
      </div>
    );
  }
  
  const handleChange = (property: keyof Shape, value: any) => {
    updateShape(selectedShapeId!, { [property]: value });
  };
  
  return (
    <div className="flex-1 bg-white overflow-y-auto">
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-semibold mb-2">基本プロパティ</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm">位置 X:</label>
              <input
                type="number"
                value={selectedShape.x}
                onChange={(e) => handleChange('x', Number(e.target.value))}
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm">位置 Y:</label>
              <input
                type="number"
                value={selectedShape.y}
                onChange={(e) => handleChange('y', Number(e.target.value))}
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
              />
            </div>
            
            {selectedShape.type === 'rect' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="w-20 text-sm">幅:</label>
                  <input
                    type="number"
                    value={selectedShape.width}
                    onChange={(e) => handleChange('width', Number(e.target.value))}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-20 text-sm">高さ:</label>
                  <input
                    type="number"
                    value={selectedShape.height}
                    onChange={(e) => handleChange('height', Number(e.target.value))}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
              </>
            )}
            
            {selectedShape.type === 'circle' && (
              <div className="flex items-center gap-2">
                <label className="w-20 text-sm">半径:</label>
                <input
                  type="number"
                  value={selectedShape.radius}
                  onChange={(e) => handleChange('radius', Number(e.target.value))}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded"
                />
              </div>
            )}
            
            {selectedShape.type === 'text' && (
              <>
                <div className="flex items-center gap-2">
                  <label className="w-20 text-sm">テキスト:</label>
                  <input
                    type="text"
                    value={selectedShape.text}
                    onChange={(e) => handleChange('text', e.target.value)}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <label className="w-20 text-sm">フォントサイズ:</label>
                  <input
                    type="number"
                    value={selectedShape.fontSize || 16}
                    onChange={(e) => handleChange('fontSize', Number(e.target.value))}
                    className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  />
                </div>
              </>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="font-semibold mb-2">スタイル</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm">塗り:</label>
              <input
                type="color"
                value={selectedShape.fill || '#000000'}
                onChange={(e) => handleChange('fill', e.target.value)}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedShape.fill || ''}
                onChange={(e) => handleChange('fill', e.target.value)}
                placeholder="色コード"
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm">線:</label>
              <input
                type="color"
                value={selectedShape.stroke || '#000000'}
                onChange={(e) => handleChange('stroke', e.target.value)}
                className="w-10 h-8 border border-gray-300 rounded cursor-pointer"
              />
              <input
                type="text"
                value={selectedShape.stroke || ''}
                onChange={(e) => handleChange('stroke', e.target.value)}
                placeholder="色コード"
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm">線の幅:</label>
              <input
                type="number"
                value={selectedShape.strokeWidth || 0}
                onChange={(e) => handleChange('strokeWidth', Number(e.target.value))}
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
                min="0"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm">透明度:</label>
              <input
                type="range"
                value={(selectedShape.opacity || 1) * 100}
                onChange={(e) => handleChange('opacity', Number(e.target.value) / 100)}
                className="flex-1"
                min="0"
                max="100"
              />
              <span className="text-sm w-10">{Math.round((selectedShape.opacity || 1) * 100)}%</span>
            </div>
            
            <div className="flex items-center gap-2">
              <label className="w-20 text-sm">回転:</label>
              <input
                type="number"
                value={selectedShape.rotation || 0}
                onChange={(e) => handleChange('rotation', Number(e.target.value))}
                className="flex-1 px-2 py-1 border border-gray-300 rounded"
              />
              <span className="text-sm">°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PropertiesPanel;