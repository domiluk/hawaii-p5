function putpixel(img: p5.Image, x: number, y: number, col: p5.Color): void {
    x = floor(x)
    y = floor(y)
    img.loadPixels()
    img.set(x, y, col)
    img.updatePixels()
}

function getpixel(img: p5.Image, x: number, y: number): p5.Color {
    x = floor(x)
    y = floor(y)
    if (x < 0 || y < 0 || x >= img.width || y >= img.height)
        return color(0)
    img.loadPixels()
    const i = 4 * (y * img.width + x)
    const p = img.pixels
    return color(p[i], p[i + 1], p[i + 2], p[i + 3])
}