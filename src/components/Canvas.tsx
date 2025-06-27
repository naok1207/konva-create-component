import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Line, Group, Ellipse, Transformer } from 'react-konva';
import Konva from 'konva';
import { useStore } from '../store/useStore';
import { Shape, GroupShape } from '../types';
import { KonvaEventObject } from 'konva/lib/Node';
import { useGroupSelection } from '../hooks/useGroupSelection';
import './Canvas.css';

function Canvas() {
  const stageRef = useRef<Konva.Stage>(null);
  const transformerRef = useRef<Konva.Transformer>(null);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawingShape, setDrawingShape] = useState<any>(null);
  
  const {
    stage,
    selectedTool,
    selectedShapeId,
    gridSize,
    snapToGrid,
    showGrid,
    showRuler,
    setSelectedShapeId,
    addShape,
    updateShape,
    deleteShape,
  } = useStore();
  
  const { selectedShapeIds, toggleShapeSelection, clearSelection } = useGroupSelection();

  // Grid snapping helper
  const snapToGridValue = (value: number) => {
    if (!snapToGrid) return value;
    return Math.round(value / gridSize) * gridSize;
  };

  // Handle canvas click for drawing
  const handleStageMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    // Clear multi-selection if clicking on empty space
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty && selectedTool === 'select') {
      clearSelection();
      setSelectedShapeId(null);
    }
    
    if (selectedTool === 'select') return;
    
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;
    
    const x = snapToGridValue(point.x);
    const y = snapToGridValue(point.y);
    
    setIsDrawing(true);
    
    let newShape: any = {
      x,
      y,
      fill: '#ff0000',
      stroke: '#000000',
      strokeWidth: 2,
    };
    
    switch (selectedTool) {
      case 'rect':
        newShape = { ...newShape, width: 0, height: 0 };
        break;
      case 'circle':
        newShape = { ...newShape, radius: 0 };
        break;
      case 'text':
        newShape = { ...newShape, text: 'Text', fontSize: 16 };
        setIsDrawing(false);
        addShape({ ...newShape, type: 'text' });
        return;
    }
    
    setDrawingShape(newShape);
  };

  const handleStageMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing || !drawingShape) return;
    
    const stage = e.target.getStage();
    const point = stage?.getPointerPosition();
    if (!point) return;
    
    const x = snapToGridValue(point.x);
    const y = snapToGridValue(point.y);
    
    let updatedShape = { ...drawingShape };
    
    switch (selectedTool) {
      case 'rect':
        updatedShape.width = x - drawingShape.x;
        updatedShape.height = y - drawingShape.y;
        break;
      case 'circle':
        const dx = x - drawingShape.x;
        const dy = y - drawingShape.y;
        updatedShape.radius = Math.sqrt(dx * dx + dy * dy);
        break;
    }
    
    setDrawingShape(updatedShape);
  };

  const handleStageMouseUp = () => {
    if (!isDrawing || !drawingShape) return;
    
    setIsDrawing(false);
    
    if (selectedTool === 'rect' && (Math.abs(drawingShape.width) > 5 || Math.abs(drawingShape.height) > 5)) {
      // Normalize negative dimensions
      const shape = {
        ...drawingShape,
        type: 'rect' as const,
        x: drawingShape.width < 0 ? drawingShape.x + drawingShape.width : drawingShape.x,
        y: drawingShape.height < 0 ? drawingShape.y + drawingShape.height : drawingShape.y,
        width: Math.abs(drawingShape.width),
        height: Math.abs(drawingShape.height),
      };
      addShape(shape);
    } else if (selectedTool === 'circle' && drawingShape.radius > 5) {
      addShape({ ...drawingShape, type: 'circle' });
    }
    
    setDrawingShape(null);
  };

  // Render grid
  const renderGrid = () => {
    if (!showGrid) return null;
    
    const lines = [];
    const width = stageSize.width;
    const height = stageSize.height;
    
    // Vertical lines
    for (let x = 0; x <= width; x += gridSize) {
      lines.push(
        <Line
          key={`v-${x}`}
          points={[x, 0, x, height]}
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth={1}
          listening={false}
        />
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= height; y += gridSize) {
      lines.push(
        <Line
          key={`h-${y}`}
          points={[0, y, width, y]}
          stroke="rgba(0, 0, 0, 0.1)"
          strokeWidth={1}
          listening={false}
        />
      );
    }
    
    return lines;
  };

  // Render shapes
  const renderShape = (shape: Shape | GroupShape): any => {
    if (shape.type === 'group') {
      return (
        <Group
          key={shape.id}
          id={shape.id}
          x={shape.x}
          y={shape.y}
          opacity={shape.opacity}
          rotation={shape.rotation}
          scaleX={shape.scaleX}
          scaleY={shape.scaleY}
          draggable={selectedTool === 'select' && shape.draggable}
          onClick={(e: KonvaEventObject<MouseEvent>) => {
            if (e.evt.ctrlKey || e.evt.metaKey) {
              toggleShapeSelection(shape.id);
            } else {
              clearSelection();
              setSelectedShapeId(shape.id);
            }
          }}
          onDragEnd={(e: KonvaEventObject<DragEvent>) => {
            const node = e.target;
            updateShape(shape.id, {
              x: snapToGridValue(node.x()),
              y: snapToGridValue(node.y()),
            });
          }}
        >
          {shape.children.map(child => renderShape(child))}
        </Group>
      );
    }
    
    const commonProps = {
      key: shape.id,
      id: shape.id,
      x: shape.x,
      y: shape.y,
      fill: shape.fill,
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth,
      opacity: shape.opacity,
      rotation: shape.rotation,
      scaleX: shape.scaleX,
      scaleY: shape.scaleY,
      draggable: selectedTool === 'select',
      onClick: (e: KonvaEventObject<MouseEvent>) => {
        if (e.evt.ctrlKey || e.evt.metaKey) {
          toggleShapeSelection(shape.id);
        } else {
          clearSelection();
          setSelectedShapeId(shape.id);
        }
      },
      onDragEnd: (e: KonvaEventObject<DragEvent>) => {
        const node = e.target;
        updateShape(shape.id, {
          x: snapToGridValue(node.x()),
          y: snapToGridValue(node.y()),
        });
      },
    };
    
    switch (shape.type) {
      case 'rect':
        return <Rect {...commonProps} width={shape.width} height={shape.height} cornerRadius={shape.cornerRadius} />;
      case 'circle':
        return <Circle {...commonProps} radius={shape.radius} />;
      case 'text':
        return (
          <Text
            {...commonProps}
            text={shape.text}
            fontSize={shape.fontSize}
            fontFamily={shape.fontFamily}
            fontStyle={shape.fontStyle}
            align={shape.align}
            width={shape.width}
          />
        );
      case 'ellipse':
        return <Ellipse {...commonProps} radiusX={shape.radiusX} radiusY={shape.radiusY} />;
      case 'line':
        return <Line {...commonProps} points={shape.points} closed={shape.closed} />;
      default:
        return null;
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete') {
        if (selectedShapeId) {
          deleteShape(selectedShapeId);
        }
        selectedShapeIds.forEach(id => deleteShape(id));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedShapeId, selectedShapeIds, deleteShape]);
  
  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !stageRef.current) return;
    
    const transformer = transformerRef.current;
    const stage = stageRef.current;
    
    if (selectedShapeId || selectedShapeIds.length > 0) {
      const selectedNodes: Konva.Node[] = [];
      
      if (selectedShapeId) {
        const node = stage.findOne(`#${selectedShapeId}`);
        if (node) selectedNodes.push(node);
      }
      
      selectedShapeIds.forEach(id => {
        const node = stage.findOne(`#${id}`);
        if (node) selectedNodes.push(node);
      });
      
      transformer.nodes(selectedNodes);
    } else {
      transformer.nodes([]);
    }
  }, [selectedShapeId, selectedShapeIds]);

  return (
    <div className="flex-1 bg-gray-100 relative overflow-hidden">
      {/* Stage size controls */}
      <div className="absolute top-2 left-2 bg-white p-2 rounded shadow z-10">
        <div className="flex items-center gap-2 text-sm">
          <label>幅:</label>
          <input
            type="number"
            value={stage.width}
            onChange={(e) => useStore.getState().setStageSize(Number(e.target.value), stage.height)}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
          />
          <label>高さ:</label>
          <input
            type="number"
            value={stage.height}
            onChange={(e) => useStore.getState().setStageSize(stage.width, Number(e.target.value))}
            className="w-20 px-2 py-1 border border-gray-300 rounded"
          />
        </div>
      </div>
      
      {/* Canvas */}
      <div className="flex items-center justify-center h-full">
        <div className="bg-white shadow-lg">
          <Stage
            ref={stageRef}
            width={stage.width}
            height={stage.height}
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleStageMouseMove}
            onMouseUp={handleStageMouseUp}
          >
            {/* Grid layer */}
            <Layer listening={false}>
              {renderGrid()}
            </Layer>
            
            {/* Shapes layers */}
            {stage.layers
              .filter(layer => layer.visible)
              .map(layer => (
                <Layer key={layer.id}>
                  {layer.shapes.map(shape => renderShape(shape))}
                  <Transformer
                    ref={transformerRef}
                    boundBoxFunc={(oldBox, newBox) => {
                      // Limit resize
                      if (newBox.width < 5 || newBox.height < 5) {
                        return oldBox;
                      }
                      return newBox;
                    }}
                  />
                </Layer>
              ))}
            
            {/* Drawing layer */}
            {isDrawing && drawingShape && (
              <Layer>
                {selectedTool === 'rect' && (
                  <Rect
                    x={drawingShape.x}
                    y={drawingShape.y}
                    width={drawingShape.width}
                    height={drawingShape.height}
                    fill={drawingShape.fill}
                    stroke={drawingShape.stroke}
                    strokeWidth={drawingShape.strokeWidth}
                    opacity={0.5}
                  />
                )}
                {selectedTool === 'circle' && (
                  <Circle
                    x={drawingShape.x}
                    y={drawingShape.y}
                    radius={drawingShape.radius}
                    fill={drawingShape.fill}
                    stroke={drawingShape.stroke}
                    strokeWidth={drawingShape.strokeWidth}
                    opacity={0.5}
                  />
                )}
              </Layer>
            )}
          </Stage>
        </div>
      </div>
    </div>
  );
}

export default Canvas;