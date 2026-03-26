// =============================================
//  PORTFOLIO JAVASCRIPT — Edit Mode Engine
//  بيانات المشاريع محفوظة في localStorage
//  الفيديوهات Blob URLs | البيانات النصية & اللينكات محفوظة
// =============================================

const STORAGE_KEY = 'portfolio_projects_v2';
const LOCK_KEY    = 'portfolio_locked';

const DEFAULT_PROJECTS = [
  { id: 'p1', type: 'video', title: 'المشروع الأول', desc: 'اضغط ✏️ لتعديل البيانات ورفع فيديو أو لينك.', tags: ['WordPress', 'WooCommerce'], size: 'featured', link: '', linkLabel: 'زيارة الموقع' },
  { id: 'p2', type: 'video', title: 'المشروع الثاني', desc: 'وصف المشروع الثاني.', tags: ['Landing Page', 'Elementor'], size: 'normal', link: '', linkLabel: 'زيارة الموقع' },
  { id: 'p3', type: 'video', title: 'المشروع الثالث', desc: 'وصف المشروع الثالث.', tags: ['Vibe Coding', 'AI'], size: 'normal', link: '', linkLabel: 'زيارة الموقع' },
  { id: 'p4', type: 'video', title: 'مشروع كبير', desc: 'متجر إلكتروني متكامل.', tags: ['E-Commerce', 'WordPress'], size: 'wide', link: '', linkLabel: 'زيارة الموقع' },
  { id: 'p5', type: 'video', title: 'المشروع الخامس', desc: 'تطوير بالأدوات الحديثة.', tags: ['Next.js', 'React'], size: 'normal', link: '', linkLabel: 'زيارة الموقع' },
  { id: 'p6', type: 'link', title: 'موقع عميل — لينك مباشر', desc: 'نموذج لبطاقة نوعها رابط خارجي — اضغط تعديل وحط الرابط.', tags: ['WordPress', 'SEO'], size: 'normal', link: 'https://example.com', linkLabel: 'زيارة الموقع' },
];

// In-memory blob store (can't persist in localStorage)
const blobMap = {}; // id -> { videoObjectURL, thumbObjectURL, videoBlob, thumbBlob }

