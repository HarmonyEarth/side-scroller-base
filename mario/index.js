import { images } from './resources.js';

/** @type {HTMLCanvasElement} */
const canvas = document.querySelector('canvas');

const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

class Player {
  constructor() {
    this.speed = 10;
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };
    this.image = createImage(images.character.idle.src);

    this.sprites = {
      idle: {
        image: createImage(images.character.idle.src),
        cropWidth: images.character.idle.width,
        cropHeight: images.character.idle.height,
        finalFrame: images.character.idle.frameMax,
      },
      dash: {
        image: createImage(images.character.dash.src),
        cropWidth: images.character.dash.width,
        cropHeight: images.character.dash.height,
        finalFrame: images.character.dash.frameMax,
      },
    };
    this.frames = 0;
    this.frameMax = this.sprites.idle.finalFrame;
    this.currentSprite = this.sprites.idle.image;
    this.currentCropWidth = this.sprites.idle.cropWidth;
    this.currentCropHeight = this.sprites.idle.cropHeight;

    this.width = this.currentCropWidth;
    this.height = this.currentCropHeight;
  }
  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      this.currentCropHeight,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }
  update() {
    this.frames++;
    if (this.frames > this.frameMax) {
      this.frames = 0;
    }
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    }
  }
}

class Platform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };
    this.image = image;
    this.width = image.width;
    this.height = image.height;
  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

const createImage = (imageSrc) => {
  const image = new Image();
  image.src = imageSrc;
  return image;
};

let platformImg = createImage(images.platform);
let backgroundImg = createImage(images.background);
let hillsImg = createImage(images.hills);
let platformSmallTallImg = createImage(images.platformSmallTall);

let player = new Player();
let platforms = [];

let genericObjects = [];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

const init = () => {
  player = new Player();
  platforms = [
    new Platform({
      x:
        platformImg.width * 4 +
        300 -
        2 +
        platformImg.width -
        platformSmallTallImg.width,
      y: 270,
      image: platformSmallTallImg,
    }),
    new Platform({ x: -1, y: 470, image: platformImg }),
    new Platform({
      x: platformImg.width - 3,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 2 + 100,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 3 + 300,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 4 + 300 - 2,
      y: 470,
      image: platformImg,
    }),
    new Platform({
      x: platformImg.width * 5 + 800 - 2,
      y: 470,
      image: platformImg,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: backgroundImg,
    }),
    new GenericObject({
      x: 0,
      y: 0,
      image: hillsImg,
    }),
  ];

  scrollOffset = 0;
};
function animate() {
  window.requestAnimationFrame(animate);
  // c.clearRect(0, 0, canvas.width, canvas.height);
  c.fillStyle = 'white';
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((genericObject) => {
    genericObject.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });
  player.update();

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;
    if (keys.right.pressed) {
      scrollOffset += player.speed;
      platforms.forEach((platform) => {
        platform.position.x -= player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.6;
      });
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed;
      platforms.forEach((platform) => {
        platform.position.x += player.speed;
      });
      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.6;
      });
    }
  }

  // Platform Collision Detection

  platforms.forEach((platform) => {
    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  // Win Condition
  if (scrollOffset > platformImg.width * 5 + 400 - 2) {
    console.log('Winner');
  }

  // Lose Condition
  if (player.position.y > canvas.height) {
    init();
  }
}

init();
animate();

const playerStateChange = (playerState) => {
  player.currentSprite = player.sprites[playerState].image;
  player.currentCropWidth = player.sprites[playerState].cropWidth;
  player.currentCropHeight = player.sprites[playerState].cropHeight;
  player.frameMax = player.sprites[playerState].finalFrame;
};

window.addEventListener('keydown', ({ key }) => {
  switch (key) {
    case 'ArrowLeft':
      keys.left.pressed = true;
      break;
    case 'ArrowRight':
      keys.right.pressed = true;
      playerStateChange('dash');
      break;
    case 'ArrowUp':
      player.velocity.y -= 20;
      break;
    case 'ArrowDown':
      break;
  }
});

window.addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'ArrowLeft':
      keys.left.pressed = false;
      break;
    case 'ArrowRight':
      keys.right.pressed = false;
      playerStateChange('idle');
      break;
    case 'ArrowUp':
      break;
    case 'ArrowDown':
      break;
  }
});
