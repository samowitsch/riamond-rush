function Particle() {
    this.position = new Vector2D()
    this.startPosition = new Vector2D()
    this.direction = new Vector2D()
    this.size = new Vector2D()
    this.deltaSize = new Vector2D()
    this.color = new RGBColor()
    this.deltaColor = new RGBColor()

    this.angle = 0
    this.radialAcceleration = 0
    this.tangentialAcceleration = 0
    this.radius = 0
    this.radiusDelta = 0
    this.degreesPerSecond = 0
    this.rotation = 0
    this.deltaRotation = 0

    this.timeToLive = 0
}

