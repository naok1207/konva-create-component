import Header from './components/Header';
import ToolPalette from './components/ToolPalette';
import Canvas from './components/Canvas';
import CodePanel from './components/CodePanel';
import PropertiesPanel from './components/PropertiesPanel';
import LayersPanel from './components/LayersPanel';

function App() {
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <ToolPalette />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex">
            <Canvas />
            <CodePanel />
          </div>
          
          <div className="h-60 flex border-t border-gray-300">
            <LayersPanel />
            <PropertiesPanel />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;