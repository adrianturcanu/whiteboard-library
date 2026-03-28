import type { WhiteboardConfig } from '../types/whiteboard.js';
interface WhiteboardSocket {
    request: {
        session?: Record<string, any>;
    };
    handshake: {
        auth?: {
            token?: string;
        };
        query: Record<string, string>;
    };
    userType?: string;
    userId?: number | string;
    userName?: string;
    join(room: string): void;
    leave(room: string): void;
    to(room: string): {
        emit(event: string, data?: unknown): void;
    };
    emit(event: string, data?: unknown): void;
    on(event: string, handler: (...args: any[]) => void): void;
}
interface WhiteboardNamespace {
    use(middleware: (socket: WhiteboardSocket, next: (err?: Error) => void) => void): void;
    on(event: string, handler: (socket: WhiteboardSocket) => void): void;
}
interface WhiteboardIO {
    of(namespace: string): WhiteboardNamespace;
}
export declare function createWhiteboardSocket(config: WhiteboardConfig): {
    attachWhiteboard(io: WhiteboardIO, sessionMiddleware: (req: any, res: any, next: (err?: Error) => void) => void): void;
};
export {};
//# sourceMappingURL=whiteboardSocket.d.ts.map