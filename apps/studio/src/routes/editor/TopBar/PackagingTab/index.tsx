import { useProjectsManager } from '@/components/Context';
import { invokeMainChannel } from '@/lib/utils';
import { MainChannels } from '@onlook/models/constants';
import { Button } from '@onlook/ui/button';
import { Icons } from '@onlook/ui/icons';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@onlook/ui/sheet';
import { Tooltip, TooltipContent, TooltipTrigger } from '@onlook/ui/tooltip';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import { FileTree, type FileTreeNode } from './FileTree';

const PackagingTab = observer(() => {
    const projectsManager = useProjectsManager();
    const [isOpen, setIsOpen] = useState(false);
    const [files, setFiles] = useState<FileTreeNode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && projectsManager.project?.folderPath) {
            setLoading(true);
            invokeMainChannel(MainChannels.GET_PROJECT_FILES, projectsManager.project.folderPath)
                .then((result) => {
                    setFiles(result as FileTreeNode[]);
                })
                .catch((error) => {
                    console.error('Error loading project files:', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [isOpen, projectsManager.project?.folderPath]);

    if (!projectsManager.project) {
        return null;
    }

    const handleFileSelect = (path: string) => {
        // TODO: Handle file selection - we can add code viewing/editing functionality here
        console.log('Selected file:', path);
    };

    return (
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <Tooltip>
                <TooltipTrigger asChild>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="mx-0 px-2 text-foreground-onlook text-small hover:text-foreground-active hover:bg-transparent flex items-center gap-2"
                        >
                            <Icons.File className="h-4 w-4" />
                            <span className="hidden md:inline">Files</span>
                        </Button>
                    </SheetTrigger>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="pt-1 text-background bg-foreground">
                    View Project Files
                </TooltipContent>
            </Tooltip>
            <SheetContent side="right" className="w-[400px] sm:w-[540px]">
                <SheetHeader>
                    <SheetTitle>Project Files</SheetTitle>
                </SheetHeader>
                <div className="mt-4 overflow-auto max-h-[calc(100vh-8rem)]">
                    {loading ? (
                        <div className="text-sm text-muted-foreground animate-pulse">
                            Loading project files...
                        </div>
                    ) : (
                        <FileTree data={files} onSelect={handleFileSelect} />
                    )}
                </div>
            </SheetContent>
        </Sheet>
    );
});

export default PackagingTab;
