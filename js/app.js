// ===== Data =====
const courses = [
  { id: "web", title: "تطوير الويب", subtitle: "من الصفر إلى أول مشروع", icon: "</>", tone: "blue", progress: 72, lessons: 24, level: "مبتدئ" },
  { id: "python", title: "Python للمبتدئين", subtitle: "أساسيات البرمجة بطريقة سهلة", icon: "Py", tone: "green", progress: 35, lessons: 18, level: "مبتدئ" },
  { id: "javascript", title: "JavaScript متقدم", subtitle: "ابنِ تطبيقات تفاعلية حقيقية", icon: "JS", tone: "yellow", progress: 12, lessons: 30, level: "متوسط" },
];
const lessons = [
  { title: "مقدمة في HTML", type: "فيديو", duration: "12 دقيقة" },
  { title: "بناء أول صفحة ويب", type: "تطبيق عملي", duration: "25 دقيقة" },
  { title: "تنسيق الصفحات مع CSS", type: "فيديو", duration: "18 دقيقة" },
  { title: "التخطيط باستخدام Flexbox", type: "تطبيق عملي", duration: "32 دقيقة" },
  { title: "مشروع بطاقة شخصية", type: "مشروع", duration: "45 دقيقة" },
];
const challenges = [
  { title: "المتغيرات والأنواع", category: "JavaScript", difficulty: "سهل", points: 100, unlocked: true },
  { title: "تحدي المصفوفات", category: "JavaScript", difficulty: "متوسط", points: 180, unlocked: true },
  { title: "منطق الشروط", category: "Python", difficulty: "متوسط", points: 220, unlocked: false },
  { title: "ابنِ آلة حاسبة", category: "مشروع", difficulty: "متقدم", points: 500, unlocked: false },
];
const resources = [
  { title: "دليل HTML الكامل", kind: "مرجع", color: "red", label: "HTML", desc: "كل ما تحتاجه لبناء صفحات منظمة." },
  { title: "CSS Layout Cheatsheet", kind: "ورقة غش", color: "blue", label: "CSS", desc: "مرجع سريع لـ Flexbox و Grid." },
  { title: "JavaScript Patterns", kind: "كتاب إلكتروني", color: "yellow", label: "JS", desc: "أنماط عملية لكتابة كود أفضل." },
];
const languages = [
  { name: "Python", desc: "ابدأ البرمجة والبيانات بسهولة", tone: "green", level: "مبتدئ", logo: "Py" },
  { name: "JavaScript", desc: "اصنع مواقع وتطبيقات تفاعلية", tone: "yellow", level: "مبتدئ - متقدم", logo: "JS" },
  { name: "HTML & CSS", desc: "ابنِ واجهات ويب جميلة", tone: "blue", level: "مبتدئ", logo: "<>" },
  { name: "SQL", desc: "تعلّم التعامل مع البيانات", tone: "red", level: "متوسط", logo: "SQL" },
];
const iconPaths = {
  search: "M21 21l-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4",
  moon: "M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z",
  sun: "M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10ZM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4",
  arrow: "M5 12h14M13 6l6 6-6 6",
  check: "m5 12 4 4L19 6",
  lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z",
};

// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html !== undefined) e.innerHTML = html; return e; };
const icon = (name) => `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${iconPaths[name] || iconPaths.arrow}"/></svg>`;

let state = {
  page: localStorage.getItem("cap-page") || "home",
  dark: localStorage.getItem("cap-dark") === "true",
  activeCourse: localStorage.getItem("cap-course") || "web",
  completed: JSON.parse(localStorage.getItem("cap-completed") || "[0,1,2]"),
  challengeFilter: "الكل",
  quizAnswer: "",
  quizSubmitted: false,
  searchQuery: "",
};

function notify(msg) {
  const t = $("#toast");
  t.innerHTML = `<span class="toast-check">${icon("check")}</span>${msg}`;
  t.classList.remove("hidden");
  clearTimeout(window._toastTimer);
  window._toastTimer = setTimeout(() => t.classList.add("hidden"), 2600);
}

