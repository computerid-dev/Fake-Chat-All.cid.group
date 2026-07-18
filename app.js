/* =========================================================
   Fake Chat [all] — by Computer[ID]•GROUP
   app.js — UI wiring, PWA install, offline status, service worker
   ========================================================= */

(function () {
  'use strict';

  /* ---------------- Service worker ---------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('sw.js').catch((err) => {
        console.warn('SW registration failed:', err);
      });
    });
  }

  /* ---------------- Offline status banner ---------------- */
  const statusBanner = document.getElementById('statusBanner');
  function updateOnlineStatus() {
    if (!statusBanner) return;
    if (navigator.onLine) statusBanner.classList.remove('show');
    else statusBanner.classList.add('show');
  }
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();

  /* ---------------- Install prompt (PWA -> "apk") ---------------- */
  let deferredInstallPrompt = null;
  const installBtn = document.getElementById('installBtn');

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    window.__cidDeferredInstallPrompt = e;
    if (installBtn) installBtn.hidden = false;
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = null;
    window.__cidDeferredInstallPrompt = null;
    if (installBtn) installBtn.hidden = true;
    showToast('Aplikasi berhasil dipasang 🎉');
  });

  if (installBtn) {
    installBtn.addEventListener('click', async () => {
      if (!deferredInstallPrompt) {
        window.location.href = 'full-screen_banner_install_vapk.html';
        return;
      }
      deferredInstallPrompt.prompt();
      await deferredInstallPrompt.userChoice;
      deferredInstallPrompt = null;
      installBtn.hidden = true;
    });
  }

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;
  if (isStandalone && installBtn) installBtn.hidden = true;

  /* ---------------- Toast ---------------- */
  let toastTimer = null;
  function showToast(msg) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }

  /* ---------------- Tabs ---------------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const panels = document.querySelectorAll('.tab-panel');

  function setActiveTab(tabName) {
    tabBtns.forEach((btn) => btn.classList.toggle('active', btn.dataset.tab === tabName));
    panels.forEach((panel) => { panel.hidden = panel.dataset.panel !== tabName; });
    document.getElementById('errorBox').hidden = true;
    document.getElementById('resultBox').hidden = true;
  }

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => setActiveTab(btn.dataset.tab));
  });

  const urlTab = new URLSearchParams(window.location.search).get('tab');
  if (urlTab && document.querySelector(`.tab-btn[data-tab="${urlTab}"]`)) {
    setActiveTab(urlTab);
  }

  /* ---------------- Upload boxes (image -> dataURL) ---------------- */
  const imageStore = {}; // id -> dataURL

  function wireUploadBox(boxId, inputId) {
    const box = document.getElementById(boxId);
    const input = document.getElementById(inputId);
    if (!box || !input) return;

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        imageStore[inputId] = reader.result;
        let img = box.querySelector('img.preview');
        if (!img) {
          img = document.createElement('img');
          img.className = 'preview';
          box.prepend(img);
        }
        img.src = reader.result;
        box.classList.add('has-image');
        const hint = box.querySelector('.upload-hint');
        if (hint) hint.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  }

  ['waImg', 'ttAvatar', 'igPP', 'igPhoto', 'kpPhoto'].forEach((id) => {
    wireUploadBox(id + 'Box', id);
  });

  document.querySelectorAll('[data-clear]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.clear;
      delete imageStore[id];
      const box = document.getElementById(id + 'Box');
      const input = document.getElementById(id);
      if (input) input.value = '';
      if (box) {
        box.classList.remove('has-image');
        const img = box.querySelector('img.preview');
        if (img) img.remove();
        const hint = box.querySelector('.upload-hint');
        if (hint) hint.style.display = '';
      }
    });
  });

  /* ---------------- Generate ---------------- */
  const canvas = document.getElementById('workCanvas');
  const errorBox = document.getElementById('errorBox');
  const resultBox = document.getElementById('resultBox');
  const resultImg = document.getElementById('resultImg');
  const downloadBtn = document.getElementById('downloadBtn');

  function showError(msg) {
    errorBox.hidden = false;
    errorBox.textContent = msg;
    resultBox.hidden = true;
  }

  function showResult(dataUrl, filename) {
    errorBox.hidden = true;
    resultBox.hidden = false;
    resultImg.src = dataUrl;
    downloadBtn.href = dataUrl;
    downloadBtn.download = filename;
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  async function runGenerate(kind, btn) {
    const original = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner"></span> Memproses...';
    errorBox.hidden = true;

    try {
      let dataUrl;
      if (kind === 'whatsapp') {
        const text = document.getElementById('waText').value || 'Halo';
        const timeStr = document.getElementById('waTime').value || '12.00';
        dataUrl = await window.ChatGenerators.generateWhatsApp(canvas, {
          text, timeStr, imgSrc: imageStore.waImg,
        });
      } else if (kind === 'tiktok') {
        const username = document.getElementById('ttUser').value || '@user';
        const chatText = document.getElementById('ttText').value || 'Komentar keren!';
        if (!imageStore.ttAvatar) throw new Error('Upload dulu foto avatar-nya ya.');
        dataUrl = await window.ChatGenerators.generateTiktok(canvas, {
          username, chatText, avatarSrc: imageStore.ttAvatar,
        });
      } else if (kind === 'igstory') {
        const nama = document.getElementById('igName').value || 'Someone';
        const username = document.getElementById('igUser').value || '@user';
        if (!imageStore.igPP || !imageStore.igPhoto) throw new Error('Upload foto profil dan foto latar dulu ya.');
        dataUrl = await window.ChatGenerators.generateIgStory(canvas, {
          nama, username, ppSrc: imageStore.igPP, photoSrc: imageStore.igPhoto,
        });
      } else if (kind === 'kompas') {
        const newsText = document.getElementById('kpText').value || 'Judul berita';
        dataUrl = await window.ChatGenerators.generateKompas(canvas, {
          newsText, photoSrc: imageStore.kpPhoto,
        });
      }
      showResult(dataUrl, `fakechat-${kind}-${Date.now()}.png`);
    } catch (err) {
      console.error(err);
      showError(err.message || 'Gagal membuat gambar. Coba lagi ya.');
    } finally {
      btn.disabled = false;
      btn.innerHTML = original;
    }
  }

  document.querySelectorAll('[data-generate]').forEach((btn) => {
    btn.addEventListener('click', () => runGenerate(btn.dataset.generate, btn));
  });

})();