// ============ TRANSLATIONS ============
const translations = {
  ar: {
    nav_home: 'الرئيسية', nav_projects: 'المشاريع', nav_skills: 'المهارات', nav_contact: 'تواصل', nav_cta: 'ابدأ مشروعك 🚀',
    hero_hello: 'مرحباً، أنا', hero_uni: 'طالب Level 2 - ذكاء اصطناعي بـ جامعة المنصورة الجديدة | 20 سنة',
    hero_title: 'بدمج الـ <span class="gradient-text">AI</span> في<br>كل سطر كود بكتبه.',
    hero_desc: 'شغفي هو الذكاء الاصطناعي وتطوير الويب. كمبرمج <strong>Vibe Coder</strong> و <strong>WordPress Expert</strong>، بستخدم أحدث تقنيات الـ AI لبناء أنظمة كاملة (Web Apps, ERP Systems, Landing Pages) بسرعة ودقة فائقة.',
    hero_btn_work: 'شوف شغلي', hero_btn_contact: 'تواصل معي', hero_stat1: 'مشروع منجز', hero_stat2: 'اعتماد على الـ AI', hero_badge: 'متاح للعمل',
    projects_tag: 'المشاريع', projects_title: 'شغلي بيتكلم عن نفسه', projects_desc: 'اضغط على أي مشروع وشوف الفيديو',
    skills_tag: 'الأدوات', skills_title: 'تقنياتي', skills_desc: 'الأدوات اللي بستخدمها في كل مشروع',
    process_tag: 'الطريقة', process_title: 'إزاي بشتغل؟',
    process_step1_title: 'الفكرة', process_step1_desc: 'بفهم المشروع بالكامل وبحدد هدفه الأساسي بدون كلام في الهوا',
    process_step2_title: 'التنفيذ', process_step2_desc: 'بستخدم أدوات الـ AI + خبرتي عشان أنفذ بأسرع وقت ممكن',
    process_step3_title: 'التسليم', process_step3_desc: 'بسلم الشغل مع فيديو شرح كامل ودعم ما بعد التسليم',
    contact_tag: 'ابدأ دلوقتي', contact_title: 'عندك مشروع في دماغك؟', contact_desc: 'سواء كنت محتاج موقع WordPress أو تطبيق ويب أو Landing Page — تواصل معي وهنبدأ على طول.',
    contact_btn_wa: 'واتساب — تواصل فوراً', contact_btn_email: '📧 ابعت إيميل',
    footer: 'صُنع بـ ❤️ + ⚡ AI &nbsp;|&nbsp; جميع الحقوق محفوظة © 2026',
    lbl_visit: 'زيارة الموقع', lbl_video_yt: 'فيديو يوتيوب', lbl_video: '🎬 فيديو', lbl_link: '🔗 لينك',
    lbl_empty: 'قريباً...', lbl_empty_edit: 'اضغط لإضافة يوتيوب، فيديو أو لينك',
    lang_btn: 'EN'
  },
  en: {
    nav_home: 'Home', nav_projects: 'Projects', nav_skills: 'Skills', nav_contact: 'Contact', nav_cta: 'Start Project 🚀',
    hero_hello: 'Hello, I am', hero_uni: 'Level 2 AI Student at New Mansoura University | 20 yo',
    hero_title: 'Integrating <span class="gradient-text">AI</span> into<br>every line of code.',
    hero_desc: 'Passionate about AI and Web Dev. As a <strong>Vibe Coder</strong> and <strong>WordPress Expert</strong>, I build complete systems (Web Apps, ERPs, Landing Pages) with extreme speed and precision.',
    hero_btn_work: 'View Work', hero_btn_contact: 'Contact Me', hero_stat1: 'Projects Done', hero_stat2: 'AI Reliance', hero_badge: 'Available for hire',
    projects_tag: 'Projects', projects_title: 'My work speaks for itself', projects_desc: 'Click on any project to watch the video',
    skills_tag: 'Tools', skills_title: 'My Tech Stack', skills_desc: 'Tools I use on every project',
    process_tag: 'Method', process_title: 'How I Work?',
    process_step1_title: 'Ideation', process_step1_desc: 'Understanding the project completely and defining its core goal accurately.',
    process_step2_title: 'Execution', process_step2_desc: 'Using AI tools + my expertise to deliver as fast as possible.',
    process_step3_title: 'Delivery', process_step3_desc: 'Delivering the final work with a full explanation video and post-delivery support.',
    contact_tag: 'Start Now', contact_title: 'Have a project in mind?', contact_desc: 'Whether you need a WordPress site, Web App, or Landing Page — let’s talk and start right away.',
    contact_btn_wa: 'WhatsApp — Instant Contact', contact_btn_email: '📧 Send Email',
    footer: 'Made with ❤️ + ⚡ AI &nbsp;|&nbsp; All rights reserved © 2026',
    lbl_visit: 'Visit Site', lbl_video_yt: 'YouTube Video', lbl_video: '🎬 Video', lbl_link: '🔗 Link',
    lbl_empty: 'Coming soon...', lbl_empty_edit: 'Click to add a YouTube, Video, or Link',
    lang_btn: 'عربي'
  }
};

let currentLang = localStorage.getItem('portfolio_lang') || 'ar';

function toggleLanguage() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  localStorage.setItem('portfolio_lang', currentLang);
  applyTranslations();
  renderGrid();
}

function applyTranslations() {
  const dict = translations[currentLang];
  document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = currentLang;
  document.body.style.fontFamily = currentLang === 'ar' ? "var(--font-ar)" : "var(--font-en)";

  document.body.classList.remove('lang-animating');
  void document.body.offsetWidth;
  document.body.classList.add('lang-animating');

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key]) el.innerHTML = dict[key];
  });
  
  const langBtn = document.getElementById('langBtn');
  if (langBtn) langBtn.innerText = dict.lang_btn;
}

document.addEventListener('DOMContentLoaded', applyTranslations);

function loadProjects() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw).map(p => ({
        type: 'video', link: '', linkLabel: 'زيارة الموقع', youtube: '', ...p
      }));
    }
  } catch(e) {}
  if (typeof dbProjects !== 'undefined') {
    return dbProjects.map(p => ({ youtube: '', ...p }));
  }
  return DEFAULT_PROJECTS.map(p => ({ youtube: '', ...p }));
}

function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(
    projects.map(p => ({ id: p.id, type: p.type, title: p.title, desc: p.desc, tags: p.tags, size: p.size, link: p.link, linkLabel: p.linkLabel, youtube: p.youtube }))
  ));
}