function go(next) {
  state.page = next;
  state.quizAnswer = "";
  state.quizSubmitted = false;
  localStorage.setItem("cap-page", next);
  render();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function toggleDark() {
  state.dark = !state.dark;
  localStorage.setItem("cap-dark", String(state.dark));
  applyTheme();
}

function applyTheme() {
  document.documentElement.dataset.theme = state.dark ? "dark" : "light";
  $("#themeToggle").innerHTML = icon(state.dark ? "sun" : "moon");
}

// ===== Page renders =====
function homePage() {
  const courseCards = courses.map((c) => `
    <button class="course-card" data-course="${c.id}">
      <div class="course-icon ${c.tone}">${c.icon}</div>
      <div class="course-meta"><span>${c.level}</span><small>${c.lessons} درس</small></div>
      <h3>${c.title}</h3>
      <p>${c.subtitle}</p>
      <div class="progress-label"><span>تقدمك</span><b>${c.progress}%</b></div>
      <div class="progress"><i style="width:${c.progress}%"></i></div>
      <span class="card-link">تابع التعلم ${icon("arrow")}</span>
    </button>`).join("");

  return `<div class="page home-page">
    <section class="hero">
      <div class="hero-copy">
        <div class="eyebrow"><span class="live-dot"></span> رحلتك البرمجية تبدأ هنا</div>
        <h1>ابنِ مستقبلك<br><em>بالكود.</em></h1>
        <p>من أول سطر كود إلى أول وظيفة. مسارات عملية، تحديات حقيقية، ومجتمع يدعمك في كل خطوة.</p>
        <div class="hero-actions">
          <button class="primary-btn" data-nav="courses">ابدأ التعلم الآن ${icon("arrow")}</button>
          <button class="text-btn" data-nav="challenges">استكشف التحديات ${icon("arrow")}</button>
        </div>
        <div class="social-proof">
          <div class="faces"><span>م</span><span>س</span><span>ع</span><span>+</span></div>
          <div><strong>أكثر من 12,000 طالب</strong><small>يتعلمون معنا كل يوم</small></div>
        </div>
      </div>
      <div class="hero-art">
        <div class="code-window">
          <div class="window-top"><span></span><span></span><span></span><small>profile.js</small></div>
          <div class="code-lines">
            <p><i>const</i> <b>developer</b> = {</p>
            <p>&nbsp;&nbsp;name: <u>'أحمد'</u>,</p>
            <p>&nbsp;&nbsp;skills: [</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;<u>'HTML'</u>, <u>'CSS'</u>,</p>
            <p>&nbsp;&nbsp;&nbsp;&nbsp;<u>'JavaScript'</u></p>
            <p>&nbsp;&nbsp;],</p>
            <p>&nbsp;&nbsp;dream: <u>'∞'</u></p>
            <p>};</p>
            <p class="cursor-line">_</p>
          </div>
        </div>
        <div class="floating-card streak"><span>✦</span><div><b>7 أيام</b><small>سلسلة التعلم</small></div></div>
        <div class="floating-card score"><strong>+180</strong><small>نقطة هذا الأسبوع</small></div>
        <div class="grid-glow"></div>
      </div>
    </section>
    <section class="stats-strip">
      <div><strong>24</strong><span>درس تفاعلي</span></div>
      <div><strong>8</strong><span>مسارات تعليمية</span></div>
      <div><strong>96%</strong><span>نسبة إكمال الطلاب</span></div>
      <div><strong>12k+</strong><span>متعلم نشط</span></div>
    </section>
    <section class="section">
      <div class="section-heading">
        <div><span class="section-kicker">خُطوتك التالية</span><h2>اختر مسارك وابدأ</h2></div>
        <button class="outline-btn" data-nav="courses">عرض كل المسارات ${icon("arrow")}</button>
      </div>
      <div class="course-grid">${courseCards}</div>
    </section>
    <section class="split-section">
      <div class="quote-panel">
        <span class="quote-mark">"</span>
        <blockquote>الطريقة الأفضل لتعلم البرمجة هي أن تكتب كودًا حقيقيًا، وتحل مشاكل حقيقية.</blockquote>
        <span class="quote-author">— فريق CodeAcademy Pro</span>
      </div>
      <div class="why-panel">
        <span class="section-kicker">لماذا نحن؟</span>
        <h2>تعلم بطريقة مختلفة</h2>
        <div class="benefits">
          <div><span>01</span><p><b>تعلم بالممارسة</b><small>كل درس ينتهي بتطبيق عملي يثبت المعلومة.</small></p></div>
          <div><span>02</span><p><b>تقدم واضح</b><small>تابع إنجازك واحتفل بكل خطوة صغيرة.</small></p></div>
          <div><span>03</span><p><b>مهارات مطلوبة</b><small>محتوى صُمم مع مطورين لسوق العمل.</small></p></div>
        </div>
      </div>
    </section>
    <section class="cta-banner">
      <div><span class="section-kicker">جاهز للخطوة الأولى؟</span><h2>كل مطور عظيم بدأ<br>بسطر كود واحد.</h2></div>
      <button class="primary-btn light" data-nav="courses">ابدأ مجانًا ${icon("arrow")}</button>
    </section>
  </div>`;
}

function coursesPage() {
  const active = courses.find((c) => c.id === state.activeCourse) || courses[0];
  const tabs = courses.map((c) => `
    <button class="${state.activeCourse === c.id ? "selected" : ""}" data-tab="${c.id}">
      <span class="mini-icon ${c.tone}">${c.icon}</span>
      <span>${c.title}</span>
      <b>${c.progress}%</b>
    </button>`).join("");

  const lessonRows = lessons.map((lesson, i) => {
    const done = state.completed.includes(i);
    return `<button class="lesson-row ${done ? "is-done" : ""}" data-lesson="${i}">
      <span class="lesson-status">${done ? icon("check") : String(i + 1).padStart(2, "0")}</span>
      <span class="lesson-content"><b>${lesson.title}</b><small>${lesson.type} · ${lesson.duration}</small></span>
      <span class="lesson-action">${done ? "مكتمل" : "ابدأ"} ${icon("arrow")}</span>
    </button>`;
  }).join("");

  const chartBars = [35,56,44,72,48,88,65].map((h, i) => `<div><i style="height:${h}%" class="${i === 5 ? "today" : ""}"></i><small>${["س","ح","ن","ث","ر","خ","ج"][i]}</small></div>`).join("");

  return `<div class="page inner-page">
    <div class="page-intro">
      <div><span class="section-kicker">مساراتك التعليمية</span><h1>تعلّم بوتيرتك الخاصة.</h1><p>اختر المسار الذي يناسب هدفك، وابنِ مهاراتك خطوة بخطوة.</p></div>
      <button class="primary-btn" data-nav="challenges">اختبر مهاراتك ${icon("arrow")}</button>
    </div>
    <div class="course-tabs">${tabs}</div>
    <section class="learning-layout">
      <div class="lesson-card">
        <div class="lesson-card-head">
          <div><span class="section-kicker">المسار الحالي</span><h2>${active.title}</h2><p>${active.subtitle}</p></div>
          <div class="big-progress"><strong>${active.progress}%</strong><small>مكتمل</small></div>
        </div>
        <div class="overall-progress"><i style="width:${active.progress}%"></i></div>
        <div class="lesson-list">${lessonRows}</div>
      </div>
      <aside class="learning-side">
        <div class="tip-card">
          <span class="tip-icon">✦</span>
          <h3>نصيحة اليوم</h3>
          <p>قسّم المشكلة الكبيرة إلى مشاكل صغيرة. الكود النظيف يبدأ بفكرة واضحة.</p>
          <span class="tip-line"></span>
        </div>
        <div class="weekly-card">
          <div class="side-title"><b>نشاطك هذا الأسبوع</b><span>آخر 7 أيام</span></div>
          <div class="chart">${chartBars}</div>
        </div>
      </aside>
    </section>
  </div>`;
}

function languagesPage() {
  const cards = languages.map((l) => `
    <button class="language-card" data-nav="courses">
      <span class="language-logo ${l.tone}">${l.logo}</span>
      <span><h3>${l.name}</h3><p>${l.desc}</p><small>${l.level} ${icon("arrow")}</small></span>
    </button>`).join("");

  return `<div class="page inner-page">
    <div class="page-intro">
      <div><span class="section-kicker">اختر أدواتك</span><h1>لغات البرمجة.</h1><p>مسارات مرتبة تساعدك على اختيار التقنية المناسبة لهدفك.</p></div>
      <button class="primary-btn" data-nav="compiler">جرّب المحرر ${icon("arrow")}</button>
    </div>
    <div class="language-grid">${cards}</div>
    <div class="quick-tools">
      <button data-nav="compiler"><span>⌘</span><b>المحرر التفاعلي</b><small>اكتب وجرب الكود مباشرة</small></button>
      <button data-nav="quiz"><span>✓</span><b>اختبر نفسك</b><small>أسئلة قصيرة بعد كل مستوى</small></button>
    </div>
  </div>`;
}

function compilerPage() {
  return `<div class="page inner-page">
    <div class="page-intro">
      <div><span class="section-kicker">تعلّم بالتجربة</span><h1>المحرر التفاعلي.</h1><p>اكتب الكود، شغّله، وشاهد النتيجة فورًا بدون مغادرة المنصة.</p></div>
      <span class="editor-status"><i></i> جاهز للتجربة</span>
    </div>
    <div class="editor-shell">
      <div class="editor-toolbar"><span>JavaScript</span><button id="runCode">تشغيل الكود ${icon("arrow")}</button></div>
      <div class="editor-body">
        <textarea id="codeInput" spellcheck="false">const greeting = 'أهلاً CodeAcademy Pro';
console.log(greeting);</textarea>
        <div class="output"><b>النتيجة</b><pre id="codeOutput">اضغط على تشغيل الكود لرؤية النتيجة هنا</pre></div>
      </div>
    </div>
  </div>`;
}

function quizPage() {
  const options = ["const", "variable", "let", "define"];
  const optBtns = options.map((o) => `
    <button class="${state.quizAnswer === o ? "selected" : ""}" data-quiz="${o}">
      <span>${o}</span>${state.quizAnswer === o ? icon("check") : ""}
    </button>`).join("");

  let feedback = "";
  if (state.quizSubmitted) {
    const correct = state.quizAnswer === "const";
    feedback = `<small class="answer-feedback ${correct ? "correct" : "wrong"}">${correct ? "إجابة صحيحة. const تمنع إعادة إسناد المتغير." : "الإجابة الصحيحة هي const."}</small>`;
  }

  return `<div class="page inner-page">
    <div class="quiz-wrap">
      <span class="section-kicker">اختبار سريع · JavaScript</span>
      <h1>هل أنت مستعد للتحدي؟</h1>
      <p>أجب عن السؤال التالي لتتأكد من فهمك للدرس.</p>
      <div class="quiz-progress"><i></i></div>
      <div class="question-card">
        <span>السؤال 01 / 05</span>
        <h2>أي كلمة نستخدم لتعريف متغير لا يمكن إعادة إسناده؟</h2>
        <div class="options">${optBtns}</div>
        <button class="primary-btn" id="quizSubmit" ${state.quizAnswer ? "" : "disabled"}>تحقق من الإجابة ${icon("arrow")}</button>
        ${feedback}
      </div>
    </div>
  </div>`;
}

function challengesPage() {
  const shown = challenges.filter((c) => state.challengeFilter === "الكل" || c.category === state.challengeFilter);
  const filters = ["الكل", "JavaScript", "Python", "مشروع"].map((f) =>
    `<button class="${state.challengeFilter === f ? "active" : ""}" data-filter="${f}">${f}</button>`).join("");

  const cards = shown.map((c) => {
    const tagClass = c.category === "Python" ? "green" : c.category === "مشروع" ? "yellow" : "blue";
    return `<button class="challenge-card ${c.unlocked ? "" : "locked"}" data-challenge="${c.title}" data-unlocked="${c.unlocked}">
      <div class="challenge-top">
        <span class="tag ${tagClass}">${c.category}</span>
        ${c.unlocked ? `<span class="points">+${c.points} XP</span>` : icon("lock")}
      </div>
      <h3>${c.title}</h3>
      <div class="challenge-bottom">
        <span>${c.difficulty}</span>
        <span>${c.unlocked ? "متاح الآن" : "مقفل"} ${icon("arrow")}</span>
      </div>
    </button>`;
  }).join("");

  return `<div class="page inner-page">
    <div class="page-intro">
      <div><span class="section-kicker">تعلّم باللعب</span><h1>تحديات ترفع مستواك.</h1><p>اختبر معلوماتك، اكسب النقاط، وافتح مستويات جديدة.</p></div>
      <div class="points-badge"><span>✦</span><div><b>480</b><small>نقاطك الحالية</small></div></div>
    </div>
    <div class="challenge-hero">
      <div>
        <span class="section-kicker">تحدي الأسبوع</span>
        <h2>هل تستطيع بناء<br><em>آلة حاسبة؟</em></h2>
        <p>استخدم ما تعلمته في HTML وCSS وJavaScript لبناء مشروعك الأول.</p>
        <button class="primary-btn light" id="startChallenge">ابدأ التحدي ${icon("arrow")}</button>
      </div>
      <div class="challenge-orbit">
        <div class="orbit-ring"></div>
        <b>JS</b>
        <span>function<br>build()</span>
        <i>✦</i>
      </div>
    </div>
    <div class="filters">${filters}</div>
    <div class="challenge-grid">${cards}</div>
  </div>`;
}

function resourcesPage() {
  const shown = resources.filter((r) => r.title.includes(state.searchQuery) || r.desc.includes(state.searchQuery));
  const cards = shown.map((r) => `
    <button class="resource-card" data-resource="${r.title}">
      <span class="resource-cover ${r.color}"><b>${r.label}</b></span>
      <span class="resource-info">
        <span class="tag">${r.kind}</span>
        <h3>${r.title}</h3>
        <p>${r.desc}</p>
        <small>اقرأ المصدر ${icon("arrow")}</small>
      </span>
      <span class="save">♡</span>
    </button>`).join("");
  const empty = shown.length === 0 ? `<div class="empty-state">لم نجد مصدرًا بهذا الاسم.</div>` : "";

  return `<div class="page inner-page">
    <div class="page-intro">
      <div><span class="section-kicker">صندوق أدواتك</span><h1>مصادر تساعدك أكثر.</h1><p>مراجع مختارة بعناية لتعود إليها في أي وقت.</p></div>
      <div class="resource-search">${icon("search")}<input id="searchInput" value="${state.searchQuery}" placeholder="ابحث عن مصدر..." /></div>
    </div>
    <div class="resource-layout">
      <div class="resource-list">${cards}${empty}</div>
      <aside class="favorites">
        <div class="side-title"><b>المفضلة</b><span>3 مصادر</span></div>
        <div class="favorite-item"><span class="fav-dot red"></span>JavaScript.info${icon("arrow")}</div>
        <div class="favorite-item"><span class="fav-dot blue"></span>MDN Web Docs${icon("arrow")}</div>
        <div class="favorite-item"><span class="fav-dot yellow"></span>CSS Tricks${icon("arrow")}</div>
        <button class="text-btn" id="moreResources">اكتشف المزيد ${icon("arrow")}</button>
      </aside>
    </div>
  </div>`;
}

// ===== Main render =====
function render() {
  const app = $("#app");
  const pages = {
    home: homePage, courses: coursesPage, languages: languagesPage,
    compiler: compilerPage, quiz: quizPage, challenges: challengesPage, resources: resourcesPage,
  };
  app.innerHTML = (pages[state.page] || homePage)();

  // nav active state
  document.querySelectorAll(".main-nav button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.nav === state.page);
  });

  attachEvents();
}

