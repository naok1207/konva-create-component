import { create } from 'zustand';
import { AppState, Shape, Layer, ShapeType, Stage, GroupShape } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface StoreActions {
  setSelectedTool: (tool: ShapeType | 'select') => void;
  setSelectedShapeId: (id: string | null) => void;
  setSelectedLayerId: (id: string | null) => void;
  setGridSize: (size: number) => void;
  toggleSnapToGrid: () => void;
  toggleShowGrid: () => void;
  toggleShowRuler: () => void;
  setStageSize: (width: number, height: number) => void;
  setStage: (stage: Stage) => void;
  addLayer: (name?: string) => void;
  deleteLayer: (id: string) => void;
  toggleLayerVisibility: (id: string) => void;
  toggleLayerLock: (id: string) => void;
  addShape: (shape: Omit<Shape, 'id'>) => void;
  updateShape: (id: string, updates: Partial<Shape>) => void;
  deleteShape: (id: string) => void;
}

const initialState: AppState = {
  stage: {
    width: 800,
    height: 600,
    layers: [
      {
        id: uuidv4(),
        name: 'Layer 1',
        visible: true,
        locked: false,
        shapes: []
      }
    ]
  },
  selectedTool: 'select',
  selectedShapeId: null,
  selectedLayerId: null,
  gridSize: 8,
  snapToGrid: true,
  showGrid: true,
  showRuler: true
};

export const useStore = create<AppState & StoreActions>((set, get) => ({
  ...initialState,

  setSelectedTool: (tool) => set({ selectedTool: tool }),
  setSelectedShapeId: (id) => set({ selectedShapeId: id }),
  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setGridSize: (size) => set({ gridSize: size }),
  toggleSnapToGrid: () => set((state) => ({ snapToGrid: !state.snapToGrid })),
  toggleShowGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleShowRuler: () => set((state) => ({ showRuler: !state.showRuler })),

  setStageSize: (width, height) => 
    set((state) => ({
      stage: { ...state.stage, width, height }
    })),

  setStage: (stage) => set({ stage }),

  addLayer: (name) => {
    const newLayer: Layer = {
      id: uuidv4(),
      name: name || `Layer ${get().stage.layers.length + 1}`,
      visible: true,
      locked: false,
      shapes: []
    };
    set((state) => ({
      stage: {
        ...state.stage,
        layers: [...state.stage.layers, newLayer]
      },
      selectedLayerId: newLayer.id
    }));
  },

  deleteLayer: (id) => {
    const layers = get().stage.layers;
    if (layers.length <= 1) return; // Keep at least one layer
    
    set((state) => ({
      stage: {
        ...state.stage,
        layers: state.stage.layers.filter((layer) => layer.id !== id)
      },
      selectedLayerId: state.selectedLayerId === id ? layers[0]?.id || null : state.selectedLayerId
    }));
  },

  toggleLayerVisibility: (id) => {
    set((state) => ({
      stage: {
        ...state.stage,
        layers: state.stage.layers.map((layer) =>
          layer.id === id ? { ...layer, visible: !layer.visible } : layer
        )
      }
    }));
  },

  toggleLayerLock: (id) => {
    set((state) => ({
      stage: {
        ...state.stage,
        layers: state.stage.layers.map((layer) =>
          layer.id === id ? { ...layer, locked: !layer.locked } : layer
        )
      }
    }));
  },

  addShape: (shape) => {
    const layerId = get().selectedLayerId || get().stage.layers[0]?.id;
    if (!layerId) return;

    const newShape = { ...shape, id: uuidv4() } as Shape;
    
    set((state) => ({
      stage: {
        ...state.stage,
        layers: state.stage.layers.map((layer) =>
          layer.id === layerId
            ? { ...layer, shapes: [...layer.shapes, newShape] }
            : layer
        )
      },
      selectedShapeId: newShape.id
    }));
  },

  updateShape: (id, updates) => {
    const updateShapeRecursive = (shapes: (Shape | GroupShape)[]): (Shape | GroupShape)[] => {
      return shapes.map((shape) => {
        if (shape.id === id) {
          return { ...shape, ...updates };
        }
        if (shape.type === 'group') {
          return {
            ...shape,
            children: updateShapeRecursive(shape.children)
          };
        }
        return shape;
      });
    };

    set((state) => ({
      stage: {
        ...state.stage,
        layers: state.stage.layers.map((layer) => ({
          ...layer,
          shapes: updateShapeRecursive(layer.shapes)
        }))
      }
    }));
  },

  deleteShape: (id) => {
    const deleteShapeRecursive = (shapes: (Shape | GroupShape)[]): (Shape | GroupShape)[] => {
      return shapes.filter(shape => shape.id !== id).map(shape => {
        if (shape.type === 'group') {
          return {
            ...shape,
            children: deleteShapeRecursive(shape.children)
          };
        }
        return shape;
      });
    };

    set((state) => ({
      stage: {
        ...state.stage,
        layers: state.stage.layers.map((layer) => ({
          ...layer,
          shapes: deleteShapeRecursive(layer.shapes)
        }))
      },
      selectedShapeId: state.selectedShapeId === id ? null : state.selectedShapeId
    }));
  }
}));