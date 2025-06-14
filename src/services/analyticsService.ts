
export interface AnalyticsEvent {
  event: string;
  category: string;
  action: string;
  label?: string;
  value?: number;
  userId?: string;
  timestamp: number;
  properties?: Record<string, any>;
}

export interface UserSession {
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  events: AnalyticsEvent[];
  userAgent: string;
  referrer: string;
}

// Declare gtag globally to avoid TypeScript errors
declare global {
  function gtag(...args: any[]): void;
}

export class AnalyticsService {
  private events: AnalyticsEvent[] = [];
  private session: UserSession;

  constructor() {
    this.session = {
      sessionId: this.generateSessionId(),
      startTime: Date.now(),
      events: [],
      userAgent: navigator.userAgent,
      referrer: document.referrer
    };
    
    // Rastrear eventos de página
    this.trackPageView();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  track(event: string, category: string, action: string, label?: string, value?: number, properties?: Record<string, any>): void {
    const analyticsEvent: AnalyticsEvent = {
      event,
      category,
      action,
      label,
      value,
      timestamp: Date.now(),
      properties
    };

    this.events.push(analyticsEvent);
    this.session.events.push(analyticsEvent);
    
    console.log('Analytics Event:', analyticsEvent);
    
    // Simular envio para Google Analytics
    this.sendToGA(analyticsEvent);
  }

  trackPageView(page?: string): void {
    this.track('page_view', 'navigation', 'view', page || window.location.pathname);
  }

  trackFileUpload(fileCount: number, totalSize: number): void {
    this.track('file_upload', 'compression', 'upload', `${fileCount}_files`, totalSize, {
      fileCount,
      totalSize
    });
  }

  trackCompression(fileCount: number, originalSize: number, compressedSize: number, compressionRatio: number): void {
    this.track('compression_complete', 'compression', 'complete', `${compressionRatio}%_savings`, compressedSize, {
      fileCount,
      originalSize,
      compressedSize,
      compressionRatio
    });
  }

  trackDownload(filename: string, size: number): void {
    this.track('file_download', 'compression', 'download', filename, size);
  }

  trackAdClick(adId: string, placement: string): void {
    this.track('ad_click', 'monetization', 'click', adId, 1, {
      adId,
      placement
    });
  }

  trackConversion(type: 'signup' | 'upgrade' | 'affiliate', value?: number): void {
    this.track('conversion', 'monetization', type, undefined, value, {
      conversionType: type
    });
  }

  trackUserAction(action: string, details?: Record<string, any>): void {
    this.track('user_action', 'engagement', action, undefined, undefined, details);
  }

  private sendToGA(event: AnalyticsEvent): void {
    // Simular envio para Google Analytics
    if (typeof window !== 'undefined' && typeof gtag !== 'undefined') {
      gtag('event', event.action, {
        event_category: event.category,
        event_label: event.label,
        value: event.value,
        custom_map: event.properties
      });
    }
  }

  getSessionStats() {
    return {
      sessionId: this.session.sessionId,
      duration: Date.now() - this.session.startTime,
      eventCount: this.session.events.length,
      events: this.session.events
    };
  }

  getUserJourney() {
    return this.session.events.map(event => ({
      timestamp: event.timestamp,
      action: `${event.category}:${event.action}`,
      label: event.label,
      properties: event.properties
    }));
  }
}

export const analyticsService = new AnalyticsService();
