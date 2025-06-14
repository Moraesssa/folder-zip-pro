
import { useState, useEffect } from 'react';

interface ConversionLogicState {
  isConversionPopupOpen: boolean;
  conversionTrigger: 'time' | 'action' | 'exit' | 'idle';
  hasShownTimePopup: boolean;
  userIdleTime: number;
}

export const useConversionLogic = (isAuthenticated: boolean) => {
  const [state, setState] = useState<ConversionLogicState>({
    isConversionPopupOpen: false,
    conversionTrigger: 'time',
    hasShownTimePopup: false,
    userIdleTime: 0
  });

  useEffect(() => {
    // Time-based popup (5 minutes)
    const timePopupTimer = setTimeout(() => {
      if (!isAuthenticated && !state.hasShownTimePopup) {
        setState(prev => ({
          ...prev,
          conversionTrigger: 'time',
          isConversionPopupOpen: true,
          hasShownTimePopup: true
        }));
      }
    }, 5 * 60 * 1000); // 5 minutes

    // Idle detection
    let idleTimer: NodeJS.Timeout;
    const resetIdleTimer = () => {
      setState(prev => ({ ...prev, userIdleTime: 0 }));
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setState(prev => {
          const newIdleTime = prev.userIdleTime + 1;
          if (newIdleTime > 2 && !isAuthenticated) {
            return {
              ...prev,
              userIdleTime: newIdleTime,
              conversionTrigger: 'idle',
              isConversionPopupOpen: true
            };
          }
          return { ...prev, userIdleTime: newIdleTime };
        });
      }, 30000); // 30 seconds
    };

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isAuthenticated) {
        setState(prev => ({
          ...prev,
          conversionTrigger: 'exit',
          isConversionPopupOpen: true
        }));
      }
    };

    document.addEventListener('mousemove', resetIdleTimer);
    document.addEventListener('mousedown', resetIdleTimer);
    document.addEventListener('keypress', resetIdleTimer);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearTimeout(timePopupTimer);
      clearTimeout(idleTimer);
      document.removeEventListener('mousemove', resetIdleTimer);
      document.removeEventListener('mousedown', resetIdleTimer);
      document.removeEventListener('keypress', resetIdleTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isAuthenticated, state.hasShownTimePopup, state.userIdleTime]);

  const closeConversionPopup = () => {
    setState(prev => ({ ...prev, isConversionPopupOpen: false }));
  };

  const triggerActionBasedPopup = () => {
    const compressionCount = parseInt(localStorage.getItem('compressionCount') || '0');
    if (compressionCount >= 2 && !isAuthenticated) {
      setState(prev => ({
        ...prev,
        conversionTrigger: 'action',
        isConversionPopupOpen: true
      }));
    }
  };

  return {
    ...state,
    closeConversionPopup,
    triggerActionBasedPopup
  };
};
