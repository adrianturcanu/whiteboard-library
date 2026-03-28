export function createWhiteboardSocket(config) {
    return {
        attachWhiteboard(io, sessionMiddleware) {
            const wbNs = io.of('/whiteboard');
            // Session middleware for web auth
            wbNs.use((socket, next) => {
                const req = socket.request;
                const res = {};
                sessionMiddleware(req, res, next);
            });
            // Auth middleware
            wbNs.use((socket, next) => {
                // 1. Check JWT (mobile)
                const jwtToken = socket.handshake.auth?.token;
                if (jwtToken && config.jwt?.verifyAccessToken) {
                    const decoded = config.jwt.verifyAccessToken(jwtToken);
                    if (decoded && decoded.sub) {
                        socket.userType = decoded.userType;
                        socket.userId = decoded.sub;
                        socket.userName = '';
                        return next();
                    }
                    return next(new Error('Invalid token'));
                }
                // 2. Session auth (web)
                const session = socket.request.session;
                if (!session)
                    return next(new Error('No session'));
                const adminUser = session[config.session.adminSessionKey];
                const portalUser = session[config.session.portalSessionKey];
                const requestedType = socket.handshake.query.userType;
                if (requestedType === 'portal' && portalUser?.id) {
                    socket.userType = 'portal';
                    socket.userId = portalUser.id;
                    return next();
                }
                if (adminUser?.id) {
                    socket.userType = 'admin';
                    socket.userId = adminUser.id;
                    return next();
                }
                if (portalUser?.id) {
                    socket.userType = 'portal';
                    socket.userId = portalUser.id;
                    return next();
                }
                return next(new Error('Unauthorized'));
            });
            const rooms = new Map();
            wbNs.on('connection', (socket) => {
                const userKey = `${socket.userType}:${socket.userId}`;
                let currentRoom = null;
                console.log(`Whiteboard: ${userKey} connected`);
                socket.on('whiteboard:join', ({ notebookId, pageId }) => {
                    // Leave previous room
                    if (currentRoom) {
                        socket.leave(currentRoom);
                        const members = rooms.get(currentRoom);
                        if (members) {
                            members.delete(userKey);
                            if (members.size === 0)
                                rooms.delete(currentRoom);
                        }
                    }
                    // Join new room
                    currentRoom = pageId ? `notebook:${notebookId}:page:${pageId}` : `session:${notebookId}`;
                    socket.join(currentRoom);
                    if (!rooms.has(currentRoom))
                        rooms.set(currentRoom, new Set());
                    rooms.get(currentRoom).add(userKey);
                    // Notify others in room
                    socket.to(currentRoom).emit('whiteboard:user-joined', { userKey });
                    // Send current participants to joiner
                    socket.emit('whiteboard:participants', {
                        participants: Array.from(rooms.get(currentRoom) || []),
                    });
                });
                socket.on('whiteboard:leave', () => {
                    if (currentRoom) {
                        socket.leave(currentRoom);
                        const members = rooms.get(currentRoom);
                        if (members) {
                            members.delete(userKey);
                            if (members.size === 0)
                                rooms.delete(currentRoom);
                        }
                        socket.to(currentRoom).emit('whiteboard:user-left', { userKey });
                        currentRoom = null;
                    }
                });
                // Relay drawing events to room (exclude sender)
                socket.on('whiteboard:stroke', (data) => {
                    if (currentRoom)
                        socket.to(currentRoom).emit('whiteboard:stroke', { ...data, userKey });
                });
                socket.on('whiteboard:erase', (data) => {
                    if (currentRoom)
                        socket.to(currentRoom).emit('whiteboard:erase', { ...data, userKey });
                });
                socket.on('whiteboard:clear-page', (data) => {
                    if (currentRoom)
                        socket.to(currentRoom).emit('whiteboard:clear-page', { ...data, userKey });
                });
                socket.on('whiteboard:cursor', (data) => {
                    if (currentRoom)
                        socket.to(currentRoom).emit('whiteboard:cursor', { ...data, userKey });
                });
                socket.on('disconnect', () => {
                    if (currentRoom) {
                        const members = rooms.get(currentRoom);
                        if (members) {
                            members.delete(userKey);
                            if (members.size === 0)
                                rooms.delete(currentRoom);
                        }
                        socket.to(currentRoom).emit('whiteboard:user-left', { userKey });
                    }
                    console.log(`Whiteboard: ${userKey} disconnected`);
                });
            });
        },
    };
}
//# sourceMappingURL=whiteboardSocket.js.map