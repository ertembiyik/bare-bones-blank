// Global type declarations

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