function extractYoutubeId(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

let projects = loadProjects();

// ============ RENDER ============
const bentoGrid = document.getElementById('bentoGrid');

function renderGrid() {
  bentoGrid.innerHTML = '';
  projects.forEach(p => bentoGrid.appendChild(createCard(p)));

  if (document.body.classList.contains('edit-mode')) {
    const dict = translations[currentLang];
    const addSlot = document.createElement('div');
    addSlot.className = 'bento-card-empty reveal';
    addSlot.innerHTML = `<div class="empty-icon">＋</div><div class="empty-text">${currentLang === 'ar' ? 'أضف مشروع جديد' : 'Add New Project'}</div>`;
    addSlot.onclick = addNewCard;
    bentoGrid.appendChild(addSlot);
  }
  applyReveal();
}

function createCard(p) {
  const card = document.createElement('div');
  card.className = 'bento-card reveal';
  if (p.size === 'featured') card.classList.add('featured');
  if (p.size === 'wide') card.classList.add('wide');
  card.dataset.id = p.id;

  const blobData = blobMap[p.id] || {};
  const isEditMode = document.body.classList.contains('edit-mode');

  // ---- Build media area ----
  let mediaHTML = '';
  const dict = translations[currentLang];

  if (p.type === 'link') {
    // Link card
    const thumbSrc = blobData.thumbObjectURL || '';
    const bgStyle = thumbSrc
      ? `style="background-image:url('${thumbSrc}');background-size:cover;background-position:center;"`
      : '';
    mediaHTML = `
      <div class="card-link-banner" ${bgStyle} onclick="handleCardClick('${p.id}', event)">
        ${!thumbSrc ? '<div class="link-banner-gradient"></div>' : '<div class="link-banner-overlay"></div>'}
        <div class="link-banner-content">
          <div class="link-globe-icon">🌐</div>
          <a class="link-visit-btn" href="${p.link || '#'}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
            ${p.linkLabel || dict.lbl_visit}
            <svg viewBox="0 0 16 16" fill="currentColor" width="14" height="14"><path d="M8.636 3.5a.5.5 0 0 0-.5-.5H1.5A1.5 1.5 0 0 0 0 4.5v10A1.5 1.5 0 0 0 1.5 16h10a1.5 1.5 0 0 0 1.5-1.5V7.864a.5.5 0 0 0-1 0V14.5a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h6.636a.5.5 0 0 0 .5-.5z"/><path d="M16 .5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h3.793L6.146 9.146a.5.5 0 1 0 .708.708L15 1.707V5.5a.5.5 0 0 0 1 0v-5z"/></svg>
          </a>
          ${p.link ? `<div class="link-domain">${extractDomain(p.link)}</div>` : ''}
        </div>
      </div>`;
  } else if (p.youtube) {
    // YouTube Card
    const ytId = extractYoutubeId(p.youtube);
    const thumbSrc = blobData.thumbObjectURL || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '');
    mediaHTML = `
      <div class="card-video-wrap" onclick="handleCardClick('${p.id}', event)">
        ${ thumbSrc
          ? `<img class="card-thumb" src="${thumbSrc}" alt="${p.title}" loading="lazy" />`
          : `<div class="card-no-video"><div class="no-vid-icon">▶️</div><div>${dict.lbl_video_yt}</div></div>` }
        <div class="card-overlay">
          <button class="play-btn" aria-label="تشغيل" style="background: rgba(255,0,0,0.8); border:none;">
            <svg viewBox="0 0 60 60" fill="none">
              <path d="M24 20l16 10-16 10V20z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>`;
  } else if (blobData.videoObjectURL) {
    // Video card local
    const thumbSrc = blobData.thumbObjectURL || '';
    mediaHTML = `
      <div class="card-video-wrap" onclick="handleCardClick('${p.id}', event)">
        ${ thumbSrc
          ? `<img class="card-thumb" src="${thumbSrc}" alt="${p.title}" loading="lazy" />`
          : `<video class="card-thumb" src="${blobData.videoObjectURL}" muted preload="metadata" style="object-fit:cover;width:100%;height:100%;"></video>` }
        <div class="card-overlay">
          <button class="play-btn" aria-label="تشغيل">
            <svg viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="29" stroke="white" stroke-width="2"/>
              <path d="M24 20l16 10-16 10V20z" fill="white"/>
            </svg>
          </button>
        </div>
      </div>`;
  } else {
    // Empty placeholder
    mediaHTML = `
      <div class="card-no-video" onclick="handleCardClick('${p.id}', event)">
        <div class="no-vid-icon">${isEditMode ? '🎬' : '⏳'}</div>
        <div>${isEditMode ? 'اضغط لإضافة يوتيوب، فيديو أو لينك' : 'قريباً...'}</div>
      </div>`;
  }

  const tagsHTML = (p.tags || []).map(t => `<span class="tag">${t}</span>`).join('');
  // Type badge
  const typeBadge = p.type === 'link'
    ? `<span class="type-badge type-badge-link">🔗 لينك</span>`
    : (p.youtube || blobData.videoObjectURL ? `<span class="type-badge type-badge-video">🎬 فيديو</span>` : '');

  card.innerHTML = `
    ${mediaHTML}
    <div class="card-info">
      <div class="card-tags">${tagsHTML}${typeBadge}</div>
      <h3>${p.title}</h3>
      <p>${p.desc}</p>
      ${p.type === 'link' && p.link ? `<a class="card-link-row" href="${p.link}" target="_blank" rel="noopener" onclick="event.stopPropagation()">
        <span class="card-link-url">🔗 ${extractDomain(p.link)}</span>
        <span class="card-link-label">${p.linkLabel || 'زيارة الموقع'} ↗</span>
      </a>` : ''}
    </div>`;

  card.addEventListener('click', () => {
    if (document.body.classList.contains('edit-mode')) openCardEditor(p.id);
  });

  return card;
}

