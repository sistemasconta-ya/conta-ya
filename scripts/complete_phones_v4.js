const sharp = require('sharp');
const fs = require('fs');

async function buildV4() {
  const targetW = 601;
  const targetH = 575;

  // Layer 1: Underlay SVG (Shadows + Left Phone Restoration)
  const underlaySvg = `
  <svg width="${targetW}" height="${targetH}" viewBox="0 0 ${targetW} ${targetH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Floor contact shadows -->
      <radialGradient id="shadowLeft" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#020a06" stop-opacity="0.32"/>
        <stop offset="50%" stop-color="#020a06" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#020a06" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="shadowRight" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#020a06" stop-opacity="0.40"/>
        <stop offset="50%" stop-color="#020a06" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#020a06" stop-opacity="0"/>
      </radialGradient>

      <!-- Titanium metal edge gradient for left phone top-left -->
      <linearGradient id="tiLeftTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#9ea0a5"/>
        <stop offset="40%" stop-color="#55565a"/>
        <stop offset="75%" stop-color="#28292c"/>
        <stop offset="100%" stop-color="#121314"/>
      </linearGradient>

      <!-- Titanium metal edge gradient for left phone bottom -->
      <linearGradient id="tiLeftBot" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#28292c"/>
        <stop offset="50%" stop-color="#505155"/>
        <stop offset="85%" stop-color="#8e8f94"/>
        <stop offset="100%" stop-color="#202123"/>
      </linearGradient>
    </defs>

    <!-- 0. Ground contact shadows -->
    <ellipse cx="155" cy="524" rx="95" ry="11" fill="url(#shadowLeft)"/>
    <ellipse cx="418" cy="556" rx="120" ry="14" fill="url(#shadowRight)"/>

    <!-- 1. LEFT PHONE TOP-LEFT CORNER RESTORATION -->
    <!-- Screen mint underlay for the bite cut -->
    <path d="M 44 68 C 44 55 52 42 75 32 L 75 45 C 58 48 52 58 52 68 Z" fill="#e5f5ed"/>

    <!-- Left phone black inner bezel at top-left: from (x=41, y=68) to (x=75, y=31) -->
    <path d="M 40 68 C 40 50 49 37 75 30 L 75 37 C 53 39 46 51 46 68 Z" fill="#060708"/>

    <!-- Left phone outer titanium frame at top-left -->
    <path d="M 37.5 68 C 37.5 48 47 34 75 27.5 L 75 30.5 C 49 33 40 49 40 68 Z" fill="url(#tiLeftTop)"/>
    <!-- Outer highlight rim stroke -->
    <path d="M 38 68 C 38 48 47.5 34 75 28" fill="none" stroke="#b2b4b8" stroke-width="1.1" opacity="0.85"/>

    <!-- 2. LEFT PHONE BOTTOM RESTORATION -->
    <!-- Screen mint fill extending to bottom screen curve -->
    <path d="M 48 470 C 49 490 55 502 75 508 C 95 512 130 513 285 513 L 285 470 Z" fill="#d9eee4"/>

    <!-- Left phone black inner bezel at bottom -->
    <path d="M 43 470 C 44 492 53 506 74 515 C 96 520 135 521 285 521 L 285 512 C 135 512 96 511 76 507 C 57 499 50 487 50 470 Z" fill="#060708"/>

    <!-- Left phone outer titanium chassis at bottom -->
    <path d="M 38.5 470 C 39.5 494 49 511 72 521 C 95 526 135 527 285 527 L 285 520 C 135 520 95 519 74 515 C 52 506 43 490 43 470 Z" fill="url(#tiLeftBot)"/>
    <!-- Outer highlight rim stroke -->
    <path d="M 39 470 C 40 495 49.5 512 72.5 522 C 95.5 527 135.5 528 285 528" fill="none" stroke="#9da0a6" stroke-width="1.2" opacity="0.85"/>
  </svg>
  `;

  // Layer 2: Overlay SVG (Right Phone Full Bottom Restoration)
  const overlaySvg = `
  <svg width="${targetW}" height="${targetH}" viewBox="0 0 ${targetW} ${targetH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="tiRightBot" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#232426"/>
        <stop offset="50%" stop-color="#55565a"/>
        <stop offset="85%" stop-color="#9ea0a5"/>
        <stop offset="100%" stop-color="#1c1d1f"/>
      </linearGradient>
    </defs>

    <!-- RIGHT PHONE SCREEN EXTENSION -->
    <!-- White background seamlessly closing the Coach card and bottom screen -->
    <path d="
      M 307 485 
      L 307 518 
      C 308 529 318 537 338 540 
      C 360 541 418 541 418 541 
      C 418 541 476 541 498 540 
      C 518 537 528 529 529 518 
      L 529 485 
      Z" 
      fill="#ffffff"/>

    <!-- Subtle bottom screen separator line -->
    <path d="M 322 529 C 332 537 348 540 370 540 L 466 540 C 488 540 504 537 514 529" fill="none" stroke="#f1f2f3" stroke-width="1"/>

    <!-- iOS Home Indicator Pill -->
    <rect x="373" y="533" width="90" height="4.5" rx="2.25" fill="#1b1c1e" opacity="0.4"/>

    <!-- RIGHT PHONE INNER BLACK BEZEL -->
    <path d="
      M 296.5 470 
      L 296.5 498 
      C 297.5 515 306.5 533 328 545 
      C 350 551 384 552 418 552 
      C 452 552 486 551 508 545 
      C 529.5 533 538.5 515 539.5 498 
      L 539.5 470 
      L 529 470 
      L 529 498 
      C 528 512 519 526 500 536 
      C 480 541 450 542 418 542 
      C 386 542 356 541 336 536 
      C 317 526 308 512 307 498 
      L 307 470 
      Z" 
      fill="#060708"/>

    <!-- RIGHT PHONE OUTER TITANIUM CHASSIS -->
    <path d="
      M 294.5 470 
      L 294.5 499 
      C 295.5 520 305.5 541 329 554 
      C 352 561 384 562 418 562 
      C 452 562 484 561 507 554 
      C 530.5 541 540.5 520 541.5 499 
      L 541.5 470 
      L 539 470 
      L 539 499 
      C 538 518 528.5 537 506 550 
      C 483 557 451 558 418 558 
      C 385 558 353 557 330 550 
      C 307.5 537 298 518 297 499 
      L 297 470 
      Z" 
      fill="url(#tiRightBot)"/>

    <!-- Outer titanium metallic highlight stroke -->
    <path d="
      M 294.5 470 
      L 294.5 499 
      C 295.5 521 305.5 542 329 555 
      C 352 562 384 563 418 563 
      C 452 563 484 562 507 555 
      C 530.5 542 540.5 521 541.5 499 
      L 541.5 470" 
      fill="none" 
      stroke="#a4a7ac" 
      stroke-width="1.2" 
      opacity="0.9"/>
  </svg>
  `;

  // Pad original image from height 549 to targetH 575
  const paddedOrig = await sharp('public/landing-phones.png')
    .extend({
      top: 0,
      bottom: targetH - 549,
      left: 0,
      right: 0,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  const underlayBuffer = Buffer.from(underlaySvg);
  const overlayBuffer = Buffer.from(overlaySvg);

  const finalImage = await sharp(underlayBuffer)
    .composite([
      { input: paddedOrig, blend: 'over' },
      { input: overlayBuffer, blend: 'over' }
    ])
    .png()
    .toBuffer();

  const outPath = 'C:/Users/Ivan Monte/.gemini/antigravity-ide/brain/c9f43b07-cddc-4b09-aed3-0836bd3f85c9/test_phones_v4.png';
  fs.writeFileSync(outPath, finalImage);
  console.log('Saved test_phones_v4.png');
}

buildV4();
