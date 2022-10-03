const rName = 'Rogue';

const rIdle = {};
rIdle.height = 101;
rIdle.width = 95;
rIdle.img = new Image();
rIdle.img.src =
  'https://cdn.discordapp.com/attachments/979434546271510639/979434649719832626/idle.png';
rIdle.img.alt = rName;
export const Rogue = {
  Idle: rIdle,
  rName,
};
