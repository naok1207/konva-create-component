import { Stage, Shape, Layer, RectShape, CircleShape, TextShape, EllipseShape, LineShape } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ParseResult {
  success: boolean;
  stage?: Stage;
  error?: string;
}

export function parseReactCode(code: string): ParseResult {
  try {
    // Remove imports and exports for parsing
    const cleanCode = code
      .replace(/import[\s\S]*?from[\s\S]*?;/g, '')
      .replace(/export\s+default[\s\S]*?;/g, '')
      .replace(/const\s+\w+:\s*React\.FC\s*=\s*\(\)\s*=>\s*{/, '')
      .replace(/const\s+\w+\s*=\s*\(\)\s*=>\s*{/, '')
      .replace(/};\s*$/, '');

    // Extract Stage props
    const stageMatch = cleanCode.match(/<Stage\s+width={(\d+)}\s+height={(\d+)}>/);
    if (!stageMatch) {
      return { success: false, error: 'Stage component not found' };
    }

    const stageWidth = parseInt(stageMatch[1]);
    const stageHeight = parseInt(stageMatch[2]);

    // Extract layers and shapes
    const layers: Layer[] = [];
    const layerRegex = /<Layer>([\s\S]*?)<\/Layer>/g;
    let layerMatch;
    
    while ((layerMatch = layerRegex.exec(cleanCode)) !== null) {
      const layerContent = layerMatch[1];
      const shapes = parseShapes(layerContent);
      
      layers.push({
        id: uuidv4(),
        name: `Layer ${layers.length + 1}`,
        visible: true,
        locked: false,
        shapes: shapes
      });
    }

    return {
      success: true,
      stage: {
        width: stageWidth,
        height: stageHeight,
        layers: layers
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to parse code'
    };
  }
}

function parseShapes(layerContent: string): Shape[] {
  const shapes: Shape[] = [];
  
  // Parse Rect components
  const rectRegex = /<Rect([^>]*?)\/>/g;
  let match;
  
  while ((match = rectRegex.exec(layerContent)) !== null) {
    const props = parseProps(match[1]);
    if (props.x !== undefined && props.y !== undefined && props.width !== undefined && props.height !== undefined) {
      shapes.push({
        id: uuidv4(),
        type: 'rect',
        x: props.x,
        y: props.y,
        width: props.width,
        height: props.height,
        fill: props.fill,
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        opacity: props.opacity,
        rotation: props.rotation,
        scaleX: props.scaleX,
        scaleY: props.scaleY,
        cornerRadius: props.cornerRadius,
        visible: true,
        draggable: true
      } as RectShape);
    }
  }
  
  // Parse Circle components
  const circleRegex = /<Circle([^>]*?)\/>/g;
  while ((match = circleRegex.exec(layerContent)) !== null) {
    const props = parseProps(match[1]);
    if (props.x !== undefined && props.y !== undefined && props.radius !== undefined) {
      shapes.push({
        id: uuidv4(),
        type: 'circle',
        x: props.x,
        y: props.y,
        radius: props.radius,
        fill: props.fill,
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        opacity: props.opacity,
        rotation: props.rotation,
        scaleX: props.scaleX,
        scaleY: props.scaleY,
        visible: true,
        draggable: true
      } as CircleShape);
    }
  }
  
  // Parse Text components
  const textRegex = /<Text([^>]*?)\/>/g;
  while ((match = textRegex.exec(layerContent)) !== null) {
    const props = parseProps(match[1]);
    if (props.x !== undefined && props.y !== undefined && props.text !== undefined) {
      shapes.push({
        id: uuidv4(),
        type: 'text',
        x: props.x,
        y: props.y,
        text: props.text,
        fontSize: props.fontSize,
        fontFamily: props.fontFamily,
        fontStyle: props.fontStyle,
        align: props.align,
        width: props.width,
        fill: props.fill,
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        opacity: props.opacity,
        rotation: props.rotation,
        scaleX: props.scaleX,
        scaleY: props.scaleY,
        visible: true,
        draggable: true
      } as TextShape);
    }
  }
  
  // Parse Ellipse components
  const ellipseRegex = /<Ellipse([^>]*?)\/>/g;
  while ((match = ellipseRegex.exec(layerContent)) !== null) {
    const props = parseProps(match[1]);
    if (props.x !== undefined && props.y !== undefined && props.radiusX !== undefined && props.radiusY !== undefined) {
      shapes.push({
        id: uuidv4(),
        type: 'ellipse',
        x: props.x,
        y: props.y,
        radiusX: props.radiusX,
        radiusY: props.radiusY,
        fill: props.fill,
        stroke: props.stroke,
        strokeWidth: props.strokeWidth,
        opacity: props.opacity,
        rotation: props.rotation,
        scaleX: props.scaleX,
        scaleY: props.scaleY,
        visible: true,
        draggable: true
      } as EllipseShape);
    }
  }
  
  // Parse Line components
  const lineRegex = /<Line([^>]*?)\/>/g;
  while ((match = lineRegex.exec(layerContent)) !== null) {
    const props = parseProps(match[1]);
    if (props.points !== undefined) {
      shapes.push({
        id: uuidv4(),
        type: 'line',
        x: 0,
        y: 0,
        points: props.points,
        closed: props.closed,
        fill: props.fill,
        stroke: props.stroke || '#000000',
        strokeWidth: props.strokeWidth || 2,
        opacity: props.opacity,
        rotation: props.rotation,
        scaleX: props.scaleX,
        scaleY: props.scaleY,
        visible: true,
        draggable: true
      } as LineShape);
    }
  }
  
  return shapes;
}

function parseProps(propsString: string): any {
  const props: any = {};
  
  // Parse number props
  const numberProps = ['x', 'y', 'width', 'height', 'radius', 'radiusX', 'radiusY', 'strokeWidth', 'opacity', 'rotation', 'scaleX', 'scaleY', 'cornerRadius', 'fontSize'];
  numberProps.forEach(prop => {
    const match = propsString.match(new RegExp(`${prop}={([\\d.]+)}`));
    if (match) {
      props[prop] = parseFloat(match[1]);
    }
  });
  
  // Parse string props
  const stringProps = ['fill', 'stroke', 'text', 'fontFamily', 'fontStyle', 'align'];
  stringProps.forEach(prop => {
    const match = propsString.match(new RegExp(`${prop}="([^"]*)"`));
    if (match) {
      props[prop] = match[1];
    }
  });
  
  // Parse array props (points)
  const pointsMatch = propsString.match(/points={\[([^\]]+)\]}/);
  if (pointsMatch) {
    props.points = pointsMatch[1].split(',').map(n => parseFloat(n.trim()));
  }
  
  // Parse boolean props
  if (propsString.includes('closed')) {
    props.closed = true;
  }
  
  return props;
}