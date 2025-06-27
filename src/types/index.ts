export type ShapeType = 'rect' | 'circle' | 'ellipse' | 'line' | 'polygon' | 'star' | 'text' | 'image' | 'path' | 'arrow';

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface BaseShape {
  id: string;
  type: ShapeType;
  x: number;
  y: number;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number;
  rotation?: number;
  scaleX?: number;
  scaleY?: number;
  visible?: boolean;
  draggable?: boolean;
}

export interface RectShape extends BaseShape {
  type: 'rect';
  width: number;
  height: number;
  cornerRadius?: number;
}

export interface CircleShape extends BaseShape {
  type: 'circle';
  radius: number;
}

export interface EllipseShape extends BaseShape {
  type: 'ellipse';
  radiusX: number;
  radiusY: number;
}

export interface LineShape extends BaseShape {
  type: 'line';
  points: number[];
  closed?: boolean;
}

export interface TextShape extends BaseShape {
  type: 'text';
  text: string;
  fontSize?: number;
  fontFamily?: string;
  fontStyle?: string;
  align?: string;
  width?: number;
}

export type Shape = RectShape | CircleShape | EllipseShape | LineShape | TextShape;

export interface Layer {
  id: string;
  name: string;
  visible: boolean;
  locked: boolean;
  shapes: Shape[];
}

export interface Stage {
  width: number;
  height: number;
  layers: Layer[];
}

export interface AppState {
  stage: Stage;
  selectedTool: ShapeType | 'select';
  selectedShapeId: string | null;
  selectedLayerId: string | null;
  gridSize: number;
  snapToGrid: boolean;
  showGrid: boolean;
  showRuler: boolean;
}