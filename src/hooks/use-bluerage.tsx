import { useEffect, useState } from 'react';

// Define the safe area insets type
interface SafeAreaInsets {
    top: number;
    left: number;
    right: number;
    bottom: number;
}

// Default safe area insets
const defaultInsets: SafeAreaInsets = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
};

declare global {
    interface Window {
        Bluerage: {
            WebApp: Record<string, any> & {
                MiniAppChatCompletions?: (data: any) => void;
                MiniAppInit?: (data: any) => void;
            };
            WebView: {
                onEvent: (event: string, callback: (eventData: any) => void) => void;
                receiveEvent?: (eventData: any) => void;
            };
        };
        webkit?: {
            messageHandlers: Record<string, {
                postMessage: (data: any) => void;
            }>;
        };
        BluerageWebViewProxy?: {
            postEvent: (eventName: string, eventData: any) => void;
        };
    }
}

export const useBluerage = () => {
    const [error, setError] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);
    const [safeAreaInsets, setSafeAreaInsets] = useState<SafeAreaInsets>(defaultInsets);

    useEffect(() => {
        // Check if Bluerage.WebView exists
        if (!window.Bluerage?.WebView) {
            console.error('Bluerage WebView is not initialized');
            setError('Bluerage WebView is not initialized');
            return;
        }

        // Define a handler function that will process events from the Bluerage platform
        const handleEvent = (eventData: any) => {
            console.log('Received event:', eventData);

            if (eventData?.type === 'MiniAppInitResult') {
                console.log('MiniAppInit successful:', eventData);
                setIsInitialized(true);
            } else if (eventData?.type === 'MiniAppDidUpdateConfig') {
                console.log('Received config update:', eventData);

                const data = eventData.data;
                if (data && data.safe_area_insets) {
                    const insets = data.safe_area_insets;
                    console.log('Updating safe area insets:', insets);

                    setSafeAreaInsets({
                        top: Number(insets.top) || 0,
                        left: Number(insets.left) || 0,
                        right: Number(insets.right) || 0,
                        bottom: Number(insets.bottom) || 0
                    });
                }
            }
        };

        window.Bluerage.WebView.onEvent('receiveEvent', handleEvent);

        window.Bluerage.WebView.receiveEvent = handleEvent;

        const initializeApp = () => {
            const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

            const requestPayload = {
                request_id: requestId
            };

            if (window.BluerageWebViewProxy?.postEvent) {
                try {
                    window.BluerageWebViewProxy.postEvent('MiniAppInit', requestPayload);
                } catch (error) {
                    console.error('Error sending MiniAppInit:', error);
                }
                return;
            }

            if (window.Bluerage?.WebApp) {
                try {
                    // Try to use the method dynamically if it exists
                    if (typeof window.Bluerage.WebApp.MiniAppInit === 'function') {
                        window.Bluerage.WebApp.MiniAppInit(requestPayload);
                    } else {
                        console.error('MiniAppInit method not found');
                    }
                } catch (error) {
                    console.error('Error sending MiniAppInit:', error);
                }
            } else {
                console.error('Bluerage WebApp is not initialized');
            }
        };

        const timer = setTimeout(() => {
            if (!isInitialized) {
                initializeApp();
            }
        }, 500);

        return () => {
            clearTimeout(timer);
            if (window.Bluerage?.WebView) {
                window.Bluerage.WebView.receiveEvent = () => { };
            }
        };
    }, [isInitialized]);

    return {
        error,
        isInitialized,
        safeAreaInsets,
    };
};