function attachEvents() {
  // nav buttons (data-nav)
  document.querySelectorAll("[data-nav]").forEach((btn) => {
    btn.addEventListener("click", () => go(btn.dataset.nav));
  });

  // course cards on home
  document.querySelectorAll("[data-course]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeCourse = btn.dataset.course;
      localStorage.setItem("cap-course", state.activeCourse);
      go("courses");
    });
  });

  // course tabs
  document.querySelectorAll("[data-tab]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeCourse = btn.dataset.tab;
      localStorage.setItem("cap-course", state.activeCourse);
      render();
    });
  });

  // lesson toggle
  document.querySelectorAll("[data-lesson]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.lesson, 10);
      state.completed = state.completed.includes(i)
        ? state.completed.filter((x) => x !== i)
        : [...state.completed, i];
      localStorage.setItem("cap-completed", JSON.stringify(state.completed));
      render();
    });
  });

  // challenge filters
  document.querySelectorAll("[data-filter]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.challengeFilter = btn.dataset.filter;
      render();
    });
  });

  // challenge cards
  document.querySelectorAll("[data-challenge]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const unlocked = btn.dataset.unlocked === "true";
      notify(unlocked ? `تم فتح تحدي ${btn.dataset.challenge}` : "أكمل التحديات السابقة لفتح هذا المستوى");
    });
  });

  // resource cards
  document.querySelectorAll("[data-resource]").forEach((btn) => {
    btn.addEventListener("click", () => notify(`فتح ${btn.dataset.resource}`));
  });

  // search input
  const search = $("#searchInput");
  if (search) {
    search.addEventListener("input", (e) => {
      state.searchQuery = e.target.value;
      const shown = resources.filter((r) => r.title.includes(state.searchQuery) || r.desc.includes(state.searchQuery));
      const list = document.querySelector(".resource-list");
      if (list) {
        list.innerHTML = shown.map((r) => `
          <button class="resource-card" data-resource="${r.title}">
            <span class="resource-cover ${r.color}"><b>${r.label}</b></span>
            <span class="resource-info">
              <span class="tag">${r.kind}</span>
              <h3>${r.title}</h3>
              <p>${r.desc}</p>
              <small>اقرأ المصدر ${icon("arrow")}</small>
            </span>
            <span class="save">♡</span>
          </button>`).join("") || `<div class="empty-state">لم نجد مصدرًا بهذا الاسم.</div>`;
        list.querySelectorAll("[data-resource]").forEach((b) => b.addEventListener("click", () => notify(`فتح ${b.dataset.resource}`)));
      }
    });
  }

  // more resources
  const more = $("#moreResources");
  if (more) more.addEventListener("click", () => notify("جاري تحميل قائمة المصادر"));

  // challenge start
  const startCh = $("#startChallenge");
  if (startCh) startCh.addEventListener("click", () => notify("بدأ التحدي بنجاح"));

  // quiz options
  document.querySelectorAll("[data-quiz]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.quizAnswer = btn.dataset.quiz;
      state.quizSubmitted = false;
      render();
    });
  });

  // quiz submit
  const qSubmit = $("#quizSubmit");
  if (qSubmit) qSubmit.addEventListener("click", () => {
    state.quizSubmitted = true;
    notify(state.quizAnswer === "const" ? "إجابة صحيحة، أحسنت" : "حاول مرة أخرى");
    render();
  });

  // compiler run
  const runBtn = $("#runCode");
  if (runBtn) runBtn.addEventListener("click", () => {
    const code = $("#codeInput").value;
    const output = $("#codeOutput");
    try {
      const logs = [];
      const fakeConsole = { log: (...args) => logs.push(args.join(" ")) };
      const fn = new Function("console", code);
      fn(fakeConsole);
      output.textContent = logs.length ? logs.join("\n") : "تم التشغيل بنجاح (لا يوجد إخراج)";
    } catch (err) {
      output.textContent = "خطأ: " + err.message;
    }
    notify("تم تشغيل الكود بنجاح");
  });
}

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  applyTheme();
  $("#themeToggle").addEventListener("click", toggleDark);
  $("#bellBtn").addEventListener("click", () => notify("لا توجد إشعارات جديدة"));
  $("#avatarBtn").addEventListener("click", () => notify("مرحبًا يا أحمد"));
  render();
});
