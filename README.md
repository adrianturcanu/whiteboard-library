# @whiteboard/library

Shared whiteboard library providing types, state management, Socket.io server integration, and React hooks for collaborative whiteboard functionality.

## Structure

```
whiteboard-library/
├── src/                          # Backend / platform-agnostic code
│   ├── types/whiteboard.ts       # Shared types (Stroke, Page, Notebook, etc.)
│   ├── services/whiteboardSocket.ts  # Socket.io server-side namespace handler
│   ├── state/whiteboardReducer.ts    # Platform-agnostic reducer for whiteboard state
│   └── utils/page.ts             # Utility functions (ID generation, blank page/notebook)
├── frontend/                     # React hooks and frontend types
│   └── src/
│       ├── hooks/useWhiteboard.ts       # React hook wrapping the whiteboard reducer
│       ├── hooks/useWhiteboardSocket.ts # React hook for Socket.io /whiteboard namespace
│       └── types/index.ts               # Frontend type definitions
├── package.json
└── tsconfig.json
```

## Packages

### `@whiteboard/library` (root)

Server-side and platform-agnostic code:

- **Types**: `WhiteboardTool`, `Stroke`, `Page`, `Notebook`, `WhiteboardConfig`, etc.
- **State**: `whiteboardReducer`, `initialWhiteboardState` -- pure reducer usable in any JS environment
- **Utils**: `generateStrokeId()`, `createBlankPage()`, `createDefaultNotebook()`
- **Services**: `createWhiteboardSocket(config)` -- attaches `/whiteboard` Socket.io namespace with session + JWT auth

### `@whiteboard/library-frontend` (frontend/)

React hooks for web and React Native:

- **useWhiteboard()** -- local whiteboard state management (add/erase strokes, pages, tool selection)
- **useWhiteboardSocket({ socketUrl, enabled })** -- connects to `/whiteboard` namespace, provides `emit`, `on`, `off`, `joinRoom`, `leaveRoom`

## Development

```bash
# Build backend package
npm install
npm run build

# Build frontend package
cd frontend
npm install
npm run build
```
