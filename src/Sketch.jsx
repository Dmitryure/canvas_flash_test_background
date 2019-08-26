import React, {useState} from 'react'
import canvasSketch from 'canvas-sketch'
import palettes from 'nice-color-palettes/1000.json'
import random from 'canvas-sketch-util/random'
import { lerp } from 'canvas-sketch-util/math'

const createObjs = (amount, arr, palette) => {
    for (let i = 0; i < amount; i++) {
        for (let j = 0; j < amount; j++) {
            let obj = {}
            obj.color = random.pick(palette)
            obj.u = i / (amount - 1)
            obj.v = j / (amount - 1)
            obj.radius = Math.abs(30)
            arr.push(obj)
        }
    }
} 

const expandObjs = (objs) => {
    for (let i = 0; i < objs.length; i++) {
        objs[i].radius = objs[i].radius >= 2 ? objs[i].radius + random.range(-2, 0) : random.range(1, 30)
    }
}

export const Sketch = (props) => {

    const [ref, setRef ] = useState(React.createRef())
 
    let background = random.pick(palettes.shift())
    let palette = random.pick(palettes);
    palette = random.shuffle(palette);

    const settings = {
        dimensions: [1024, 1024],
        animate: true,
    };

    let arr = []

    createObjs(15, arr, palette)

    // arr.filter(() => Math.random() > 0.9)



    let fps = 24

    const sketch = () => {
        return ({ context, width, height }) => {
            const margin = 1;
            context.fillStyle = background
            context.fillRect(0, 0, width, height) 
            arr.forEach(data => {
                const { u, v, color, radius } = data
                const x = lerp(margin, width - margin, u)
                const y = lerp(margin, height - margin, v)
                context.beginPath()
                context.arc(x, y, radius, 0, 2 * Math.PI)
                context.fillStyle = color;
                context.fill();
            })
        }
    }


    settings.canvas = ref.current
    canvasSketch(sketch, settings)

    setInterval(() => {
        expandObjs(arr)
        // canvasSketch(sketch, settings)
    }, 1000 / fps)

    return <canvas ref={ref}/>
}