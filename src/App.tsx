import { useState } from 'react';
import Header from './components/Header';
import ToolPalette from './components/ToolPalette';
import Canvas from './components/Canvas';
import CodePanel from './components/CodePanel';
import PropertiesPanel from './components/PropertiesPanel';
import LayersPanel from './components/LayersPanel';
import ResizeHandle from './components/ResizeHandle';

function App() {
  const [codePanelWidth, setCodePanelWidth] = useState(384); // Default: w-96 = 24rem = 384px
  const [bottomPanelHeight, setBottomPanelHeight] = useState(240); // Default: h-60 = 15rem = 240px
  const [layersPanelWidth, setLayersPanelWidth] = useState(240); // Default: w-60 = 15rem = 240px
  
  const minCodeWidth = 300;
  const maxCodeWidth = 800;
  const minBottomHeight = 150;
  const maxBottomHeight = 400;
  const minLayersWidth = 200;
  const maxLayersWidth = 400;

  const handleCodeResize = (deltaX: number) => {
    setCodePanelWidth(prev => {
      const newWidth = prev - deltaX; // Negative because we're resizing from the left
      return Math.max(minCodeWidth, Math.min(maxCodeWidth, newWidth));
    });
  };

  const handleBottomResize = (deltaY: number) => {
    setBottomPanelHeight(prev => {
      const newHeight = prev - deltaY; // Negative because we're resizing from the top
      return Math.max(minBottomHeight, Math.min(maxBottomHeight, newHeight));
    });
  };

  const handleLayersResize = (deltaX: number) => {
    setLayersPanelWidth(prev => {
      const newWidth = prev + deltaX;
      return Math.max(minLayersWidth, Math.min(maxLayersWidth, newWidth));
    });
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header />
      
      <div className="flex-1 flex overflow-hidden">
        <ToolPalette />
        
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex relative">
            <Canvas />
            <ResizeHandle onResize={handleCodeResize} />
            <div style={{ width: `${codePanelWidth}px` }} className="flex-shrink-0">
              <CodePanel />
            </div>
          </div>
          
          <ResizeHandle onResize={handleBottomResize} orientation="horizontal" />
          
          <div style={{ height: `${bottomPanelHeight}px` }} className="flex border-t border-gray-300 flex-shrink-0">
            <div style={{ width: `${layersPanelWidth}px` }} className="flex-shrink-0">
              <LayersPanel />
            </div>
            <ResizeHandle onResize={handleLayersResize} />
            <div className="flex-1">
              <PropertiesPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;