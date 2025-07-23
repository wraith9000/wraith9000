import React, { useEffect, useState } from 'react';

interface MobileOptimizerProps {
    children: React.ReactNode;
}

// Extend Navigator interface for battery API
interface NavigatorWithBattery extends Navigator {
    getBattery(): Promise<BatteryManager>;
}

interface BatteryManager extends EventTarget {
    level: number;
    charging: boolean;
    chargingTime: number;
    dischargingTime: number;
}

const MobileOptimizer: React.FC<MobileOptimizerProps> = ({ children }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [isLowPowerMode, setIsLowPowerMode] = useState(false);

    useEffect(() => {
        // Check if device is mobile
        const checkMobile = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            setIsMobile(isMobileDevice);
        };

        // Check for low power mode (iOS)
        const checkLowPowerMode = () => {
            const nav = navigator as NavigatorWithBattery;
            if ('getBattery' in nav) {
                nav.getBattery().then((battery) => {
                    // Note: Low power mode detection is limited in web browsers
                    // This is a basic implementation
                    setIsLowPowerMode(battery.level < 0.2);
                });
            }
        };

        // Check for reduced motion preference
        const checkReducedMotion = () => {
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            if (prefersReducedMotion) {
                document.documentElement.style.setProperty('--reduced-motion', 'true');
            }
        };

        // Check for dark mode preference
        const checkDarkMode = () => {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDarkMode) {
                document.documentElement.style.setProperty('--prefers-dark', 'true');
            }
        };

        // Initialize checks
        checkMobile();
        checkLowPowerMode();
        checkReducedMotion();
        checkDarkMode();

        // Add mobile-specific optimizations
        if (isMobile) {
            // Disable hover effects on mobile
            document.documentElement.style.setProperty('--mobile-hover', 'none');

            // Optimize for mobile performance
            document.documentElement.style.setProperty('--mobile-performance', 'optimized');

            // Add mobile-specific CSS variables
            document.documentElement.style.setProperty('--touch-target-size', '44px');
            document.documentElement.style.setProperty('--mobile-font-size', '16px');
        }

        // Listen for orientation changes
        const handleOrientationChange = () => {
            // Recalculate layout on orientation change
            setTimeout(() => {
                window.dispatchEvent(new Event('resize'));
            }, 100);
        };

        // Listen for battery level changes
        const handleBatteryChange = () => {
            const nav = navigator as NavigatorWithBattery;
            if ('getBattery' in nav) {
                nav.getBattery().then((battery) => {
                    setIsLowPowerMode(battery.level < 0.2);
                });
            }
        };

        // Add event listeners
        window.addEventListener('orientationchange', handleOrientationChange);
        const nav = navigator as NavigatorWithBattery;
        if ('getBattery' in nav) {
            nav.getBattery().then((battery) => {
                battery.addEventListener('levelchange', handleBatteryChange);
            });
        }

        // Cleanup
        return () => {
            window.removeEventListener('orientationchange', handleOrientationChange);
            if ('getBattery' in nav) {
                nav.getBattery().then((battery) => {
                    battery.removeEventListener('levelchange', handleBatteryChange);
                });
            }
        };
    }, [isMobile]);

    // Apply low power mode optimizations
    useEffect(() => {
        if (isLowPowerMode) {
            // Reduce animations and effects in low power mode
            document.documentElement.style.setProperty('--low-power-mode', 'true');
            document.documentElement.style.setProperty('--animation-duration', '0.1s');
            document.documentElement.style.setProperty('--transition-duration', '0.1s');
        } else {
            document.documentElement.style.setProperty('--low-power-mode', 'false');
            document.documentElement.style.setProperty('--animation-duration', '0.3s');
            document.documentElement.style.setProperty('--transition-duration', '0.3s');
        }
    }, [isLowPowerMode]);

    return (
        <div
            className={`mobile-optimizer ${isMobile ? 'mobile' : 'desktop'} ${isLowPowerMode ? 'low-power' : ''}`}
            style={{
                // Mobile-specific optimizations
                WebkitOverflowScrolling: 'touch',
                WebkitTapHighlightColor: 'transparent',
                // Better mobile performance
                willChange: isMobile ? 'auto' : 'auto',
                // Optimize for mobile rendering
                transform: 'translateZ(0)',
            }}
        >
            {children}
        </div>
    );
};

export default MobileOptimizer; 