import gsap from "gsap";
import React, { useEffect } from "react";

const index = () => {
  useEffect(()=>{
    const canvas = document.getElementById('waitlist-canvas');
  const ctx = canvas.getContext('2d');

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const center = { x: mouse.x, y: mouse.y };
  const state = { forceScale: 1, offset: 0 };

  const E = {
    imgSize: 80,
    gap: 60,
    step: 140,
    cols: 0,
    rows: 0,
    maxDistance: 300
  };

  const images = [
    'https://images.unsplash.com/photo-1682686581498-5e85c7228119?w=600',
    'https://images.unsplash.com/photo-1753024678427-3bd878f1d5d8?w=600',
    'https://images.unsplash.com/photo-1752759667426-be8b901c5fc5?w=600',
    'https://plus.unsplash.com/premium_photo-1752849704807-3142c7c23900?w=600',
    'https://images.unsplash.com/photo-1752867494754-f2f0accbc7d9?w=600',
  ];

  const w = images.map(url => ({ url, img: null, ratio: 1 }));

  function modulo(a, b) {
    return ((a % b) + b) % b;
  }

  function preload() {
    return Promise.all(w.map(data =>
      new Promise(resolve => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = data.url;
        img.onload = () => {
          data.img = img;
          data.ratio = img.width / img.height;
          resolve();
        };
      })
    ));
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    E.imgSize = window.innerHeight * 0.075;
    E.gap = window.innerHeight * 0.06;
    E.step = E.imgSize + E.gap;
    E.cols = Math.ceil(window.innerWidth / E.step) + 2;
    E.rows = Math.ceil(window.innerHeight / E.step);
    E.maxDistance = window.innerHeight * 0.3;
  }

  function draw(time, delta) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    center.x = gsap.utils.interpolate(center.x, mouse.x, delta * 0.005);
    center.y = gsap.utils.interpolate(center.y, mouse.y, delta * 0.005);

    state.offset += 150 * delta * 0.001; // floating speed

    for (let y = 0; y < E.rows; y++) {
      for (let x = 0; x < E.cols; x++) {
        const index = modulo(x + y * E.cols, w.length);
        const imgData = w[index];
        const ratio = imgData.ratio;

        let wSize, hSize;
        if (ratio > 1) {
          wSize = E.imgSize;
          hSize = wSize / ratio;
        } else {
          hSize = E.imgSize;
          wSize = hSize * ratio;
        }
// 
// Control speed
const floatSpeed = 80; // Increase this to make it faster
const verticalSpeed = 0.4; // Speed of upward motion
const waveAmplitude = 10;
const waveFrequency = 0.002;
// Calculate floating offsets
const xOffset = (x * E.step + state.offset * floatSpeed) % (canvas.width + E.step) - E.step;
const yOffset = (y * E.step - state.offset * floatSpeed * verticalSpeed) % (canvas.height + E.step) - E.step;

// 
        const floatX = ((x * E.step) + state.offset) % (canvas.width + E.step) - E.step;
        const posY = y * E.step;

        const dx = floatX + E.imgSize / 2 - center.x;
        const dy = posY + E.imgSize / 2 - center.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < E.maxDistance) {
          const proximityScale = Math.max(0, 4 - (dist / E.maxDistance) * 4);
          const scale = proximityScale * state.forceScale;

          const sw = wSize * scale;
          const sh = hSize * scale;

          ctx.drawImage(
            imgData.img,
            floatX + (E.imgSize - sw) / 2,
            posY + (E.imgSize - sh) / 2,
            sw,
            sh
          );
        }
      }
    }
  }

  function start() {
    gsap.ticker.add(draw);
    gsap.to(state, {
      forceScale: 1,
      duration: 0.6,
      ease: 'power2.inOut',
      overwrite: 'auto',
    });
  }

  preload().then(() => {
    resize();
    start();

    gsap.fromTo(state, 
      { forceScale: 1 }, 
      {
        duration: 1.5,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        forceScale: 1.15
      }
    );
  });

  window.addEventListener('resize', resize);
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  },[])
  return (
    <>
      <canvas id="waitlist-canvas"></canvas>

      <div className="cta-container">
        <h1>Be the first to join</h1>
        <button>Join Waitlist</button>
      </div>
    </>
  );
};

export default index;
