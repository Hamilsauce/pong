import {Tile, TileType} from '../pathfinding/core/Components';
import GridView from './GridView';
import AlgorithmsSettings from './AlgorithmsSettings';
import MazeGenerator from '../pathfinding/algorithms/MazeGenerator';
import {euclidean} from '../pathfinding/algorithms/Heuristics';
import PathfinderFactory from '../pathfinding/algorithms/PathfinderFactory';
import Pathfinder from "../pathfinding/algorithms/Pathfinder";

/**
 * Represents a grid handler UI set
 */
export interface HandlerUI
{
    readonly visualizeButton: HTMLElement;
    readonly mazeButton: HTMLElement;

    readonly lengthText: HTMLElement;
    readonly timeText: HTMLElement;
}

/**
 * A class that handles button events on the grid view
 */
class GridHandler
{
    private handlerUI: HandlerUI;

    private readonly gridView: GridView;
    private readonly settings: AlgorithmsSettings;

    private thinking = false;
    private generating = false;
    private visualTimeouts: NodeJS.Timeout[]  = [];
    private generationTimeouts: NodeJS.Timeout[] = [];

    isThinking() {
        return this.thinking;
    }

    isGenerating() {
        return this.generating;
    }

    constructor(gridView: GridView, settings: AlgorithmsSettings, handlerUI: HandlerUI) {
        this.gridView = gridView;
        this.settings = settings;
        this.handlerUI = handlerUI;
    }

    /**
     * Binds the visualize button to the grid view
     */
    bindVisualizeButton() {
        //create button to use algorithm
        this.handlerUI.visualizeButton.onmousedown = (e) => {
            e.preventDefault(); //prevents button focus that default bootstrap css applies
        }
        this.handlerUI.visualizeButton.onclick = () => {
            this.gridView.setVisualize(false);
            if(this.generating) {
                return;
            }
            this.gridView.clearVisualization();
            this.gridView.clearSvg();
            this.gridView.toggleDisable();
            if(!this.thinking) {
                this.handlerUI.visualizeButton.className = 'button red-button';
                this.thinking = true;
                const pathfinder = this.getPathfinder();
                //use pathfinder with benchmarking
                const path = this.findPath(pathfinder);
                //reconstruct and visualize
                const increment = this.settings.getDelayInc();
                let delay = 0;
                const promises: Promise<NodeJS.Timeout>[] = [];
                this.visualTimeouts = [];
                if(this.settings.willVisualize()) {
                    pathfinder.reconstructSolution((node) => {
                        const promise = new Promise<NodeJS.Timeout>((resolve) => {
                            const timeout = setTimeout(() => {
                                this.gridView.visualizeClosedNode(node);
                                this.gridView.visualizeGeneration(node.children);
                                resolve(timeout);
                            }, delay);
                            this.visualTimeouts.push(timeout);
                            delay += increment;
                        });
                        promises.push(promise);
                    });
                }
                Promise.all(promises).then(() => {
                    this.gridView.setVisualize(true);
                    this.drawSolution(path);
                });
            } else {
                this.handlerUI.visualizeButton.className = 'button green-button';
                for (let i = 0; i < this.visualTimeouts.length; i++) {
                    clearTimeout(this.visualTimeouts[i]);
                }
                this.thinking = false;
            }
        }
    }

    /**
     * Performs pathfinding activity with a manual call, (rather than by UI bindings)
     * Does not use timeouts/delays
     */
    public doPathfinding() {
        const pathfinder = this.getPathfinder();
        const path = this.findPath(pathfinder);
        if(this.settings.willVisualize()) {
            pathfinder.reconstructSolution((node) => {
                this.gridView.visualizeClosedNode(node);
                this.gridView.visualizeGeneration(node.children);
            });
        }
        this.drawSolution(path);
        this.gridView.toggleDisable();
    }

    /**
     * Gets the pathfinder for the algorithm settings
     */
    private getPathfinder() {
        const algorithm = this.settings.getAlgorithm();
        const navigator = PathfinderFactory.getNavigator(
            this.gridView.getGrid(),
            this.settings.getNavigatorKey(),
        )
        return PathfinderFactory.getInstance(
            navigator,
            this.settings.usingBidirectional() && PathfinderFactory.hasBidirectional(algorithm) ?
                PathfinderFactory.getBidirectional(algorithm) : algorithm,
            this.settings.getHeuristicKey()
        );
    }

    /**
     * Find path with a given pathfinder, includes benchmarking
     * @param pathfinder
     */
    private findPath(pathfinder: Pathfinder) {
        const t0 = performance.now();
        const path = pathfinder.findPath(this.gridView.getInitial(), this.gridView.getGoal());
        const t1 = performance.now();
        const t2 = +(t1 - t0).toFixed(3);
        this.handlerUI.timeText.textContent = 'Time : ' + t2 + ' ms';
        return path;
    }

    /**
     * Draws the solution path on the grid and finishes the visualization
     * @param path
     */
    private drawSolution(path: Tile[]) {
        this.gridView.drawLines(path);
        let len = 0;
        for (let i = 0; i < path.length - 1; i++) {
            len += euclidean(path[i].point, path[i + 1].point);
        }
        len = +(len).toFixed(3);
        this.handlerUI.lengthText.textContent = 'Length: ' + len;
        this.handlerUI.visualizeButton.className = 'button green-button';
        this.gridView.toggleDisable();
        this.thinking = false;
    }

    /**
     * Binds the maze button to the grid view
     */
    bindMazeButton() {
        this.handlerUI.mazeButton.onclick = () => {
            if(this.thinking) {
                return;
            }
            if(this.generating) {
                this.resetGeneration();
            }
            this.generating = true;
            this.gridView.clear();
            this.gridView.disabled();
            const generator = new MazeGenerator(this.gridView.getGrid(), (tile) => {
                const type = tile.data.isSolid ? TileType.Solid : TileType.Empty;
                this.gridView.mutateTile(tile.point, type);
            });
            generator.generateMaze();
            this.gridView.enabled();
            this.generating = false;
            this.setPositionsDefault();
        }
    }

    /**
     * Sets the positions in the grid view to maze defaults
     * @private
     */
    private setPositionsDefault() {
        this.gridView.moveInitial({
            x: 1, y:1
        });
        this.gridView.moveGoal({
            x: this.gridView.getGrid().getWidth()-2,
            y: this.gridView.getGrid().getHeight()-2
        });
    }

    /**
     * Resets all maze generation timeouts, effectively stopping maze generation on the grid view
     */
    resetGeneration() {
        for (let i = 0; i < this.generationTimeouts.length; i++) {
            clearTimeout(this.generationTimeouts[i]);
        }
        this.generating = false;
        this.gridView.enabled();
    }

    /**
     * Resets all visualization timeouts, effectively stopping visualization on the grid view
     */
    resetVisual() {
        for (let i = 0; i < this.visualTimeouts.length; i++) {
            clearTimeout(this.visualTimeouts[i]);
        }
        this.thinking = false;
        this.handlerUI.visualizeButton.className = 'button green-button';
        this.gridView.enabled();
    }
}

export default GridHandler;
