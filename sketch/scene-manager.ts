type SceneConstructor = new () => Scene

abstract class Scene {
    abstract draw(): void
    update(): void { } // Should be called before draw every frame

    // Optional lifecycle methods
    enter(): void { } // Called when scene becomes active
    exit(): void { }  // Called when leaving this scene
}

class SceneManager<SceneName extends string> {
    private scenes: Map<SceneName, Scene> = new Map()
    private currentScene: Scene
    private currentSceneName: SceneName

    constructor(scenes: Record<SceneName, SceneConstructor>) {
        // TypeScript will error if any scene is missing
        Object.entries(scenes).forEach(([id, Scene]) => {
            this.scenes.set(id as SceneName, new (Scene as SceneConstructor)())
        })
    }

    switchTo(name: SceneName): void {
        if (!this.scenes.has(name)) {
            console.error(`Scene ${name} not found`)
            return
        }

        this.currentScene?.exit()

        this.currentSceneName = name;
        this.currentScene = this.scenes.get(name)

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
}