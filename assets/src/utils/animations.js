export default function makeAnimations(scene) {
  const defaultConfig = {
    frameRate: 10,
    repeat: -1,
  };

  // PLAYER
  scene.anims.create({
    key: 'up',
    frames: scene.anims.generateFrameNames('player', { start: 4, end: 7 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'down',
    frames: scene.anims.generateFrameNames('player', { start: 0, end: 3 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'right',
    frames: scene.anims.generateFrameNames('player', { start: 12, end: 15 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'left',
    frames: scene.anims.generateFrameNames('player', { start: 8, end: 11 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'upStanding',
    frames: scene.anims.generateFrameNames('player', { start: 4, end: 4 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'downStanding',
    frames: scene.anims.generateFrameNames('player', { start: 0, end: 0 }),
  });

  scene.anims.create({
    key: 'rightStanding',
    frames: scene.anims.generateFrameNames('player', { start: 12, end: 12 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'leftStanding',
    frames: scene.anims.generateFrameNames('player', { start: 8, end: 8 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'death',
    frames: scene.anims.generateFrameNames('player', { start: 16, end: 19 }),
    frameRate: 5,
  });

  // CatBullets
  scene.anims.create({
    key: 'catFly',
    frames: scene.anims.generateFrameNames('catBullet', { start: 0, end: 1 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'catFart',
    frames: scene.anims.generateFrameNames('catFart', { start: 0, end: 4 }),
    frameRate: 7,
  });

  scene.anims.create({
    key: 'bang',
    frames: scene.anims.generateFrameNames('bang', { start: 0, end: 5 }),
    frameRate: 7,
  });
}
