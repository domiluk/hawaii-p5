type SceneConstructor = new () => Scene

abstract class Scene implements p5UIEventHandler {
    abstract draw(): void
    update(): void { } // Should be called before draw every frame

    // Optional lifecycle methods
    enter(): void { } // Called when scene becomes active
    exit(): void { }  // Called when leaving this scene

    keyPressed(): void { }
    keyReleased(): void { }
    keyTyped(): void { }
    mouseMoved(): void { }
    mousePressed(): void { }
    mouseReleased(): void { }
}

class SceneManager<SceneName extends string> implements p5UIEventHandler {
    private scenes: Map<SceneName, Scene> = new Map()
    private currentScene: Scene
    private currentSceneName: SceneName

    constructor(
        scenes: Record<SceneName, SceneConstructor>,
        initialScene: SceneName,
    ) {
        // TypeScript will error if any scene is missing
        Object.entries(scenes).forEach(([id, Scene]) => {
            this.scenes.set(id as SceneName, new (Scene as SceneConstructor)())
        })
        this.switchTo(initialScene)
    }

    switchTo(name: SceneName): void {
        if (!this.scenes.has(name)) {
            console.error(`Scene ${name} not found`)
            return
        }

        this.currentScene?.exit()

        this.currentSceneName = name;
        this.currentScene = this.scenes.get(name)!

        this.currentScene?.enter()
    }

    update(): void {
        this.currentScene?.update()
    }

    draw(): void {
        this.currentScene?.draw()
    }

    getCurrentSceneName(): SceneName {
        return this.currentSceneName
    }

    keyPressed(): void {
        this.currentScene?.keyPressed()
    }

    keyReleased(): void {
        this.currentScene?.keyReleased()
    }

    keyTyped(): void {
        this.currentScene?.keyTyped()
    }

    mouseMoved(): void {
        this.currentScene?.mouseMoved()
    }

    mousePressed(): void {
        this.currentScene?.mousePressed()
    }

    mouseReleased(): void {
        this.currentScene?.mouseReleased()
    }
}