function extractDomain(url) {
  try { return new URL(url).hostname.replace('www.', ''); } catch { return url; }
}

function handleCardClick(id, e) {
  if (document.body.classList.contains('edit-mode')) return;
  const p = projects.find(x => x.id === id);
  if (!p) return;
  if (p.type === 'link' && p.link) return; // link handled by <a>
  const blobData = blobMap[id] || {};
  
  if (p.youtube) {
    const ytId = extractYoutubeId(p.youtube);
    if (ytId) openLightboxYoutube(ytId);
  } else if (blobData.videoObjectURL) {
    openLightboxLocal(blobData.videoObjectURL);
  }
}

// ============ LIGHTBOX ============
const lightbox = document.getElementById('lightbox');
const lightboxVideo = document.getElementById('lightboxVideo');
const lightboxIframe = document.getElementById('lightboxIframe');

function openLightboxLocal(videoUrl) {
  lightboxIframe.style.display = 'none';
  lightboxIframe.src = '';
  lightboxVideo.style.display = 'block';
  lightboxVideo.src = videoUrl;
  lightboxVideo.play();
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function openLightboxYoutube(ytId) {
  lightboxVideo.style.display = 'none';
  lightboxVideo.pause();
  lightboxVideo.src = '';
  lightboxIframe.style.display = 'block';
  lightboxIframe.src = `https://www.youtube.com/embed/${ytId}?autoplay=1`;
  lightbox.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightboxVideo.pause();
  lightboxVideo.src = '';
  lightboxIframe.src = '';
  document.body.style.overflow = '';
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLightbox(); closeCardEditor(); } });

// ============ EDIT MODE ============
let isEditMode = false;
function toggleEditBar() {
  if (document.body.classList.contains('locked')) return;
  isEditMode = !isEditMode;
  document.body.classList.toggle('edit-mode', isEditMode);
  renderGrid();
}

function lockEditMode() {
  if (!confirm('بعد القفل هيختفي زرار التعديل. متأكد؟')) return;
  document.body.classList.remove('edit-mode');
  document.body.classList.add('locked');
  isEditMode = false;
  localStorage.setItem(LOCK_KEY, '1');
  renderGrid();
  alert('✅ تم القفل! البورتفوليو جاهز للنشر.');
}

if (localStorage.getItem(LOCK_KEY) === '1') {
  document.body.classList.add('locked');
}

// ============ HIDDEN UNLOCK ============
// Secret shortcut: Ctrl + Shift + U to unlock
document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'U' || e.key === 'u' || e.key === 'ع')) {
    localStorage.removeItem(LOCK_KEY);
    document.body.classList.remove('locked');
    alert('🔓 تم إلغاء القفل السري! رجع زرار التعديل وتقدر تكمل شغل.');
    renderGrid();
  }
});

// ============ CARD TYPE SWITCHER ============
let currentCardType = 'video';

