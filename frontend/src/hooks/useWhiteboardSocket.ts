import { useRef, useState, useEffect, useCallback } from 'react';
import type { Socket } from 'socket.io-client';

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

export function useWhiteboardSocket({
  socketUrl,
  enabled,
  auth,
  query,
}: UseWhiteboardSocketOptions): UseWhiteboardSocketReturn {
  const socketRef = useRef<Socket | null>(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!enabled || !socketUrl) return;

    // Dynamic import to avoid bundling socket.io-client in SSR
    let cancelled = false;

    import('socket.io-client').then(({ io }) => {
      if (cancelled) return;

      const socket = io(`${socketUrl}/whiteboard`, {
        auth,
        query,
        transports: ['websocket', 'polling'],
        withCredentials: true,
      });

      socketRef.current = socket;

      socket.on('connect', () => {
        if (!cancelled) setConnected(true);
      });

      socket.on('disconnect', () => {
        if (!cancelled) setConnected(false);
      });

      socket.on('connect_error', (err: Error) => {
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

  const emit = useCallback((event: string, data?: unknown) => {
    socketRef.current?.emit(event, data);
  }, []);

  const on = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.on(event, handler);
  }, []);

  const off = useCallback((event: string, handler: (...args: any[]) => void) => {
    socketRef.current?.off(event, handler);
  }, []);

  const joinRoom = useCallback((notebookId: string, pageId?: string) => {
    socketRef.current?.emit('whiteboard:join', { notebookId, pageId });
  }, []);

  const leaveRoom = useCallback(() => {
    socketRef.current?.emit('whiteboard:leave');
  }, []);

  return { connected, emit, on, off, joinRoom, leaveRoom };
}
