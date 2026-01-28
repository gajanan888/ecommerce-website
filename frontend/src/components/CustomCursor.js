import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CustomCursor() {
    const [isHovering, setIsHovering] = useState(false);
    const cursorX = useMotionValue(-100);
    const cursorY = useMotionValue(-100);

    const springConfig = { damping: 25, stiffness: 200 };
    const followerX = useSpring(cursorX, springConfig);
    const followerY = useSpring(cursorY, springConfig);

    useEffect(() => {
        const moveCursor = (e) => {
            const target = e.target;
            const interactive = target.closest('button') || target.closest('a');

            if (interactive) {
                const rect = interactive.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;

                const distX = e.clientX - centerX;
                const distY = e.clientY - centerY;

                // Subtle magnetic pull
                cursorX.set(e.clientX - distX * 0.15);
                cursorY.set(e.clientY - distY * 0.15);
            } else {
                cursorX.set(e.clientX);
                cursorY.set(e.clientY);
            }
        };

        const handleHover = (e) => {
            const target = e.target;
            setIsHovering(!!(target.closest('button') || target.closest('a') || target.classList.contains('cursor-pointer')));
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleHover);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleHover);
        };
    }, [cursorX, cursorY]);

    return (
        <>
            {/* Main Small Dot */}
            <motion.div
                className="custom-cursor hidden md:block"
                style={{
                    x: cursorX,
                    y: cursorY,
                    translateX: '-50%',
                    translateY: '-50%',
                    backgroundColor: 'white',
                    zIndex: 9999,
                }}
                animate={{
                    scale: isHovering ? 0 : 1,
                }}
            />

            {/* Subtle Follower */}
            <motion.div
                className="cursor-follower hidden md:block"
                style={{
                    x: followerX,
                    y: followerY,
                    translateX: '-50%',
                    translateY: '-50%',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    zIndex: 9998,
                }}
                animate={{
                    scale: isHovering ? 2 : 1,
                    backgroundColor: isHovering ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                }}
            />
        </>
    );
}