function switchCardType(type) {
  currentCardType = type;
  document.getElementById('videoSection').style.display = type === 'video' ? 'block' : 'none';
  document.getElementById('linkSection').style.display  = type === 'link'  ? 'block' : 'none';
  document.getElementById('typeBtnVideo').classList.toggle('active', type === 'video');
  document.getElementById('typeBtnLink').classList.toggle('active', type === 'link');
  // Update thumbnail hint
  const hint = document.getElementById('thumbHint');
  if (hint) hint.textContent = type === 'video'
    ? 'أو هيتاخد أول فريم من الفيديو تلقائياً'
    : 'صورة اختيارية للغلاف — لو مفيش هيبقى gradient';
}

// ============ CARD EDITOR ============
const cardEditorModal = document.getElementById('cardEditorModal');
let currentEditId = null;
let pendingVideoBlob = null;
let pendingVideoURL  = null;
let pendingThumbBlob = null;
let pendingThumbURL  = null;

function openCardEditor(id) {
  currentEditId = id;
  const p = projects.find(x => x.id === id);
  if (!p) return;

  pendingVideoBlob = pendingVideoURL = pendingThumbBlob = pendingThumbURL = null;

  // Fill fields
  document.getElementById('editorTitle').value    = p.title;
  document.getElementById('editorDesc').value     = p.desc;
  document.getElementById('editorTags').value     = (p.tags || []).join(', ');
  document.getElementById('editorLink').value     = p.link || '';
  document.getElementById('editorLinkLabel').value = p.linkLabel || 'زيارة الموقع';
  document.getElementById('editorYoutube').value  = p.youtube || '';

  document.querySelectorAll('input[name="cardSize"]').forEach(r => r.checked = r.value === (p.size || 'normal'));

  // Switch to correct type
  switchCardType(p.type || 'video');

  // Existing video
  const blobData = blobMap[id] || {};
  const vWrap = document.getElementById('videoPreviewWrap');
  const vZone = document.getElementById('videoUploadZone');
  const vPrev = document.getElementById('videoPreview');
  if (blobData.videoObjectURL) {
    vPrev.src = blobData.videoObjectURL;
    vWrap.style.display = 'block';
    vZone.style.display = 'none';
  } else {
    vWrap.style.display = 'none';
    vZone.style.display = 'flex';
  }

  // Existing thumb
  document.getElementById('thumbPreview').innerHTML = blobData.thumbObjectURL
    ? `<img src="${blobData.thumbObjectURL}" alt="thumb" />`
    : '';

  cardEditorModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCardEditor() {
  cardEditorModal.classList.remove('active');
  document.body.style.overflow = '';
  currentEditId = null;
  if (pendingVideoURL && pendingVideoURL !== 'REMOVE') URL.revokeObjectURL(pendingVideoURL);
  if (pendingThumbURL) URL.revokeObjectURL(pendingThumbURL);
  pendingVideoBlob = pendingVideoURL = pendingThumbBlob = pendingThumbURL = null;
}

function handleVideoUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (pendingVideoURL) URL.revokeObjectURL(pendingVideoURL);
  pendingVideoBlob = file;
  pendingVideoURL = URL.createObjectURL(file);
  document.getElementById('videoPreview').src = pendingVideoURL;
  document.getElementById('videoPreviewWrap').style.display = 'block';
  document.getElementById('videoUploadZone').style.display = 'none';
  autoGenerateThumb(pendingVideoURL);
}

