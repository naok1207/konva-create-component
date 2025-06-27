import { useState, useCallback } from 'react';
import { useStore } from '../store/useStore';
import { v4 as uuidv4 } from 'uuid';
import { GroupShape } from '../types';

export function useGroupSelection() {
  const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
  const { stage, addShape, deleteShape, setSelectedShapeId } = useStore();

  const toggleShapeSelection = useCallback((shapeId: string) => {
    setSelectedShapeIds(prev => {
      if (prev.includes(shapeId)) {
        return prev.filter(id => id !== shapeId);
      } else {
        return [...prev, shapeId];
      }
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedShapeIds([]);
  }, []);

  const createGroup = useCallback(() => {
    if (selectedShapeIds.length < 2) return;

    // Find all selected shapes
    const allShapes = stage.layers.flatMap(layer => layer.shapes);
    const selectedShapes = allShapes.filter(shape => selectedShapeIds.includes(shape.id));

    if (selectedShapes.length === 0) return;

    // Calculate group bounds
    let minX = Infinity, minY = Infinity;
    selectedShapes.forEach(shape => {
      minX = Math.min(minX, shape.x);
      minY = Math.min(minY, shape.y);
    });

    // Create group with relative positions
    const group: Omit<GroupShape, 'id'> = {
      type: 'group',
      x: minX,
      y: minY,
      children: selectedShapes.map(shape => ({
        ...shape,
        x: shape.x - minX,
        y: shape.y - minY,
      })),
      draggable: true,
      visible: true,
    };

    // Add group to stage
    addShape(group);

    // Remove original shapes
    selectedShapeIds.forEach(id => deleteShape(id));

    // Clear selection
    clearSelection();
  }, [selectedShapeIds, stage, addShape, deleteShape, clearSelection]);

  const ungroupSelectedGroup = useCallback((groupId: string) => {
    const allShapes = stage.layers.flatMap(layer => layer.shapes);
    const group = allShapes.find(shape => shape.id === groupId && shape.type === 'group') as GroupShape | undefined;

    if (!group) return;

    // Add children back to the stage with absolute positions
    group.children.forEach(child => {
      addShape({
        ...child,
        x: child.x + group.x,
        y: child.y + group.y,
      });
    });

    // Remove the group
    deleteShape(groupId);
    setSelectedShapeId(null);
  }, [stage, addShape, deleteShape, setSelectedShapeId]);

  return {
    selectedShapeIds,
    toggleShapeSelection,
    clearSelection,
    createGroup,
    ungroupSelectedGroup,
  };
}