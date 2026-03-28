export function generateStrokeId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}
export function createBlankPage(background) {
    return {
        id: generateStrokeId(),
        background: background || { type: 'blank' },
        strokes: [],
    };
}
export function createDefaultNotebook(title) {
    return {
        version: 1,
        title: title || `Notebook ${new Date().toISOString().split('T')[0]}`,
        pages: [createBlankPage()],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
}
//# sourceMappingURL=page.js.map