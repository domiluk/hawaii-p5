/// <reference path="../p5-gamedev-framework/scene-manager.ts" />

class MainMenuScene extends Scene {
    draw(): void {
        image(menu, 0, 0)
        menuButtons()
    }
}