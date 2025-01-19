export interface WebviewMetadata {
    id: string;
    title: string;
    src: string;
}

export enum EditorMode {
    DESIGN = 'design',
    PREVIEW = 'preview',
    PAN = 'pan',
    INSERT_TEXT = 'insert-text',
    INSERT_DIV = 'insert-div',
}

export enum EditorTabValue {
    STYLES = 'styles',
    CHAT = 'chat',
}
