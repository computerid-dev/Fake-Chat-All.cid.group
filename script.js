/* =========================================================
   Fake Chat [all] — by Computer[ID]•GROUP
   script.js — Engine generator gambar (100% client-side canvas,
   tidak butuh koneksi internet / server sama sekali).
   ========================================================= */

const FONT_STACK = '-apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

/* ---------------- Helpers umum ---------------- */

function loadImageFromSrc(src) {
  return new Promise((resolve, reject) => {
    if (!src) { reject(new Error('Tidak ada gambar')); return; }
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Gagal memuat gambar'));
    img.src = src;
  });
}

function drawRoundedRect(ctx, x, y, w, h, r, fill, stroke) {
  const radius = Math.max(0, Math.min(r, w / 2, h / 2));
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + w - radius, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + radius);
  ctx.lineTo(x + w, y + h - radius);
  ctx.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
  ctx.lineTo(x + radius, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.strokeStyle = stroke; ctx.stroke(); }
}

function drawCircleImage(ctx, img, cx, cy, radius) {
  if (!img) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fillStyle = '#3a3a3f';
    ctx.fill();
    ctx.restore();
    return;
  }
  const dim = Math.min(img.width, img.height);
  const sx = (img.width - dim) / 2;
  const sy = (img.height - dim) / 2;
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();
  ctx.drawImage(img, sx, sy, dim, dim, cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.restore();
}

function wrapText(ctx, text, maxWidth, font) {
  ctx.font = font;
  const rawLines = String(text || '').split('\n');
  const lines = [];
  rawLines.forEach((raw) => {
    const words = raw.split(' ');
    let cur = '';
    words.forEach((word, i) => {
      const test = cur ? cur + ' ' + word : word;
      if (ctx.measureText(test).width > maxWidth && cur) {
        lines.push(cur);
        cur = word;
      } else {
        cur = test;
      }
      if (i === words.length - 1 && cur) {
        // pushed at end of loop below
      }
    });
    lines.push(cur || '');
  });
  return lines.filter((l, i) => !(l === '' && rawLines.length === 1 && i > 0));
}

