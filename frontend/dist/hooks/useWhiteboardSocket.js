import { useRef, useState, useEffect, useCallback } from 'react';
export function useWhiteboardSocket({ socketUrl, enabled, auth, query, }) {
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        if (!enabled || !socketUrl)
            return;
        // Dynamic import to avoid bundling socket.io-client in SSR
        let cancelled = false;
        import('socket.io-client').then(({ io }) => {
            if (cancelled)
                return;
            const socket = io(`${socketUrl}/whiteboard`, {
                auth,
                query,
                transports: ['websocket', 'polling'],
                withCredentials: true,
            });
            socketRef.current = socket;
            socket.on('connect', () => {
                if (!cancelled)
                    setConnected(true);
            });
            socket.on('disconnect', () => {
                if (!cancelled)
                    setConnected(false);
            });
            socket.on('connect_error', (err) => {
                console.error('Whiteboard socket connect error:', err.message);
            });
        });
        return () => {
            cancelled = true;
            if (socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
            setConnected(false);
        };
    }, [socketUrl, enabled, auth, query]);
    const emit = useCallback((event, data) => {
        socketRef.current?.emit(event, data);
    }, []);
    const on = useCallback((event, handler) => {
        socketRef.current?.on(event, handler);
    }, []);
    const off = useCallback((event, handler) => {
        socketRef.current?.off(event, handler);
    }, []);
    const joinRoom = useCallback((notebookId, pageId) => {
        socketRef.current?.emit('whiteboard:join', { notebookId, pageId });
    }, []);
    const leaveRoom = useCallback(() => {
        socketRef.current?.emit('whiteboard:leave');
    }, []);
    return { connected, emit, on, off, joinRoom, leaveRoom };
}
//# sourceMappingURL=useWhiteboardSocket.js.map