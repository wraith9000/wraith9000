import React from 'react';
import Image from 'next/image';

// Responsive corner sizes based on screen size
const getCornerSize = (width: number) => {
    if (width < 480) return 80; // Small mobile
    if (width < 768) return 120; // Mobile
    if (width < 1024) return 140; // Tablet
    return 162; // Desktop
};

const getLineThickness = (width: number) => {
    if (width < 480) return 4; // Small mobile
    if (width < 768) return 5; // Mobile
    return 6; // Desktop
};

const getLineOffset = (width: number) => {
    if (width < 480) return 4; // Small mobile
    if (width < 768) return 5; // Mobile
    return 6; // Desktop
};

const Frame: React.FC = () => {
    const [cornerSize, setCornerSize] = React.useState(162);
    const [lineThickness, setLineThickness] = React.useState(6);
    const [lineOffset, setLineOffset] = React.useState(6);
    const [screenWidth, setScreenWidth] = React.useState(1024);

    React.useEffect(() => {
        const updateFrameSize = () => {
            const width = window.innerWidth;
            setScreenWidth(width);
            setCornerSize(getCornerSize(width));
            setLineThickness(getLineThickness(width));
            setLineOffset(getLineOffset(width));
        };

        updateFrameSize();
        window.addEventListener('resize', updateFrameSize);
        return () => window.removeEventListener('resize', updateFrameSize);
    }, []);

    const shouldHide = screenWidth < 360;

    return (
        <>
            {/* Corners */}
            <Image
                src="/assets/frame/edge-tl.svg"
                alt="top left corner"
                width={cornerSize}
                height={cornerSize}
                priority
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 1000,
                    pointerEvents: 'none',
                    // Hide on very small screens to avoid interference
                    display: shouldHide ? 'none' : 'block'
                }}
            />
            <Image
                src="/assets/frame/edge-tr.svg"
                alt="top right corner"
                width={cornerSize}
                height={cornerSize}
                priority
                style={{
                    position: 'fixed',
                    top: 0,
                    right: 0,
                    zIndex: 1000,
                    pointerEvents: 'none',
                    display: shouldHide ? 'none' : 'block'
                }}
            />
            <Image
                src="/assets/frame/edge-bl.svg"
                alt="bottom left corner"
                width={cornerSize}
                height={cornerSize}
                priority
                style={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    zIndex: 1000,
                    pointerEvents: 'none',
                    display: shouldHide ? 'none' : 'block'
                }}
            />
            <Image
                src="/assets/frame/edge-br.svg"
                alt="bottom right corner"
                width={cornerSize}
                height={cornerSize}
                priority
                style={{
                    position: 'fixed',
                    bottom: 0,
                    right: 0,
                    zIndex: 1000,
                    pointerEvents: 'none',
                    display: shouldHide ? 'none' : 'block'
                }}
            />

            {/* Top border */}
            <div
                style={{
                    position: 'fixed',
                    top: lineOffset,
                    left: cornerSize - lineOffset,
                    right: cornerSize - lineOffset,
                    height: lineThickness,
                    background: '#2EFFBF',
                    zIndex: 999,
                    pointerEvents: 'none',
                    display: shouldHide ? 'none' : 'block'
                }}
            />

            {/* Bottom border */}
            <div
                style={{
                    position: 'fixed',
                    bottom: lineOffset,
                    left: cornerSize - lineOffset,
                    right: cornerSize - lineOffset,
                    height: lineThickness,
                    background: '#2EFFBF',
                    zIndex: 999,
                    pointerEvents: 'none',
                    display: shouldHide ? 'none' : 'block'
                }}
            />

            {/* Left border */}
            <div
                style={{
                    position: 'fixed',
                    top: cornerSize - lineOffset,
                    bottom: cornerSize - lineOffset,
                    left: lineOffset,
                    width: lineThickness,
                    background: '#2EFFBF',
                    zIndex: 999,
                    pointerEvents: 'none',
                    display: shouldHide ? 'none' : 'block'
                }}
            />

            {/* Right border */}
            <div
                style={{
                    position: 'fixed',
                    top: cornerSize - lineOffset,
                    bottom: cornerSize - lineOffset,
                    right: lineOffset,
                    width: lineThickness,
                    background: '#2EFFBF',
                    zIndex: 999,
                    pointerEvents: 'none',
                    display: shouldHide ? 'none' : 'block'
                }}
            />
        </>
    );
};

export default Frame; 