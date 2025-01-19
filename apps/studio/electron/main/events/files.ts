import { MainChannels } from '@onlook/models/constants';
import { ipcMain } from 'electron';
import fs from 'fs';
import path from 'path';
import { IGNORED_DIRECTORIES } from '../run/helpers';

interface FileNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileNode[];
}

function buildFileTree(dirPath: string, basePath: string = dirPath): FileNode[] {
    const items = fs.readdirSync(dirPath);
    const tree: FileNode[] = [];

    for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const relativePath = path.relative(basePath, fullPath);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            if (!IGNORED_DIRECTORIES.includes(item)) {
                tree.push({
                    name: item,
                    path: relativePath,
                    type: 'directory',
                    children: buildFileTree(fullPath, basePath),
                });
            }
        } else {
            tree.push({
                name: item,
                path: relativePath,
                type: 'file',
            });
        }
    }

    // Sort directories first, then files, both alphabetically
    return tree.sort((a, b) => {
        if (a.type === b.type) {
            return a.name.localeCompare(b.name);
        }
        return a.type === 'directory' ? -1 : 1;
    });
}

export function registerFileHandlers() {
    ipcMain.handle(MainChannels.GET_PROJECT_FILES, async (_, projectPath: string) => {
        try {
            return buildFileTree(projectPath);
        } catch (error) {
            console.error('Error getting project files:', error);
            throw error;
        }
    });
}
