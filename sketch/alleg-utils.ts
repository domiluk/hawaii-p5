function create_bitmap(w: number, h: number): p5.Image {
    let img: p5.Image = createImage(w, h)
    // Load the image's pixels into memory.
    img.loadPixels()
    // Set all the image's pixels to black.
    for (let i = 0; i < w * h * 4; i += 4) {
        img.pixels[i + 0] = 0
        img.pixels[i + 1] = 0
        img.pixels[i + 2] = 0
        img.pixels[i + 3] = 255
    }
    // Update the image's pixel values.
    img.updatePixels()

    console.log(img)

    return img
}

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