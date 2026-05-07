'use client';

import { Howl } from 'howler';

const sounds = {
  correct: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3'], volume: 0.5 }), // Blip/Success
  wrong: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2003/2003-preview.mp3'], volume: 0.5 }), // Buzz/Error
  click: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], volume: 0.3 }), // Click
  gameOver: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/2012/2012-preview.mp3'], volume: 0.6 }), // Game Over
  levelUp: new Howl({ src: ['https://assets.mixkit.co/active_storage/sfx/1993/1993-preview.mp3'], volume: 0.5 }), // Level up chime
};

export const playSound = (type: keyof typeof sounds) => {
  try {
    sounds[type].play();
  } catch (e) {
    console.warn('Audio playback failed', e);
  }
};
