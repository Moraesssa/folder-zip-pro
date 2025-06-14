
import { useState, useEffect, useCallback } from 'react';

export type ConversionTrigger = 'time' | 'action' | 'exit';

export const useConversionLogic = (isAuthenticated: boolean) => {
  const [isConversionPopupOpen, setIsConversionPopupOpen] = useState(false);
  const [conversionTrigger, setConversionTrigger] = useState<ConversionTrigger>('time');

  // Trigger baseado em tempo (5 minutos na página)
  useEffect(() => {
    if (isAuthenticated) return;

    const timer = setTimeout(() => {
      setConversionTrigger('time');
      setIsConversionPopupOpen(true);
    }, 5 * 60 * 1000); // 5 minutos

    return () => clearTimeout(timer);
  }, [isAuthenticated]);

  // Trigger baseado em intent de saída
  useEffect(() => {
    if (isAuthenticated) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setConversionTrigger('exit');
        setIsConversionPopupOpen(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [isAuthenticated]);

  const triggerActionBasedPopup = useCallback(() => {
    if (isAuthenticated) return;

    // Verificar se já mostrou popup recentemente
    const lastShown = localStorage.getItem('zipfast_last_popup');
    const now = Date.now();
    
    if (lastShown && now - parseInt(lastShown) < 10 * 60 * 1000) {
      return; // Não mostrar se foi há menos de 10 minutos
    }

    setConversionTrigger('action');
    setIsConversionPopupOpen(true);
    localStorage.setItem('zipfast_last_popup', now.toString());
  }, [isAuthenticated]);

  const closeConversionPopup = useCallback(() => {
    setIsConversionPopupOpen(false);
  }, []);

  return {
    isConversionPopupOpen,
    conversionTrigger,
    closeConversionPopup,
    triggerActionBasedPopup
  };
};
