---
title: Bouncy Balls
excerpt: Bouncy Balls Physics Playground is an interactive 2D physics simulation built with pure JavaScript and HTML5 Canvas. It demonstrates fundamental physics principles like gravity, collision, and elasticity through colorful bouncing balls that users can add, drag, and customize in real-time. Designed to be fully responsive and lightweight, this project is perfect for learning, teaching, or showcasing simple physics concepts on any device or screen size.

iframe: //codepen.io/CodeByAshuu/embed/bNVoQPL/?default-tab=result&theme-id=light
demo: //codebyashuu.github.io/BounceBalls/
src: //github.com/CodeByAshuu/BounceBalls
# https://codepen.io/pen?template=bNVoQPL
info:
  idea: The main idea was to create a simple, interactive web-based simulation that visually demonstrates basic physics concepts like gravity, collision detection, and elastic bouncing.
  tech: [Javascript, Canvas, CSS]
  links:
    - [ On Codepen, https://codepen.io/CodeByAshuu/pen/bNVoQPL ]
    - [ MDN Web Docs | Canvas API, https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API ]
    - [ MDN Web Docs | 2D Collision Detection, https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection ]
    - [ Article at DataGenetic | Verlet Simulation , https://datagenetics.com/blog/july22018/index.html]
---

While I was building my physics engine [Bouncy Balls](https://codebyashuu.github.io/BounceBalls/) I was thinking of making something that would showcase the engine's potential to do some exciting stuff, so I created this just as an experiment. 


- so far BouncyBalls got over **1K Views** on [Codepen](https://codepen.io/CodeByAshuu/pen/bNVoQPL)
<!-- - got mentioned in **[CodepenSpark #136](https://codepen.io/spark/136)** -->
<!-- - showcased in **[justforfun.io](https://justforfun.io/post/verly-range-slider)** -->
- and **2 stars** on Github

## How It Works?

The Bouncy Balls Physics Playground works by using the HTML5 Canvas API to draw and animate circles that simulate physical motion under the influence of gravity and collision forces.

The simulation runs in a continuous loop using `requestAnimationFrame()`, which ensures smooth animations at the browser’s optimal refresh rate.

> This code sets up the canvas element, resizes it to fit the screen while accounting for device pixel ratio, and ensures crisp rendering. It should be called on page load and window resize events.

```js {18}
const canvas = document.getElementById('c');
const ctx = canvas.getContext('2d', { alpha: false });

function resize(){
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.clientWidth = canvas.offsetWidth;
  H = canvas.clientHeight = canvas.offsetHeight;
  canvas.width = Math.floor(W * dpr);
  canvas.height = Math.floor(H * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
window.addEventListener('resize', resize);
resize();
```

after that, I created a `body` with 

```js {2}
class Body {
  constructor(x, y, r){
    this.x = x; this.y = y;
    this.vx = 0; this.vy = 0;
    this.r = r;
    this.invMass = 1 / (Math.PI * r * r); // lighter when bigger
    this.color = `hsl(${Math.floor(Math.random()*360)} 70% 60%)`;
  }
}
```

#### Broadphase Collision Detection, aka “Let’s not check every ball against every other ball, that’d be crazy”
now the actual part where I fix things to keep running smooth, I group `balls` into little `buckets` based on where they are. So only balls close to each other bother checking for `collisions`. Because balls have personal space too.

(yeah i did not bother to use shadowDOM because of browser compatibility and vendor issues) 

> Call this function every physics update step before collision resolution.

```js {3}
function buildSpatialHash(bodies, cellSize){
  const map = new Map();
  for (const b of bodies) {
    const minX = Math.floor((b.x - b.r) / cellSize);
    const maxX = Math.floor((b.x + b.r) / cellSize);
    const minY = Math.floor((b.y - b.r) / cellSize);
    const maxY = Math.floor((b.y + b.r) / cellSize);
    for (let xi = minX; xi <= maxX; xi++) {
      for (let yi = minY; yi <= maxY; yi++) {
        const key = xi + ',' + yi;
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(b);
      }
    }
  }
  return map;
}
```

Okay, this works!
But I noticed something weird behavior with this.

The problem was, for some reason when balls collided near the edges, sometimes they’d get stuck or overlap weirdly due to tiny calculation errors (thanks, floating point precision) , so I had to think some ways to prevent this. then I ended up with this solution (yeah crazy but works)

### Collision Resolution - the moment balls realize they can’t just go through each other

Here, I make sure that when two balls bump, they bounce off realistically instead of merging into one giant ball (which would be terrifying). I separate them and `swap velocities` a bit, with a little `bounce factor`.


```js {4-8}
function resolveCircleCircle(a, b) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy) || 1e-6;
  const overlap = a.r + b.r - dist;
  if (overlap > 0) {
    const nx = dx / dist, ny = dy / dist;
    const invMassSum = a.invMass + b.invMass;
    const push = overlap / invMassSum;

    // positional correction so they don't get stuck like stubborn friends
    a.x -= nx * push * a.invMass;
    a.y -= ny * push * a.invMass;
    b.x += nx * push * b.invMass;
    b.y += ny * push * b.invMass;

    // velocity swap for that satisfying bounce effect
    const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
    const relVelAlongNormal = rvx * nx + rvy * ny;
    if (relVelAlongNormal > 0) return; // moving apart, no worries here

    const e = world.restitution; // how bouncy are we feeling today?
    const j = -(1 + e) * relVelAlongNormal / invMassSum;
    a.vx -= (j * nx) * a.invMass;
    a.vy -= (j * ny) * a.invMass;
    b.vx += (j * nx) * b.invMass;
    b.vy += (j * ny) * b.invMass;
  }
}
```

nice! now we need to move the balls.

### Moving the Ball

This function updates each ball’s `position` and `velocity` every `frame`, adding `gravity` and keeping them inside the `canvas` boundaries. Because balls don’t want to escape the playground.

> I created `intergrate` function which works as gravity.

```js
function integrate(b, dt){
  b.vy += world.gravity * dt; // gravity pulls them down (sorry, balls)
  b.x += b.vx * dt;
  b.y += b.vy * dt;
}

function collideWorldBounds(b){
  if (b.x - b.r < 0) { b.x = b.r; b.vx = -b.vx * world.restitution; }
  if (b.x + b.r > W) { b.x = W - b.r; b.vx = -b.vx * world.restitution; }
  if (b.y - b.r < 0) { b.y = b.r; b.vy = -b.vy * world.restitution; }
  if (b.y + b.r > H) { b.y = H - b.r; b.vy = -b.vy * world.restitution; }
}
```

### Physics Update

Here’s where the magic happens each animation frame: update ball positions, figure out who’s near who, fix collisions, and keep balls bouncing nicely inside the canvas.

```js
function physicsStep(dt){
  for (const b of world.bodies) integrate(b, dt);
  const map = buildSpatialHash(world.bodies, world.cellSize);

  for (const list of map.values()) {
    for (let i=0; i<list.length; i++){
      for (let j=i+1; j<list.length; j++){
        resolveCircleCircle(list[i], list[j]);
      }
    }
  }

  for (const b of world.bodies) collideWorldBounds(b);
}
```
Users can add new balls by clicking or dragging existing ones around, making it a mini playground of physics and chaos.

```js
canvas.addEventListener('pointerdown', (e)=>{
  // get mouse position relative to canvas
  // check if clicked on a ball to drag
  // else create a new ball at that spot
});
```

### Animation Loop

Finally, this runs the whole show, `updating physics` and drawing the balls smoothly as fast as your browser allows. It also makes sure the physics update runs at a `stable timestep` for better accuracy.

```js
let last = performance.now();
let acc = 0;
function loop(now){
  let dt = (now - last) / 1000;
  last = now;
  acc += dt;
  const step = world.timeStep;
  let substeps = 0;
  while (acc >= step && substeps < world.maxSubsteps) {
    physicsStep(step);
    acc -= step;
    substeps++;
  }
  draw(); // redraw all the balls
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```



and we are done!


> hopefully, you enjoyed playing with this project, I know because I did. 
> you can give the project a star on GitHub if you liked it, have a beautiful day (or night)