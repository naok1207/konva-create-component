import { FaEye, FaEyeSlash, FaLock, FaUnlock, FaPlus, FaCopy, FaTrash } from 'react-icons/fa';
import { useStore } from '../store/useStore';
import clsx from 'clsx';

function LayersPanel() {
  const { stage, selectedLayerId, setSelectedLayerId, addLayer, deleteLayer, toggleLayerVisibility, toggleLayerLock } = useStore();
  
  return (
    <div className="w-60 bg-white border-r border-gray-300 flex flex-col">
      <div className="h-10 border-b border-gray-300 flex items-center px-4 font-semibold">
        レイヤー
      </div>
      
      <div className="p-2 border-b border-gray-200">
        <div className="flex gap-2">
          <button
            onClick={() => addLayer()}
            className="flex-1 flex items-center justify-center gap-1 px-2 py-1 bg-primary text-white rounded hover:bg-blue-600 text-sm"
          >
            <FaPlus /> 追加
          </button>
          <button
            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
            title="複製"
          >
            <FaCopy />
          </button>
          <button
            onClick={() => selectedLayerId && deleteLayer(selectedLayerId)}
            className="p-1 bg-gray-200 rounded hover:bg-gray-300"
            title="削除"
            disabled={stage.layers.length <= 1}
          >
            <FaTrash />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {stage.layers.slice().reverse().map((layer) => (
          <div
            key={layer.id}
            onClick={() => setSelectedLayerId(layer.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100',
              selectedLayerId === layer.id && 'bg-blue-50'
            )}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerVisibility(layer.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {layer.visible ? <FaEye /> : <FaEyeSlash className="text-gray-400" />}
            </button>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleLayerLock(layer.id);
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {layer.locked ? <FaLock className="text-gray-600" /> : <FaUnlock className="text-gray-400" />}
            </button>
            
            <span className="flex-1">{layer.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LayersPanel;