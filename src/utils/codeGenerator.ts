import { Stage, Shape, Layer } from '../types';

export function generateReactCode(stage: Stage, typescript: boolean = false): string {
  const imports = generateImports(stage);
  const componentName = 'GeneratedComponent';
  const componentCode = generateComponent(stage, componentName, typescript);
  
  return `${imports}\n\n${componentCode}`;
}

function generateImports(stage: Stage): string {
  const shapes = stage.layers.flatMap(layer => layer.shapes);
  const shapeTypes = new Set(shapes.map(shape => shape.type));
  
  const konvaImports = ['Stage', 'Layer'];
  
  shapeTypes.forEach(type => {
    switch (type) {
      case 'rect':
        konvaImports.push('Rect');
        break;
      case 'circle':
        konvaImports.push('Circle');
        break;
      case 'ellipse':
        konvaImports.push('Ellipse');
        break;
      case 'line':
        konvaImports.push('Line');
        break;
      case 'text':
        konvaImports.push('Text');
        break;
      case 'image':
        konvaImports.push('Image');
        break;
      case 'path':
        konvaImports.push('Path');
        break;
      case 'arrow':
        konvaImports.push('Arrow');
        break;
    }
  });
  
  return `import React from 'react';\nimport { ${konvaImports.join(', ')} } from 'react-konva';`;
}

function generateComponent(stage: Stage, componentName: string, typescript: boolean): string {
  const functionSignature = typescript ? `const ${componentName}: React.FC = ()` : `const ${componentName} = ()`;
  
  const layersCode = stage.layers
    .filter(layer => layer.visible)
    .map(layer => generateLayerCode(layer))
    .join('\n');
  
  return `${functionSignature} => {
  return (
    <Stage width={${stage.width}} height={${stage.height}}>
${layersCode}
    </Stage>
  );
};

export default ${componentName};`;
}

function generateLayerCode(layer: Layer): string {
  const shapesCode = layer.shapes
    .filter(shape => shape.visible !== false)
    .map(shape => generateShapeCode(shape))
    .join('\n');
  
  return `      <Layer>
${shapesCode}
      </Layer>`;
}

function generateShapeCode(shape: Shape): string {
  const indent = '        ';
  const props = generateShapeProps(shape);
  
  switch (shape.type) {
    case 'rect':
      return `${indent}<Rect\n${props}\n${indent}/>`;
    case 'circle':
      return `${indent}<Circle\n${props}\n${indent}/>`;
    case 'ellipse':
      return `${indent}<Ellipse\n${props}\n${indent}/>`;
    case 'line':
      return `${indent}<Line\n${props}\n${indent}/>`;
    case 'text':
      return `${indent}<Text\n${props}\n${indent}/>`;
    default:
      return '';
  }
}

function generateShapeProps(shape: Shape): string {
  const indent = '          ';
  const props: string[] = [];
  
  // Common props
  props.push(`${indent}x={${shape.x}}`);
  props.push(`${indent}y={${shape.y}}`);
  
  if (shape.fill) props.push(`${indent}fill="${shape.fill}"`);
  if (shape.stroke) props.push(`${indent}stroke="${shape.stroke}"`);
  if (shape.strokeWidth) props.push(`${indent}strokeWidth={${shape.strokeWidth}}`);
  if (shape.opacity !== undefined && shape.opacity !== 1) props.push(`${indent}opacity={${shape.opacity}}`);
  if (shape.rotation) props.push(`${indent}rotation={${shape.rotation}}`);
  if (shape.scaleX !== undefined && shape.scaleX !== 1) props.push(`${indent}scaleX={${shape.scaleX}}`);
  if (shape.scaleY !== undefined && shape.scaleY !== 1) props.push(`${indent}scaleY={${shape.scaleY}}`);
  
  // Shape-specific props
  switch (shape.type) {
    case 'rect':
      props.push(`${indent}width={${shape.width}}`);
      props.push(`${indent}height={${shape.height}}`);
      if (shape.cornerRadius) props.push(`${indent}cornerRadius={${shape.cornerRadius}}`);
      break;
    case 'circle':
      props.push(`${indent}radius={${shape.radius}}`);
      break;
    case 'ellipse':
      props.push(`${indent}radiusX={${shape.radiusX}}`);
      props.push(`${indent}radiusY={${shape.radiusY}}`);
      break;
    case 'line':
      props.push(`${indent}points={[${shape.points.join(', ')}]}`);
      if (shape.closed) props.push(`${indent}closed`);
      break;
    case 'text':
      props.push(`${indent}text="${shape.text}"`);
      if (shape.fontSize) props.push(`${indent}fontSize={${shape.fontSize}}`);
      if (shape.fontFamily) props.push(`${indent}fontFamily="${shape.fontFamily}"`);
      if (shape.fontStyle) props.push(`${indent}fontStyle="${shape.fontStyle}"`);
      if (shape.align) props.push(`${indent}align="${shape.align}"`);
      if (shape.width) props.push(`${indent}width={${shape.width}}`);
      break;
  }
  
  return props.join('\n');
}