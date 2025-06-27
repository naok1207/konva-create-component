import { useEffect, useRef } from 'react';

interface ResizeHandleProps {
  onResize: (delta: number) => void;
  orientation?: 'vertical' | 'horizontal';
}

function ResizeHandle({ onResize, orientation = 'vertical' }: ResizeHandleProps) {
  const isDragging = useRef(false);
  const startPos = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;

      const delta = orientation === 'vertical' 
        ? e.clientX - startPos.current
        : e.clientY - startPos.current;
      
      onResize(delta);
      
      if (orientation === 'vertical') {
        startPos.current = e.clientX;
      } else {
        startPos.current = e.clientY;
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [onResize, orientation]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startPos.current = orientation === 'vertical' ? e.clientX : e.clientY;
    document.body.style.cursor = orientation === 'vertical' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div
      className={`
        ${orientation === 'vertical' ? 'w-2 h-full cursor-col-resize' : 'h-2 w-full cursor-row-resize'}
        bg-gray-200 hover:bg-gray-300 transition-colors
        flex items-center justify-center
        relative group
      `}
      onMouseDown={handleMouseDown}
    >
      {/* Border lines */}
      <div className={`absolute ${orientation === 'vertical' ? 'inset-y-0 left-0 w-px' : 'inset-x-0 top-0 h-px'} bg-gray-300`} />
      <div className={`absolute ${orientation === 'vertical' ? 'inset-y-0 right-0 w-px' : 'inset-x-0 bottom-0 h-px'} bg-gray-300`} />
      
      {/* Handle indicator */}
      <div
        className={`
          ${orientation === 'vertical' ? 'w-1 h-12' : 'h-1 w-12'}
          bg-gray-400 group-hover:bg-gray-500
          rounded-full transition-colors
        `}
      />
    </div>
  );
}

export default ResizeHandle;