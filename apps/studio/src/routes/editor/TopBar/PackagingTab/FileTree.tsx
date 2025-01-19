import { Icons } from '@onlook/ui/icons';
import { cn } from '@onlook/ui/utils';
import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Tree, type TreeApi, type NodeApi, type NodeRendererProps } from 'react-arborist';
import { motion } from 'motion/react';
import { Tooltip, TooltipContent, TooltipPortal, TooltipTrigger } from '@onlook/ui/tooltip';
import { TooltipArrow } from '@radix-ui/react-tooltip';
import useResizeObserver from 'use-resize-observer';

export interface FileTreeNode {
    name: string;
    path: string;
    type: 'file' | 'directory';
    children?: FileTreeNode[];
}

interface FileTreeProps {
    data: FileTreeNode[];
    onSelect?: (path: string) => void;
}

const FileTreeNodeComponent = memo(
    ({ node, style, dragHandle }: NodeRendererProps<FileTreeNode>) => {
        const [isHovered, setIsHovered] = useState(false);
        const nodeRef = useRef<HTMLDivElement>(null);

        const nodeClassName = useMemo(
            () =>
                cn('mt-2 flex flex-row items-center h-6 cursor-pointer w-full pr-1', {
                    'text-foreground-onlook': !isHovered,
                    rounded: isHovered,
                    'bg-background-onlook': isHovered,
                }),
            [isHovered],
        );

        return (
            <Tooltip>
                <TooltipTrigger asChild>
                    <div ref={nodeRef}>
                        <div
                            ref={dragHandle}
                            style={style}
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onClick={() => {
                                if (node.data.type === 'directory') {
                                    node.toggle();
                                } else {
                                    node.select();
                                }
                            }}
                            className={nodeClassName}
                        >
                            <span className="w-4 h-4 flex-none relative">
                                {node.data.type === 'directory' && (
                                    <div className="w-4 h-4 flex items-center justify-center absolute z-50">
                                        {isHovered && (
                                            <motion.div
                                                initial={false}
                                                animate={{ rotate: node.isOpen ? 90 : 0 }}
                                            >
                                                <Icons.ChevronRight className="h-2.5 w-2.5" />
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </span>
                            <div className="flex items-center gap-2">
                                {node.data.type === 'directory' ? (
                                    node.isOpen ? (
                                        <Icons.DirectoryOpen className="h-4 w-4 shrink-0" />
                                    ) : (
                                        <Icons.Directory className="h-4 w-4 shrink-0" />
                                    )
                                ) : (
                                    <Icons.File className="h-4 w-4 shrink-0" />
                                )}
                                <span className="truncate">{node.data.name}</span>
                            </div>
                        </div>
                    </div>
                </TooltipTrigger>
                <TooltipPortal>
                    <TooltipContent
                        side="right"
                        align="center"
                        className="animation-none max-w-[200px] shadow"
                    >
                        <TooltipArrow className="fill-foreground" />
                        <p>{node.data.path}</p>
                    </TooltipContent>
                </TooltipPortal>
            </Tooltip>
        );
    },
);

const TreeRow = memo(({ innerRef, attrs, children }: any) => {
    return (
        <div ref={innerRef} {...attrs} className="outline-none">
            {children}
        </div>
    );
});

export const FileTree = memo(({ data, onSelect }: FileTreeProps) => {
    const treeRef = useRef<TreeApi<FileTreeNode>>();
    const { ref, width = 365, height = 500 } = useResizeObserver();

    const handleSelect = useCallback(
        (nodes: NodeApi<FileTreeNode>[]) => {
            const node = nodes[0];
            if (node?.data.type === 'file') {
                onSelect?.(node.data.path);
            }
        },
        [onSelect],
    );

    const childrenAccessor = useCallback((node: FileTreeNode) => {
        return node.children?.length ? node.children : null;
    }, []);

    return (
        <div ref={ref} className="flex text-xs text-active flex-grow w-full">
            <Tree
                ref={treeRef}
                data={data}
                openByDefault={false}
                indent={8}
                rowHeight={24}
                padding={0}
                onSelect={handleSelect}
                width={width}
                height={height}
                renderRow={TreeRow}
                idAccessor={(node) => node.path}
                childrenAccessor={childrenAccessor}
            >
                {FileTreeNodeComponent}
            </Tree>
        </div>
    );
});

FileTreeNodeComponent.displayName = 'FileTreeNodeComponent';
TreeRow.displayName = 'TreeRow';
FileTree.displayName = 'FileTree';