function autoGenerateThumb(videoUrl) {
  const vid = document.createElement('video');
  vid.src = videoUrl; vid.muted = true; vid.currentTime = 0.5;
  vid.addEventListener('seeked', () => {
    const canvas = document.createElement('canvas');
    canvas.width = vid.videoWidth || 640; canvas.height = vid.videoHeight || 360;
    canvas.getContext('2d').drawImage(vid, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(blob => {
      if (!blob) return;
      if (pendingThumbURL) URL.revokeObjectURL(pendingThumbURL);
      pendingThumbBlob = blob;
      pendingThumbURL = URL.createObjectURL(blob);
      document.getElementById('thumbPreview').innerHTML = `<img src="${pendingThumbURL}" alt="thumb" />`;
    }, 'image/jpeg', 0.85);
  }, { once: true });
  vid.load();
}

function handleThumbUpload(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (pendingThumbURL) URL.revokeObjectURL(pendingThumbURL);
  pendingThumbBlob = file;
  pendingThumbURL = URL.createObjectURL(file);
  document.getElementById('thumbPreview').innerHTML = `<img src="${pendingThumbURL}" alt="thumb" />`;
}

function removeVideo() {
  if (pendingVideoURL && pendingVideoURL !== 'REMOVE') URL.revokeObjectURL(pendingVideoURL);
  pendingVideoBlob = null; pendingVideoURL = 'REMOVE';
  document.getElementById('videoPreview').src = '';
  document.getElementById('videoPreviewWrap').style.display = 'none';
  document.getElementById('videoUploadZone').style.display = 'flex';
}

function saveCardChanges() {
  if (!currentEditId) return;
  const p = projects.find(x => x.id === currentEditId);
  if (!p) return;

  p.title     = document.getElementById('editorTitle').value.trim()     || p.title;
  p.desc      = document.getElementById('editorDesc').value.trim()      || p.desc;
  p.link      = document.getElementById('editorLink').value.trim();
  p.linkLabel = document.getElementById('editorLinkLabel').value.trim() || 'زيارة الموقع';
  p.youtube   = document.getElementById('editorYoutube').value.trim();
  p.tags      = document.getElementById('editorTags').value.split(',').map(t => t.trim()).filter(Boolean);
  p.size      = document.querySelector('input[name="cardSize"]:checked')?.value || 'normal';
  p.type      = currentCardType;

  if (!blobMap[p.id]) blobMap[p.id] = {};

  if (pendingVideoURL === 'REMOVE') {
    if (blobMap[p.id].videoObjectURL) URL.revokeObjectURL(blobMap[p.id].videoObjectURL);
    blobMap[p.id].videoObjectURL = null;
    blobMap[p.id].videoBlob = null;
  } else if (pendingVideoBlob) {
    if (blobMap[p.id].videoObjectURL) URL.revokeObjectURL(blobMap[p.id].videoObjectURL);
    blobMap[p.id].videoBlob = pendingVideoBlob;
    blobMap[p.id].videoObjectURL = URL.createObjectURL(pendingVideoBlob);
    pendingVideoURL = null;
  }

  if (pendingThumbBlob) {
    if (blobMap[p.id].thumbObjectURL) URL.revokeObjectURL(blobMap[p.id].thumbObjectURL);
    blobMap[p.id].thumbBlob = pendingThumbBlob;
    blobMap[p.id].thumbObjectURL = URL.createObjectURL(pendingThumbBlob);
    pendingThumbURL = null;
  }

  saveProjects();
  closeCardEditor();
  renderGrid();
}

function deleteCurrentCard() {
  if (!currentEditId || !confirm('حذف هذه البطاقة؟')) return;
  const b = blobMap[currentEditId];
  if (b) {
    if (b.videoObjectURL) URL.revokeObjectURL(b.videoObjectURL);
    if (b.thumbObjectURL) URL.revokeObjectURL(b.thumbObjectURL);
    delete blobMap[currentEditId];
  }
  projects = projects.filter(p => p.id !== currentEditId);
  saveProjects();
  closeCardEditor();
  renderGrid();
}

function addNewCard() {
  const id = 'p_' + Date.now();
  projects.push({ id, type: 'video', title: 'مشروع جديد', desc: 'وصف المشروع.', tags: ['WordPress'], size: 'normal', link: '', linkLabel: 'زيارة الموقع' });
  saveProjects();
  renderGrid();
  setTimeout(() => openCardEditor(id), 50);
}

// ============ NAVBAR ============
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 30));
document.getElementById('menuToggle').addEventListener('click', () => document.getElementById('navLinks').classList.toggle('open'));
document.querySelectorAll('.nav-links a').forEach(l => l.addEventListener('click', () => document.getElementById('navLinks').classList.remove('open')));

// ============ COUNTER ============
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  let cur = 0; const step = target / 60;
  const t = setInterval(() => { cur += step; if (cur >= target) { cur = target; clearInterval(t); } el.textContent = Math.floor(cur); }, 16);
}
const cIO = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target); cIO.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.stat-num').forEach(el => cIO.observe(el));

// ============ REVEAL ============
function applyReveal() {
  const rIO = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); rIO.unobserve(e.target); } });
  }, { threshold: 0.08 });
  document.querySelectorAll('.reveal').forEach(el => rIO.observe(el));
}
document.querySelectorAll('.skill-pill, .step').forEach(el => { el.classList.add('reveal'); });

// ============ INIT ============
renderGrid();