function coverDraw(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let sx, sy, sw, sh;
  if (imgRatio > boxRatio) {
    sh = img.height;
    sw = sh * boxRatio;
    sx = (img.width - sw) / 2;
    sy = 0;
  } else {
    sw = img.width;
    sh = sw / boxRatio;
    sx = 0;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function containDraw(ctx, img, x, y, w, h) {
  const imgRatio = img.width / img.height;
  const boxRatio = w / h;
  let fw, fh;
  if (imgRatio > boxRatio) { fw = w; fh = fw / imgRatio; }
  else { fh = h; fw = fh * imgRatio; }
  ctx.drawImage(img, x + (w - fw) / 2, y + (h - fh) / 2, fw, fh);
}

function statusBar(ctx, w, color = '#ffffff') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.font = `600 26px ${FONT_STACK}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  ctx.fillText(`${hh}:${mm}`, 40, 46);
  ctx.textAlign = 'right';
  ctx.font = `500 22px ${FONT_STACK}`;
  ctx.fillText('📶 🔋', w - 40, 46);
  ctx.restore();
}

/* =========================================================
   1) WHATSAPP
   ========================================================= */
async function generateWhatsApp(canvas, { text, timeStr, imgSrc, contactName }) {
  const W = 960, H = 1706;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // background wallpaper
  ctx.fillStyle = '#0b141a';
  ctx.fillRect(0, 0, W, H);
  ctx.save();
  ctx.globalAlpha = 0.035;
  for (let i = 0; i < 500; i++) {
    ctx.fillStyle = '#ffffff';
    const rx = Math.random() * W, ry = Math.random() * H, rr = Math.random() * 1.6;
    ctx.beginPath(); ctx.arc(rx, ry, rr, 0, Math.PI * 2); ctx.fill();
  }
  ctx.restore();

  statusBar(ctx, W);

  // header
  const headerH = 128;
  ctx.fillStyle = '#1f2c34';
  ctx.fillRect(0, 70, W, headerH);
  ctx.fillStyle = '#e9edef';
  ctx.font = `500 46px ${FONT_STACK}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('‹', 30, 70 + headerH / 2);
  drawCircleImage(ctx, null, 150, 70 + headerH / 2, 44);
  ctx.fillStyle = '#e9edef';
  ctx.font = `600 30px ${FONT_STACK}`;
  ctx.fillText(contactName || 'Kontak', 212, 70 + headerH / 2 - 14);
  ctx.fillStyle = '#8696a0';
  ctx.font = `400 22px ${FONT_STACK}`;
  ctx.fillText('online', 212, 70 + headerH / 2 + 18);
  ctx.fillStyle = '#e9edef';
  ctx.font = `400 34px ${FONT_STACK}`;
  ctx.textAlign = 'right';
  ctx.fillText('📹   📞   ⋮', W - 30, 70 + headerH / 2);

  const chatFontSize = 30;
  const maxWidthLimit = 560;
  const minBubbleWidth = 260;
  const lineHeight = chatFontSize + 14;
  const paddingX = 28;
  const paddingY = 20;
  const rad = 22;
  const fixedX = 40;
  const fixedBaseY = H - 260;
  const font = `400 ${chatFontSize}px ${FONT_STACK}`;

  ctx.font = `22px ${FONT_STACK}`;
  const timeWidth = ctx.measureText(timeStr || '12.00').width;

  let finalY, finalBubbleHeight, bubbleW;
  const caption = text || '';

  function bubblePath(x, y, w, h) {
    ctx.beginPath();
    ctx.moveTo(x + rad, y);
    ctx.lineTo(x + w - rad, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + rad);
    ctx.lineTo(x + w, y + h - rad);
    ctx.quadraticCurveTo(x + w, y + h, x + w - rad, y + h);
    ctx.lineTo(x + rad, y + h);
    ctx.quadraticCurveTo(x + 6, y + h, x + 6, y + h - 6);
    ctx.lineTo(x + 6, y + rad);
    ctx.quadraticCurveTo(x + 6, y, x + rad, y);
    ctx.closePath();
  }

  if (!imgSrc) {
    ctx.font = font;
    const chatLines = wrapText(ctx, caption || ' ', maxWidthLimit, font);
    let longestW = 0;
    chatLines.forEach((l) => { const w = ctx.measureText(l.trim()).width; if (w > longestW) longestW = w; });

    bubbleW = Math.max(longestW + paddingX * 2, timeWidth + 75, 180, minBubbleWidth * 0.6);
    finalBubbleHeight = (chatLines.length * lineHeight) + paddingY + 40;
    finalY = fixedBaseY - finalBubbleHeight;

    ctx.fillStyle = '#1f2c34';
    bubblePath(fixedX, finalY, bubbleW, finalBubbleHeight);
    ctx.fill();

    ctx.fillStyle = '#e9edef';
    ctx.font = font;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    chatLines.forEach((line, i) => {
      const lineY = finalY + paddingY + (i * lineHeight) + (chatFontSize / 2);
      ctx.fillText(line.trim(), fixedX + paddingX, lineY);
    });

    ctx.fillStyle = '#8696a0';
    ctx.font = '22px ' + FONT_STACK;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(timeStr || '12.00', fixedX + bubbleW - 20, finalY + finalBubbleHeight - 16);
  } else {
    const imgObj = await loadImageFromSrc(imgSrc);
    const imgAspect = imgObj.width / imgObj.height;
    bubbleW = Math.min(Math.max(imgObj.width / 2, minBubbleWidth), maxWidthLimit);
    let imgDrawH = Math.round(bubbleW / imgAspect);
    bubbleW = Math.max(bubbleW, timeWidth + 75);

    let captionLines = [];
    if (caption) {
      ctx.font = font;
      captionLines = wrapText(ctx, caption, bubbleW - paddingX * 2, font);
    }
    const captionH = captionLines.length > 0 ? paddingY + (captionLines.length * lineHeight) : 0;
    const timeRowH = 34;
    finalBubbleHeight = imgDrawH + captionH + timeRowH + (captionLines.length > 0 ? 6 : 0);
    finalY = fixedBaseY - finalBubbleHeight;

    ctx.fillStyle = '#1f2c34';
    bubblePath(fixedX, finalY, bubbleW, finalBubbleHeight);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.moveTo(fixedX + rad, finalY);
    ctx.lineTo(fixedX + bubbleW - rad, finalY);
    ctx.quadraticCurveTo(fixedX + bubbleW, finalY, fixedX + bubbleW, finalY + rad);
    ctx.lineTo(fixedX + bubbleW, finalY + imgDrawH);
    ctx.lineTo(fixedX + 6, finalY + imgDrawH);
    ctx.lineTo(fixedX + 6, finalY + rad);
    ctx.quadraticCurveTo(fixedX + 6, finalY, fixedX + rad, finalY);
    ctx.closePath();
    ctx.clip();
    coverDraw(ctx, imgObj, fixedX, finalY, bubbleW, imgDrawH);
    ctx.restore();

    if (captionLines.length > 0) {
      ctx.fillStyle = '#e9edef';
      ctx.font = font;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      captionLines.forEach((line, i) => {
        const lineY = finalY + imgDrawH + paddingY + (i * lineHeight) + (chatFontSize / 2);
        ctx.fillText(line.trim(), fixedX + paddingX, lineY);
      });
    }

    ctx.fillStyle = captionLines.length ? '#8696a0' : '#e9edef';
    ctx.font = '22px ' + FONT_STACK;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'alphabetic';
    ctx.fillText(timeStr || '12.00', fixedX + bubbleW - 20, finalY + finalBubbleHeight - 14);
  }

  // reaction bar (native color emoji, no external assets needed)
  const emojis = ['👍', '❤️', '😂', '😮', '😢', '🙏'];
  const emojiSize = 46;
  const emCardH = 96;
  const emCardW = Math.min(560, W - fixedX * 2 - 8);
  const emCardX = fixedX + 6;
  const emCardY = finalY - emCardH - 18;

  ctx.fillStyle = '#233138';
  drawRoundedRect(ctx, emCardX, emCardY, emCardW, emCardH, emCardH / 2, '#233138');

  const startX = emCardX + 55;
  const spacingX = (emCardW - 110) / 6;
  const emojiCY = emCardY + emCardH / 2;
  ctx.font = `${emojiSize}px ${FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  for (let i = 0; i < emojis.length; i++) {
    ctx.fillText(emojis[i], startX + i * spacingX, emojiCY + 2);
  }

  // input bar
  const inputY = H - 110;
  ctx.fillStyle = '#1f2c34';
  ctx.fillRect(0, inputY, W, 110);
  drawRoundedRect(ctx, 30, inputY + 20, W - 180, 70, 35, '#2a3942');
  ctx.fillStyle = '#8696a0';
  ctx.font = `24px ${FONT_STACK}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Ketik pesan', 60, inputY + 55);
  ctx.fillStyle = '#00a884';
  ctx.beginPath();
  ctx.arc(W - 80, inputY + 55, 42, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#0b141a';
  ctx.font = `28px ${FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.fillText('🎤', W - 80, inputY + 56);

  return canvas.toDataURL('image/png');
}

/* =========================================================
   2) TIKTOK
   ========================================================= */
async function generateTiktok(canvas, { username, chatText, avatarSrc }) {
  const W = 1080, H = 1920;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  // fake video background
  const grad = ctx.createLinearGradient(0, 0, 0, H);
  grad.addColorStop(0, '#232326');
  grad.addColorStop(1, '#0d0d0f');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  statusBar(ctx, W);

  // comment sheet
  const sheetY = 210;
  const sheetH = H - sheetY;
  ctx.fillStyle = '#161618';
  drawRoundedRect(ctx, 0, sheetY, W, sheetH, 28, '#161618');
  ctx.fillStyle = '#3d3d40';
  drawRoundedRect(ctx, W / 2 - 60, sheetY + 18, 120, 6, 3, '#3d3d40');

  ctx.fillStyle = '#ffffff';
  ctx.font = `600 34px ${FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('128 komentar', W / 2, sheetY + 70);

  let avatarImg = null;
  try { avatarImg = await loadImageFromSrc(avatarSrc); } catch (e) { avatarImg = null; }

  const cfg = {
    ppX: 105, ppY: sheetY + 170, ppR: 44,
    nameX: 172, nameY: sheetY + 150, nameSize: 30,
    textX: 172, textY: sheetY + 200, textSize: 30,
  };

  drawCircleImage(ctx, avatarImg, cfg.ppX, cfg.ppY, cfg.ppR);

  ctx.fillStyle = '#8a8a8e';
  ctx.font = `500 ${cfg.nameSize}px ${FONT_STACK}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(username || 'user', cfg.nameX, cfg.nameY);

  const bubbleMaxW = W - cfg.nameX - 60;
  const font = `400 ${cfg.textSize}px ${FONT_STACK}`;
  const lines = wrapText(ctx, chatText || '', bubbleMaxW, font);
  const lineH = cfg.textSize * 1.4;

  ctx.fillStyle = '#f2f2f2';
  ctx.font = font;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  lines.forEach((line, i) => {
    ctx.fillText(line, cfg.textX, cfg.textY + i * lineH);
  });

  const textBottom = cfg.textY + lines.length * lineH + 18;

  ctx.fillStyle = '#6b6b70';
  ctx.font = `400 24px ${FONT_STACK}`;
  ctx.fillText('2j    Balas', cfg.textX, textBottom);

  ctx.fillStyle = '#6b6b70';
  ctx.font = `28px ${FONT_STACK}`;
  ctx.textAlign = 'center';
  ctx.fillText('♡', W - 70, cfg.nameY + 10);
  ctx.font = `18px ${FONT_STACK}`;
  ctx.fillText('12', W - 70, cfg.nameY + 52);

  // menu (long-press style action list)
  const MENU = [
    { icon: '↩️', text: 'Balas' },
    { icon: '➤', text: 'Teruskan' },
    { icon: '⧉', text: 'Salin' },
    { icon: '🌐', text: 'Terjemahkan' },
    { icon: '🗑️', text: 'Hapus untuk saya' },
    { icon: '⚠️', text: 'Laporkan', danger: true },
  ];

  const menuX = 90, menuY = textBottom + 60;
  const menuW = W - 180, itemH = 92, menuH = MENU.length * itemH + 40;
  drawRoundedRect(ctx, menuX, menuY, menuW, menuH, 24, '#1f1f22');

  MENU.forEach((item, i) => {
    const cy = menuY + 20 + i * itemH + itemH / 2;
    ctx.font = `28px ${FONT_STACK}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(item.icon, menuX + 60, cy);
    ctx.fillStyle = item.danger ? '#ea4335' : '#f2f2f2';
    ctx.font = `500 30px ${FONT_STACK}`;
    ctx.textAlign = 'left';
    ctx.fillText(item.text, menuX + 130, cy);
  });

  return canvas.toDataURL('image/png');
}

/* =========================================================
   3) INSTAGRAM STORY
   ========================================================= */
async function generateIgStory(canvas, { nama, username, ppSrc, photoSrc }) {
  const W = 900, H = 1600;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  let photoImg = null, ppImg = null;
  try { photoImg = await loadImageFromSrc(photoSrc); } catch (e) {}
  try { ppImg = await loadImageFromSrc(ppSrc); } catch (e) {}

  const zone = { x: 0, y: 0, w: W, h: H };
  if (photoImg) {
    ctx.save();
    ctx.filter = 'blur(30px)';
    coverDraw(ctx, photoImg, -40, -40, W + 80, H + 80);
    ctx.filter = 'none';
    ctx.restore();
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.15)';
    ctx.fillRect(0, 0, W, H);
    containDraw(ctx, photoImg, 0, 0, W, H);
    ctx.restore();
  } else {
    ctx.fillStyle = '#1a1a1d';
    ctx.fillRect(0, 0, W, H);
  }

  // top gradient for legibility
  const topGrad = ctx.createLinearGradient(0, 0, 0, 220);
  topGrad.addColorStop(0, 'rgba(0,0,0,0.55)');
  topGrad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, W, 220);

  // progress bar
  ctx.save();
  drawRoundedRect(ctx, 20, 24, W - 40, 5, 3, 'rgba(255,255,255,0.35)');
  drawRoundedRect(ctx, 20, 24, (W - 40) * 0.62, 5, 3, '#ffffff');
  ctx.restore();

  // profile row
  const pp = { x: 60, y: 84, size: 76 };
  drawCircleImage(ctx, ppImg, pp.x, pp.y, pp.size / 2);
  ctx.fillStyle = 'rgba(255,255,255,0.9)';
  ctx.beginPath();
  ctx.arc(pp.x, pp.y, pp.size / 2 + 2, 0, Math.PI * 2);
  ctx.lineWidth = 2;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = `600 30px ${FONT_STACK}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(nama || 'Someone', pp.x + 52, pp.y - 28);

  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.font = `400 22px ${FONT_STACK}`;
  ctx.fillText(username || '@username', pp.x + 52, pp.y + 8);

  // bottom message input bar (realism)
  const bottomY = H - 130;
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, 30, bottomY, W - 140, 76, 38, null, 'rgba(255,255,255,0.7)');
  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = `400 26px ${FONT_STACK}`;
  ctx.textBaseline = 'middle';
  ctx.fillText('Kirim pesan', 60, bottomY + 40);
  ctx.font = `34px ${FONT_STACK}`;
  ctx.fillText('❤️      📤', W - 100, bottomY + 40);

  return canvas.toDataURL('image/png');
}

/* =========================================================
   4) KOMPAS (kartu berita)
   ========================================================= */
async function generateKompas(canvas, { newsText, photoSrc }) {
  const W = 960, H = 1520;
  canvas.width = W; canvas.height = H;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#0d1b2a';
  ctx.fillRect(0, 0, W, H);

  // top brand bar
  const barH = 96;
  ctx.fillStyle = '#005ba1';
  ctx.fillRect(0, 0, W, barH);
  ctx.fillStyle = '#ffffff';
  ctx.font = `800 40px ${FONT_STACK}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('KOMPAS', 30, barH / 2);
  ctx.fillStyle = '#ffd400';
  ctx.font = `800 40px ${FONT_STACK}`;
  ctx.fillText('.com', 30 + ctx.measureText('KOMPAS').width, barH / 2);

  ctx.fillStyle = 'rgba(255,255,255,0.75)';
  ctx.font = `500 22px ${FONT_STACK}`;
  ctx.textAlign = 'right';
  ctx.fillText('NEWS', W - 30, barH / 2);

  // headline area
  const text = String(newsText || 'Judul berita').replace(/\s+/g, ' ').trim();
  const words = text.split(' ');
  const fontSize = words.length <= 14 ? 58 : 44;
  const lineGap = 14;
  const lineHeight = fontSize + lineGap;
  const font = `700 ${fontSize}px ${FONT_STACK}`;

  ctx.font = font;
  ctx.fillStyle = '#f5f8fb';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';

  let lines = wrapText(ctx, text, W - 70, font);
  if (lines.length > 6) { lines = lines.slice(0, 5); lines.push('...'); }

  const textY = barH + 46;
  lines.forEach((line, i) => ctx.fillText(line, 34, textY + i * lineHeight));

  // meta row
  const metaY = textY + lines.length * lineHeight + 18;
  ctx.fillStyle = '#93a5b8';
  ctx.font = `400 22px ${FONT_STACK}`;
  const now = new Date();
  const tanggal = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  ctx.fillText(`Kompas.com — ${tanggal}`, 34, metaY);

  // photo area
  const photoY = metaY + 54;
  const photoH = H - photoY - 30;
  let photoImg = null;
  try { photoImg = await loadImageFromSrc(photoSrc); } catch (e) {}

  ctx.save();
  drawRoundedRect(ctx, 0, photoY, W, photoH, 0);
  ctx.clip();
  if (photoImg) {
    ctx.filter = 'blur(24px)';
    coverDraw(ctx, photoImg, -30, photoY - 30, W + 60, photoH + 60);
    ctx.filter = 'none';
    containDraw(ctx, photoImg, 0, photoY, W, photoH);
  } else {
    ctx.fillStyle = '#1c2b3a';
    ctx.fillRect(0, photoY, W, photoH);
    ctx.fillStyle = '#4c6072';
    ctx.font = `26px ${FONT_STACK}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Tidak ada foto', W / 2, photoY + photoH / 2);
  }
  ctx.restore();

  // caption strip
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, H - 56, W, 56);
  ctx.fillStyle = '#d7e2ec';
  ctx.font = `400 20px ${FONT_STACK}`;
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  ctx.fillText('Ilustrasi. Sumber foto: dokumen pribadi', 24, H - 28);

  return canvas.toDataURL('image/png');
}

/* expose */
window.ChatGenerators = { generateWhatsApp, generateTiktok, generateIgStory, generateKompas };
