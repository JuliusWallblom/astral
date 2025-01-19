import { useEditorEngine } from '@/components/Context';
import { EditorMode } from '@/lib/models';
import { Separator } from '@onlook/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@onlook/ui/tabs';
import { cn } from '@onlook/ui/utils';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import ComponentsTab from './ComponentsTab';
import LayersTab from './LayersTab';
import { FileTree, type FileTreeNode } from '../TopBar/PackagingTab/FileTree';
import { Icons } from '@onlook/ui/icons';
import { useProjectsManager } from '@/components/Context';
import { invokeMainChannel } from '@/lib/utils';
import { MainChannels } from '@onlook/models/constants';

const COMPONENT_DISCOVERY_ENABLED = false;

enum MainTabValue {
    PROJECT = 'project',
    DESIGN = 'design',
}

enum DesignTabValue {
    LAYERS = 'layers',
    COMPONENTS = 'components',
}

const LayersPanel = observer(() => {
    const editorEngine = useEditorEngine();
    const projectsManager = useProjectsManager();
    const [isOpen, setIsOpen] = useState(true);
    const [files, setFiles] = useState<FileTreeNode[]>([]);
    const [loading, setLoading] = useState(true);

    const handleFileSelect = (path: string) => {
        // TODO: Handle file selection
        console.log('Selected file:', path);
    };

    function loadProjectFiles() {
        if (projectsManager.project?.folderPath) {
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
    }

    function renderDesignTabs() {
        return (
            <Tabs defaultValue={DesignTabValue.LAYERS}>
                <TabsList className="mx-2 mt-1 bg-transparent w-full gap-2 select-none justify-start">
                    <TabsTrigger
                        className="bg-transparent px-1 text-xs hover:text-foreground-hover"
                        value={DesignTabValue.LAYERS}
                    >
                        Layers
                    </TabsTrigger>
                    <TabsTrigger
                        className="bg-transparent px-1 text-xs hover:text-foreground-hover"
                        value={DesignTabValue.COMPONENTS}
                    >
                        Components
                    </TabsTrigger>
                </TabsList>
                <Separator className="mt-1" />
                <div className="h-[calc(100vh-11rem)] overflow-auto mx-2">
                    <TabsContent value={DesignTabValue.LAYERS}>
                        <LayersTab />
                    </TabsContent>
                    <TabsContent value={DesignTabValue.COMPONENTS}>
                        {COMPONENT_DISCOVERY_ENABLED ? (
                            <ComponentsTab components={editorEngine.projectInfo.components} />
                        ) : (
                            <div className="w-full pt-96 text-center opacity-70">Coming soon</div>
                        )}
                    </TabsContent>
                </div>
            </Tabs>
        );
    }

    function renderMainTabs() {
        return (
            <Tabs
                defaultValue={MainTabValue.DESIGN}
                onValueChange={(value) => {
                    if (value === MainTabValue.PROJECT) {
                        loadProjectFiles();
                    }
                }}
            >
                <TabsList className="bg-transparent w-full gap-2 select-none justify-between pl-2">
                    <div className="flex items-center gap-0.5">
                        <TabsTrigger
                            className="bg-transparent py-2 px-2 text-xs hover:text-foreground-hover"
                            value={MainTabValue.PROJECT}
                        >
                            <Icons.File className="h-4 w-4" />
                        </TabsTrigger>
                        <TabsTrigger
                            className="bg-transparent py-2 px-1 text-xs hover:text-foreground-hover"
                            value={MainTabValue.DESIGN}
                        >
                            <Icons.Layers className="h-4 w-4" />
                        </TabsTrigger>
                    </div>
                    <button
                        className="text-default rounded-lg p-2 bg-transparent hover:text-foreground-hover"
                        onClick={() => setIsOpen(false)}
                    >
                        <Icons.PinLeft />
                    </button>
                </TabsList>
                <Separator />
                <div className="h-[calc(100vh-7.75rem)] overflow-auto">
                    <TabsContent value={MainTabValue.PROJECT}>
                        <div className="mx-2">
                            {loading ? (
                                <div className="text-sm text-muted-foreground animate-pulse pt-2">
                                    Loading project files...
                                </div>
                            ) : (
                                <FileTree data={files} onSelect={handleFileSelect} />
                            )}
                        </div>
                    </TabsContent>
                    <TabsContent value={MainTabValue.DESIGN}>{renderDesignTabs()}</TabsContent>
                </div>
            </Tabs>
        );
    }

    return (
        <div
            className={cn(
                'left-0 top-20 transition-width duration-300 opacity-100 bg-background/80 rounded-tr-xl overflow-hidden',
                editorEngine.mode === EditorMode.PREVIEW ? 'hidden' : 'visible',
                isOpen ? 'w-full h-[calc(100vh-5rem)]' : 'w-10 h-10 rounded-r-xl cursor-pointer',
            )}
        >
            {!isOpen && (
                <div
                    className="border border-foreground/10 rounded-r-xl w-full h-full flex justify-center items-center text-foreground hover:text-foreground-onlook"
                    onClick={() => setIsOpen(true)}
                >
                    <Icons.PinRight className="z-51" />
                </div>
            )}
            <div
                className={cn(
                    'border backdrop-blur shadow h-full relative transition-opacity duration-300 rounded-tr-xl',
                    isOpen ? 'opacity-100 visible' : 'opacity-0 hidden',
                )}
            >
                {renderMainTabs()}
            </div>
        </div>
    );
});

export default LayersPanel;
