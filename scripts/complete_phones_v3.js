const sharp = require('sharp');
const fs = require('fs');

async function buildV3() {
  const targetW = 601;
  const targetH = 575;

  // 1. Underlay SVG: Ground Shadows + Left Phone Full Geometry
  const underlaySvg = `
  <svg width="${targetW}" height="${targetH}" viewBox="0 0 ${targetW} ${targetH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Floor contact shadows -->
      <radialGradient id="shadowLeft" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#030d08" stop-opacity="0.35"/>
        <stop offset="45%" stop-color="#030d08" stop-opacity="0.14"/>
        <stop offset="100%" stop-color="#030d08" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="shadowRight" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#030d08" stop-opacity="0.40"/>
        <stop offset="50%" stop-color="#030d08" stop-opacity="0.16"/>
        <stop offset="100%" stop-color="#030d08" stop-opacity="0"/>
      </radialGradient>

      <!-- Titanium metal edge gradient for left phone top-left -->
      <linearGradient id="tiLeftTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a8a9ad"/>
        <stop offset="40%" stop-color="#55565a"/>
        <stop offset="75%" stop-color="#28292c"/>
        <stop offset="100%" stop-color="#0e0f10"/>
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
    <ellipse cx="155" cy="522" rx="100" ry="12" fill="url(#shadowLeft)"/>
    <ellipse cx="418" cy="554" rx="125" ry="15" fill="url(#shadowRight)"/>

    <!-- 1. LEFT PHONE TOP-LEFT CORNER RESTORATION -->
    <!-- Screen mint underlay for the bite cut -->
    <path d="M 40 65 Q 40 45 55 38 Q 65 32 82 30 L 82 45 Q 65 46 54 55 Q 48 62 48 65 Z" fill="#e5f5ed"/>

    <!-- Left phone black inner bezel at top-left: from (x=41, y=65) to (x=80, y=31) -->
    <path d="M 39 65 C 39 46 48 35 78 28.5 L 78 35.5 C 53 38 45 48 45 65 Z" fill="#060708"/>

    <!-- Left phone outer titanium frame at top-left -->
    <path d="M 36.5 65 C 36.5 44 46 32 78 26.5 L 78 29.5 C 48 33 39 45 39 65 Z" fill="url(#tiLeftTop)"/>
    <!-- Outer highlight rim stroke -->
    <path d="M 37 65 C 37 44 47 32 78 27" fill="none" stroke="#b2b4b8" stroke-width="1.1" opacity="0.85"/>

    <!-- 2. LEFT PHONE BOTTOM RESTORATION -->
    <!-- Screen mint fill extending to bottom screen curve -->
    <path d="M 46 470 C 47 490 55 504 75 510 C 95 513 130 514 285 514 L 285 470 Z" fill="#d9eee4"/>

    <!-- Left phone black inner bezel at bottom -->
    <path d="M 43 470 C 44 492 53 508 76 517 C 98 521 135 522 285 522 L 285 513 C 135 513 98 512 78 508 C 58 501 51 488 51 470 Z" fill="#060708"/>

    <!-- Left phone outer titanium chassis at bottom -->
    <path d="M 38.5 470 C 39.5 494 49 513 74 523 C 97 528 135 529 285 529 L 285 521 C 135 521 97 520 76 516 C 52 507 43 491 43 470 Z" fill="url(#tiLeftBot)"/>
    <!-- Outer highlight rim stroke -->
    <path d="M 39 470 C 40 495 49.5 514 74.5 524 C 97.5 529 135.5 530 285 530" fill="none" stroke="#9da0a6" stroke-width="1.2" opacity="0.85"/>
  </svg>
  `;

  // 2. Overlay SVG: Right Phone Full Bottom Restoration
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
      M 307 495 
      L 307 518 
      C 308 529 318 537 338 540 
      C 360 541 418 541 418 541 
      C 418 541 476 541 498 540 
      C 518 537 528 529 529 518 
      L 529 495 
      Z" 
      fill="#ffffff"/>

    <!-- Subtle bottom screen separator line -->
    <path d="M 322 529 C 332 537 348 540 370 540 L 466 540 C 488 540 504 537 514 529" fill="none" stroke="#f1f2f3" stroke-width="1"/>

    <!-- iOS Home Indicator Pill -->
    <rect x="373" y="533" width="90" height="4.5" rx="2.25" fill="#1b1c1e" opacity="0.4"/>

    <!-- RIGHT PHONE INNER BLACK BEZEL -->
    <!-- Outer boundary of bezel: (x=296.5, y=470) to (x=540, y=470) -->
    <!-- Inner boundary of bezel: (x=307, y=470) to (x=529, y=470) -->
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

  const outPath = 'C:/Users/Ivan Monte/.gemini/antigravity-ide/brain/c9f43b07-cddc-4b09-aed3-0836bd3f85c9/test_phones_v3.png';
  fs.writeFileSync(outPath, finalImage);
  console.log('Saved test_phones_v3.png');
}

buildV3();
