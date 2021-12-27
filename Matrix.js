class Matrix{
    constructor(size, fill, ticks=1){
        this.angle = 0
        this.updateCounter = 0
        this.ticks = ticks
        this.noiseOffset = 0
        this.rotationSpeed = 0.005
        this.size = size
        this.width = Math.min(window.innerWidth, window.innerHeight) / 5 * 3
        this.data = []
        let fillCounter = 0;
        for (let i = 0; i < size; ++i){
            let line = [];
            for (let j = 0; j < size; ++j){
                line.push(fillCounter < fill)
                fillCounter++;
            }
            this.data.push(line)
        }
    }

    update(){
        this.updateCounter++;
        this.angle = noise(this.noiseOffset) * 10
        this.noiseOffset += this.rotationSpeed
        // this.angle += 0.02
        if (this.updateCounter % this.ticks == 0)
            this.applyGravity()
        this.render()
    }

    applyGravity(){
        const gravityV = -Math.sin(this.angle - Math.PI / 2)
        const gravityH = Math.cos(this.angle - Math.PI / 2)

        let buffer = []
        for (let i = 0; i < this.size; ++i){
            let line = [];
            for (let j = 0; j < this.size; ++j)
                line.push(false)
            buffer.push(line)
        }

        for (let i = 0; i < this.size; ++i){
            for (let j = 0; j < this.size; ++j){
                if (this.data[i][j]){
                    let possibleDirs = [true, true, true, true]
                    if (i == 0 || this.data[i - 1][j] || buffer[i - 1][j])
                        possibleDirs[0] = false
                    if (j == 0 || this.data[i][j - 1] || buffer[i][j - 1])
                        possibleDirs[3] = false
                    if (i == this.size - 1 || this.data[i + 1][j] || buffer[i + 1][j])
                        possibleDirs[2] = false
                    if (j == this.size - 1 || this.data[i][j + 1] || buffer[i][j + 1])
                        possibleDirs[1] = false
                    
                    const Vdir = Math.sign(gravityV)
                    const Hdir = Math.sign(gravityH)
                    if (Vdir == -1)
                        possibleDirs[2] = false
                    else
                        possibleDirs[0] = false
                    if (Hdir == -1)
                        possibleDirs[1] = false
                    else
                        possibleDirs[3] = false
                    
                    let curDir = [0, 0]
                    const dirCount = possibleDirs[0] + possibleDirs[1] + possibleDirs[2] + possibleDirs[3]
                    if (dirCount == 1){
                        if (possibleDirs[0])
                            curDir = [-1, 0]
                        else if (possibleDirs[1])
                            curDir = [0, 1]
                        else if (possibleDirs[2])
                            curDir = [1, 0]
                        else
                            curDir = [0, -1]
                    }
                    else if (dirCount == 2){
                        if (Math.abs(gravityV) > Math.abs(gravityH)){
                            if (Vdir == -1)
                                curDir = [-1, 0]
                            else
                                curDir = [1, 0]
                        }
                        else{
                            if (Hdir == -1)
                                curDir = [0, -1]
                            else
                                curDir = [0, 1]
                        }
                    }
                    
                    buffer[i + curDir[0]][j + curDir[1]] = true
                }
            }
        }
        this.data = buffer
    }

    render(){
        const centerX = window.innerWidth / 2
        const centerY = window.innerHeight / 2
        fill("#141312")
        strokeWeight(2)
        stroke("#b7b5b6")
        translate(centerX, centerY)
        rotate(this.angle)
        rect(-this.width / 2, -this.width / 2, this.width, this.width, 10);
        for (let i = 0; i < this.size; ++i){
            for (let j = 0; j < this.size; ++j){
                const cellWidth = this.width / this.size
                const cellPosX = cellWidth * j - this.width / 2 + cellWidth / 2
                const cellPosY = cellWidth * i - this.width / 2 + cellWidth / 2
                if (this.data[i][j]){
                    drawingContext.shadowBlur = 20
                    drawingContext.shadowColor = color("#d4050a")
                    fill("#fffffc")
                }
                else
                    fill("#66534c")
                noStroke()
                circle(cellPosX, cellPosY, cellWidth / 3 * 2)
                drawingContext.shadowBlur = 0
            }
        }
    }
}