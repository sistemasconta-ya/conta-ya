const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function build() {
  const targetW = 601;
  const targetH = 580;

  // Layer 1: Underlay SVG (Floor shadows + Left Phone Full Restoration)
  // Since left phone is behind right phone, anything for left phone placed in underlay
  // will show through the transparent cuts of the original image, and be naturally occluded
  // by the right phone where the right phone has opaque pixels!
  const underlaySvg = `
  <svg width="${targetW}" height="${targetH}" viewBox="0 0 ${targetW} ${targetH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Floor shadows -->
      <radialGradient id="shadowLeft" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#05120c" stop-opacity="0.30"/>
        <stop offset="50%" stop-color="#05120c" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="#05120c" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="shadowRight" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#040e09" stop-opacity="0.38"/>
        <stop offset="55%" stop-color="#040e09" stop-opacity="0.15"/>
        <stop offset="100%" stop-color="#040e09" stop-opacity="0"/>
      </radialGradient>

      <!-- Titanium metal edge gradient for left phone top-left -->
      <linearGradient id="tiLeftTop" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#a0a1a5"/>
        <stop offset="35%" stop-color="#5a5b5f"/>
        <stop offset="70%" stop-color="#2c2d30"/>
        <stop offset="100%" stop-color="#121314"/>
      </linearGradient>

      <!-- Titanium metal edge gradient for left phone bottom -->
      <linearGradient id="tiLeftBot" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#2a2b2e"/>
        <stop offset="60%" stop-color="#5e5f64"/>
        <stop offset="85%" stop-color="#9a9ba0"/>
        <stop offset="100%" stop-color="#242527"/>
      </linearGradient>
    </defs>

    <!-- 0. Ground contact shadows -->
    <ellipse cx="155" cy="528" rx="105" ry="14" fill="url(#shadowLeft)"/>
    <ellipse cx="420" cy="558" rx="125" ry="16" fill="url(#shadowRight)"/>

    <!-- 1. LEFT PHONE TOP-LEFT CORNER -->
    <!-- Screen mint fill for the cut -->
    <path d="M 36 65 C 36 40 48 24 85 15 L 85 45 C 55 45 46 55 46 65 Z" fill="#e2f3ea"/>

    <!-- Left phone black inner bezel at top-left -->
    <!-- Screen boundary is around x=48, y=28, outer bezel boundary is x=38, y=17 -->
    <path d="M 37 68 C 37 38 48 18 88 15 L 88 24 C 55 24 45 38 45 68 Z" fill="#060708"/>

    <!-- Outer titanium frame -->
    <path d="M 35 68 C 35 36 47 16 88 13 L 88 17 C 49 19 38 38 38 68 Z" fill="url(#tiLeftTop)"/>
    <!-- Highlight stroke -->
    <path d="M 35.5 68 C 35.5 37 47 17 88 14" fill="none" stroke="#b0b2b6" stroke-width="1" opacity="0.85"/>

    <!-- 2. LEFT PHONE BOTTOM RESTORATION -->
    <!-- Screen mint fill extending to bottom screen curve -->
    <path d="M 46 480 C 47 495 56 507 80 514 C 95 517 125 518 290 518 L 290 480 Z" fill="#d8eee3"/>

    <!-- Left phone black inner bezel -->
    <!-- Curves from (x=46, y=475) down to (x=80, y=524) across to x=290 -->
    <path d="M 44 475 C 45 496 55 513 80 522 C 105 526 150 527 290 527 L 290 516 C 150 516 105 515 84 511 C 60 504 53 490 53 475 Z" fill="#060708"/>

    <!-- Left phone outer titanium chassis -->
    <path d="M 39 470 C 40 498 50 520 78 530 C 105 536 150 537 290 537 L 290 526 C 150 526 105 525 80 520 C 52 511 44 494 44 470 Z" fill="url(#tiLeftBot)"/>
    <!-- Titanium outer highlight rim -->
    <path d="M 39.5 470 C 40.5 499 50.5 521 79 531 C 106 537 151 538 290 538" fill="none" stroke="#9da0a6" stroke-width="1.2" opacity="0.85"/>
  </svg>
  `;

  // Layer 3: Overlay SVG (Right Phone Full Bottom Restoration)
  // Sits on top of the padded original image to cleanly close and finish the right phone bottom!
  const overlaySvg = `
  <svg width="${targetW}" height="${targetH}" viewBox="0 0 ${targetW} ${targetH}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <!-- Titanium gradient for right phone bottom -->
      <linearGradient id="tiRightBot" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#232426"/>
        <stop offset="50%" stop-color="#525357"/>
        <stop offset="85%" stop-color="#9ea0a5"/>
        <stop offset="100%" stop-color="#1c1d1f"/>
      </linearGradient>
    </defs>

    <!-- RIGHT PHONE SCREEN EXTENSION -->
    <!-- The white screen extends cleanly down to y=538, with rounded corners matching iPhone specs -->
    <path d="M 308 505 L 308 522 C 309 532 320 540 338 542 C 360 543 418 543 418 543 C 418 543 476 543 498 542 C 516 540 527 532 528 522 L 528 505 Z" fill="#fcfdfd"/>

    <!-- Subtle bottom screen separator / margin highlight -->
    <path d="M 320 532 C 330 539 346 542 368 542 L 468 542 C 490 542 506 539 516 532" fill="none" stroke="#f0f1f2" stroke-width="1"/>

    <!-- iOS Home Indicator Bar -->
    <rect x="368" y="534" width="100" height="4.5" rx="2.25" fill="#1c1c1e" opacity="0.35"/>

    <!-- RIGHT PHONE INNER BLACK BEZEL -->
    <!-- Smooth continuous bezel: thickness ~11px -->
    <!-- Outer boundary of bezel: (x=297, y=470) to (x=542, y=470) -->
    <!-- Inner boundary of bezel: (x=308, y=470) to (x=528, y=470) -->
    <path d="
      M 297 470 
      L 297 502 
      C 298 518 307 536 328 548 
      C 350 554 384 555 418 555 
      C 452 555 486 554 508 548 
      C 529 536 538 518 539 502 
      L 539 470 
      L 528 470 
      L 528 502 
      C 527 516 518 530 499 540 
      C 480 545 450 546 418 546 
      C 386 546 356 545 337 540 
      C 318 530 309 516 308 502 
      L 308 470 
      Z" 
      fill="#060708"/>

    <!-- RIGHT PHONE OUTER TITANIUM FRAME -->
    <!-- Titanium chassis wraps outside the bezel: thickness ~4px -->
    <path d="
      M 295 470 
      L 295 503 
      C 296 524 306 544 329 557 
      C 352 564 384 565 418 565 
      C 452 565 484 564 507 557 
      C 530 544 540 524 541 503 
      L 541 470 
      L 538.5 470 
      L 538.5 503 
      C 537.5 522 528 541 506 553 
      C 483 560 451 561 418 561 
      C 385 561 353 560 330 553 
      C 308 541 298.5 522 297.5 503 
      L 297.5 470 
      Z" 
      fill="url(#tiRightBot)"/>

    <!-- Metallic edge highlight stroke -->
    <path d="
      M 295 470 
      L 295 503 
      C 296 525 306 545 329 558 
      C 352 565 384 566 418 566 
      C 452 566 484 565 507 558 
      C 530 545 540 525 541 503 
      L 541 470" 
      fill="none" 
      stroke="#a3a6ab" 
      stroke-width="1.2" 
      opacity="0.9"/>
  </svg>
  `;

  // 1. Create base transparent image of 601 x 580
  const base = sharp({
    create: {
      width: targetW,
      height: targetH,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    }
  });

  // 2. Pad original image to 601 x 580
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

  // Composite: Base -> Underlay -> Padded Original -> Overlay
  const finalImage = await sharp(underlayBuffer)
    .composite([
      { input: paddedOrig, blend: 'over' },
      { input: overlayBuffer, blend: 'over' }
    ])
    .png()
    .toBuffer();

  const outPath = 'C:/Users/Ivan Monte/.gemini/antigravity-ide/brain/c9f43b07-cddc-4b09-aed3-0836bd3f85c9/test_phones_v2.png';
  fs.writeFileSync(outPath, finalImage);
  console.log('Saved test_phones_v2.png');
}

build();
