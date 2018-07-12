export default function makeAnimations(scene) {
  const defaultConfig = {
    frameRate: 10,
    repeat: -1,
  };

  scene.anims.create({
    key: 'stand',
    frames: scene.anims.generateFrameNames('player', { start: 0, end: 0 }),
  });

  scene.anims.create({
    key: 'up',
    frames: scene.anims.generateFrameNames('player', { start: 3, end: 5 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'down',
    frames: scene.anims.generateFrameNames('player', { start: 1, end: 2 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'right',
    frames: scene.anims.generateFrameNames('player', { start: 6, end: 8 }),
    ...defaultConfig,
  });

  scene.anims.create({
    key: 'left',
    frames: scene.anims.generateFrameNames('player', { start: 6, end: 8 }),
    ...defaultConfig,
  });
}
