const canvas = document.querySelector('#game-container');
const c = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 480;

let x = 10;
let y = 10;

const updateLoop = () => {
  window.requestAnimationFrame(updateLoop);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = 'red';
  c.fillRect(x, y, 50, 50);
};

const movePlayer = ({ xVal = 0, yVal = 0 }) => {
  if (xVal + x > 0 && xVal + x < canvas.width - 50) x += xVal;
  if (yVal + y > 0 && yVal + y < canvas.height - 50) y += yVal;
  console.log('x:', x, 'y', y);
};

window.addEventListener('keydown', (e) => {
  //   console.log(e.key);
  switch (e.key) {
    case 'd':
      movePlayer({ xVal: 5 });
      break;
    case 'a':
      movePlayer({ xVal: -5 });
      break;
    case 'w':
      movePlayer({ yVal: -5 });
      break;
    case 's':
      movePlayer({ yVal: 5 });
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'd':
      break;
    case 'a':
      break;
    case 'w':
      break;
    case 's':
      break;
  }
});

updateLoop();
