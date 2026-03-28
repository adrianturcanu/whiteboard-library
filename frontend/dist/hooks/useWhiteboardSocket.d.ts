interface UseWhiteboardSocketOptions {
    socketUrl: string;
    enabled: boolean;
    auth?: Record<string, unknown>;
    query?: Record<string, string>;
}
interface UseWhiteboardSocketReturn {
    connected: boolean;
    emit: (event: string, data?: unknown) => void;
    on: (event: string, handler: (...args: any[]) => void) => void;
    off: (event: string, handler: (...args: any[]) => void) => void;
    joinRoom: (notebookId: string, pageId?: string) => void;
    leaveRoom: () => void;
}
export declare function useWhiteboardSocket({ socketUrl, enabled, auth, query, }: UseWhiteboardSocketOptions): UseWhiteboardSocketReturn;
export {};
//# sourceMappingURL=useWhiteboardSocket.d.ts.map