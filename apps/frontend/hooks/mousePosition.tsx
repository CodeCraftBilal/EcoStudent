import React, { useEffect } from 'react'
import { useState } from 'react'

export interface MousePosition {
    x: number;
    y: number;
    deltaX: number;
    deltaY: number;
    isDragging: boolean;
}

interface UseMousePositionProps {
    includeDelta?: boolean;
}

const useMousePosition = (props?: UseMousePositionProps) => {
    const [mousePosition, setMousePosition] = useState<MousePosition>({
        x: 0, 
        y: 0, 
        deltaX: 0, 
        deltaY: 0,
        isDragging: false
    });
    
    const [prevPosition, setPrevPosition] = useState<{x: number, y: number}>({x: 0, y: 0});

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition(prev => {
                const deltaX = props?.includeDelta ? ev.clientX - prevPosition.x : 0;
                const deltaY = props?.includeDelta ? ev.clientY - prevPosition.y : 0;
                
                return {
                    x: ev.clientX,
                    y: ev.clientY,
                    deltaX,
                    deltaY,
                    isDragging: prev.isDragging
                }
            });
            
            setPrevPosition({x: ev.clientX, y: ev.clientY});
        }

        window.addEventListener('mousemove', updateMousePosition);

        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        }
    }, [props?.includeDelta, prevPosition]);

    const startDragging = () => {
        setMousePosition(prev => ({...prev, isDragging: true}));
    }

    const stopDragging = () => {
        setMousePosition(prev => ({...prev, isDragging: false}));
    }

    return {
        ...mousePosition,
        startDragging,
        stopDragging
    };
}

export default useMousePosition;