import { useEffect, useMemo, useState } from "react";

const courses = [
  { id: "web", title: "تطوير الويب", subtitle: "من الصفر إلى أول مشروع", icon: "</>", tone: "blue", progress: 72, lessons: 24, level: "مبتدئ" },
  { id: "python", title: "Python للمبتدئين", subtitle: "أساسيات البرمجة بطريقة سهلة", icon: "Py", tone: "green", progress: 35, lessons: 18, level: "مبتدئ" },
  { id: "javascript", title: "JavaScript متقدم", subtitle: "ابنِ تطبيقات تفاعلية حقيقية", icon: "JS", tone: "yellow", progress: 12, lessons: 30, level: "متوسط" },
];
const lessons = [
  { title: "مقدمة في HTML", type: "فيديو", duration: "12 دقيقة", done: true },
  { title: "بناء أول صفحة ويب", type: "تطبيق عملي", duration: "25 دقيقة", done: true },
  { title: "تنسيق الصفحات مع CSS", type: "فيديو", duration: "18 دقيقة", done: true },
  { title: "التخطيط باستخدام Flexbox", type: "تطبيق عملي", duration: "32 دقيقة", done: false },
  { title: "مشروع بطاقة شخصية", type: "مشروع", duration: "45 دقيقة", done: false },
];
const challenges = [
  { title: "المتغيرات والأنواع", category: "JavaScript", difficulty: "سهل", points: 100, unlocked: true },
  { title: "تحدي المصفوفات", category: "JavaScript", difficulty: "متوسط", points: 180, unlocked: true },
  { title: "منطق الشروط", category: "Python", difficulty: "متوسط", points: 220, unlocked: false },
  { title: "ابنِ آلة حاسبة", category: "مشروع", difficulty: "متقدم", points: 500, unlocked: false },
];
const resources = [
  { title: "دليل HTML الكامل", kind: "مرجع", color: "red", desc: "كل ما تحتاجه لبناء صفحات منظمة." },
  { title: "CSS Layout Cheatsheet", kind: "ورقة غش", color: "blue", desc: "مرجع سريع لـ Flexbox و Grid." },
  { title: "JavaScript Patterns", kind: "كتاب إلكتروني", color: "yellow", desc: "أنماط عملية لكتابة كود أفضل." },
];

function Icon({ name }) {
  const paths = { search: "M21 21l-4.35-4.35M19 11a8 8 0 1 1-16 0 8 8 0 0 1 16 0", bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4", moon: "M21 12.8A8.5 8.5 0 1 1 11.2 3 6.6 6.6 0 0 0 21 12.8Z", arrow: "M5 12h14M13 6l6 6-6 6", check: "m5 12 4 4L19 6", lock: "M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" };
  return <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name] || paths.arrow} /></svg>;
}

function App() {
  const [page, setPage] = useState(() => localStorage.getItem("cap-page") || "home");
  const [dark, setDark] = useState(() => localStorage.getItem("cap-dark") === "true");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const [activeCourse, setActiveCourse] = useState("web");
  const [completed, setCompleted] = useState(() => JSON.parse(localStorage.getItem("cap-completed") || "[0,1,2]"));
  const [challengeFilter, setChallengeFilter] = useState("الكل");

  useEffect(() => { localStorage.setItem("cap-page", page); }, [page]);
  useEffect(() => { localStorage.setItem("cap-dark", String(dark)); document.documentElement.dataset.theme = dark ? "dark" : "light"; }, [dark]);
  useEffect(() => { localStorage.setItem("cap-completed", JSON.stringify(completed)); }, [completed]);
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const go = (next) => { setPage(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const filteredResources = resources.filter((item) => item.title.includes(query) || item.desc.includes(query));

  return <div className="app-shell">
    <header className="topbar">
      <button className="brand" onClick={() => go("home")} aria-label="الصفحة الرئيسية"><span className="brand-mark">{`{ }`}</span><span>CodeAcademy <b>Pro</b></span></button>
      <nav className="main-nav"><button className={page === "home" ? "active" : ""} onClick={() => go("home")}>الرئيسية</button><button className={page === "courses" ? "active" : ""} onClick={() => go("courses")}>المسارات</button><button className={page === "languages" ? "active" : ""} onClick={() => go("languages")}>اللغات</button><button className={page === "challenges" ? "active" : ""} onClick={() => go("challenges")}>التحديات</button><button className={page === "resources" ? "active" : ""} onClick={() => go("resources")}>المصادر</button></nav>
      <div className="top-actions"><button className="icon-button" onClick={() => setDark(!dark)} aria-label="تبديل الوضع"><Icon name="moon" /></button><button className="icon-button notification" onClick={() => notify("لا توجد إشعارات جديدة") } aria-label="الإشعارات"><Icon name="bell" /><i /></button><button className="avatar" onClick={() => notify("مرحبًا يا أحمد")}>أح</button></div>
    </header>
    <main>
      {page === "home" && <Home go={go} notify={notify} setActiveCourse={setActiveCourse} />}
      {page === "courses" && <Courses activeCourse={activeCourse} setActiveCourse={setActiveCourse} completed={completed} setCompleted={setCompleted} go={go} />}
      {page === "languages" && <Languages go={go} />}
      {page === "compiler" && <Compiler notify={notify} />}
      {page === "quiz" && <Quiz notify={notify} />}
      {page === "challenges" && <Challenges filter={challengeFilter} setFilter={setChallengeFilter} notify={notify} />}
      {page === "resources" && <Resources query={query} setQuery={setQuery} resources={filteredResources} notify={notify} />}
    </main>
    {toast && <div className="toast"><span className="toast-check"><Icon name="check" /></span>{toast}</div>}
    <footer><span>© 2025 CodeAcademy Pro</span><span>تعلّم. طبّق. أنجز.</span><span>صُنع بشغف للمبرمجين العرب</span></footer>
  </div>;
}

function Home({ go, notify, setActiveCourse }) {
  return <div className="page home-page">
    <section className="hero"><div className="hero-copy"><div className="eyebrow"><span className="live-dot" /> رحلتك البرمجية تبدأ هنا</div><h1>ابنِ مستقبلك<br /><em>بالكود.</em></h1><p>من أول سطر كود إلى أول وظيفة. مسارات عملية، تحديات حقيقية، ومجتمع يدعمك في كل خطوة.</p><div className="hero-actions"><button className="primary-btn" onClick={() => go("courses")}>ابدأ التعلم الآن <Icon name="arrow" /></button><button className="text-btn" onClick={() => go("challenges")}>استكشف التحديات <Icon name="arrow" /></button></div><div className="social-proof"><div className="faces"><span>م</span><span>س</span><span>ع</span><span>+</span></div><div><strong>أكثر من 12,000 طالب</strong><small>يتعلمون معنا كل يوم</small></div></div></div><div className="hero-art"><div className="code-window"><div className="window-top"><span /><span /><span /><small>profile.js</small></div><div className="code-lines"><p><i>const</i> <b>developer</b> = {"{"}</p><p>&nbsp;&nbsp;name: <u>'أحمد'</u>,</p><p>&nbsp;&nbsp;skills: [</p><p>&nbsp;&nbsp;&nbsp;&nbsp;<u>'HTML'</u>, <u>'CSS'</u>,</p><p>&nbsp;&nbsp;&nbsp;&nbsp;<u>'JavaScript'</u></p><p>&nbsp;&nbsp;],</p><p>&nbsp;&nbsp;dream: <u>'∞'</u></p><p>{"}"};</p><p className="cursor-line">_</p></div></div><div className="floating-card streak"><span>✦</span><div><b>7 أيام</b><small>سلسلة التعلم</small></div></div><div className="floating-card score"><strong>+180</strong><small>نقطة هذا الأسبوع</small></div><div className="grid-glow" /></div></section>
    <section className="stats-strip"><div><strong>24</strong><span>درس تفاعلي</span></div><div><strong>8</strong><span>مسارات تعليمية</span></div><div><strong>96%</strong><span>نسبة إكمال الطلاب</span></div><div><strong>12k+</strong><span>متعلم نشط</span></div></section>
    <section className="section"><div className="section-heading"><div><span className="section-kicker">خُطوتك التالية</span><h2>اختر مسارك وابدأ</h2></div><button className="outline-btn" onClick={() => go("courses")}>عرض كل المسارات <Icon name="arrow" /></button></div><div className="course-grid">{courses.map((course) => <CourseCard key={course.id} course={course} onClick={() => { setActiveCourse(course.id); go("courses"); }} />)}</div></section>
    <section className="split-section"><div className="quote-panel"><span className="quote-mark">“</span><blockquote>الطريقة الأفضل لتعلم البرمجة هي أن تكتب كودًا حقيقيًا، وتحل مشاكل حقيقية.</blockquote><span className="quote-author">— فريق CodeAcademy Pro</span></div><div className="why-panel"><span className="section-kicker">لماذا نحن؟</span><h2>تعلم بطريقة مختلفة</h2><div className="benefits"><div><span>01</span><p><b>تعلم بالممارسة</b><small>كل درس ينتهي بتطبيق عملي يثبت المعلومة.</small></p></div><div><span>02</span><p><b>تقدم واضح</b><small>تابع إنجازك واحتفل بكل خطوة صغيرة.</small></p></div><div><span>03</span><p><b>مهارات مطلوبة</b><small>محتوى صُمم مع مطورين لسوق العمل.</small></p></div></div></div></section>
    <section className="cta-banner"><div><span className="section-kicker">جاهز للخطوة الأولى؟</span><h2>كل مطور عظيم بدأ<br />بسطر كود واحد.</h2></div><button className="primary-btn light" onClick={() => { notify("تم تسجيلك في المسار"); go("courses"); }}>ابدأ مجانًا <Icon name="arrow" /></button></section>
  </div>;
}

function CourseCard({ course, onClick }) { return <button className="course-card" onClick={onClick}><div className={`course-icon ${course.tone}`}>{course.icon}</div><div className="course-meta"><span>{course.level}</span><small>{course.lessons} درس</small></div><h3>{course.title}</h3><p>{course.subtitle}</p><div className="progress-label"><span>تقدمك</span><b>{course.progress}%</b></div><div className="progress"><i style={{ width: `${course.progress}%` }} /></div><span className="card-link">تابع التعلم <Icon name="arrow" /></span></button> }

function Courses({ activeCourse, setActiveCourse, completed, setCompleted, go }) {
  const active = courses.find((c) => c.id === activeCourse) || courses[0];
  const toggle = (index) => setCompleted((current) => current.includes(index) ? current.filter((i) => i !== index) : [...current, index]);
  return <div className="page inner-page"><div className="page-intro"><div><span className="section-kicker">مساراتك التعليمية</span><h1>تعلّم بوتيرتك الخاصة.</h1><p>اختر المسار الذي يناسب هدفك، وابنِ مهاراتك خطوة بخطوة.</p></div><button className="primary-btn" onClick={() => go("challenges")}>اختبر مهاراتك <Icon name="arrow" /></button></div><div className="course-tabs">{courses.map((course) => <button className={activeCourse === course.id ? "selected" : ""} key={course.id} onClick={() => setActiveCourse(course.id)}><span className={`mini-icon ${course.tone}`}>{course.icon}</span><span>{course.title}</span><b>{course.progress}%</b></button>)}</div><section className="learning-layout"><div className="lesson-card"><div className="lesson-card-head"><div><span className="section-kicker">المسار الحالي</span><h2>{active.title}</h2><p>{active.subtitle}</p></div><div className="big-progress"><strong>{active.progress}%</strong><small>مكتمل</small></div></div><div className="overall-progress"><i style={{ width: `${active.progress}%` }} /></div><div className="lesson-list">{lessons.map((lesson, index) => <button className={`lesson-row ${completed.includes(index) ? "is-done" : ""}`} key={lesson.title} onClick={() => toggle(index)}><span className="lesson-status">{completed.includes(index) ? <Icon name="check" /> : String(index + 1).padStart(2, "0")}</span><span className="lesson-content"><b>{lesson.title}</b><small>{lesson.type} · {lesson.duration}</small></span><span className="lesson-action">{completed.includes(index) ? "مكتمل" : "ابدأ"}<Icon name="arrow" /></span></button>)}</div></div><aside className="learning-side"><div className="tip-card"><span className="tip-icon">✦</span><h3>نصيحة اليوم</h3><p>قسّم المشكلة الكبيرة إلى مشاكل صغيرة. الكود النظيف يبدأ بفكرة واضحة.</p><span className="tip-line" /></div><div className="weekly-card"><div className="side-title"><b>نشاطك هذا الأسبوع</b><span>آخر 7 أيام</span></div><div className="chart">{[35,56,44,72,48,88,65].map((height, i) => <div key={i}><i style={{ height: `${height}%` }} className={i === 5 ? "today" : ""} /><small>{["س","ح","ن","ث","ر","خ","ج"][i]}</small></div>)}</div></div></aside></section></div>;
}

function Languages({ go }) { return <div className="page inner-page"><div className="page-intro"><div><span className="section-kicker">اختر أدواتك</span><h1>لغات البرمجة.</h1><p>مسارات مرتبة تساعدك على اختيار التقنية المناسبة لهدفك.</p></div><button className="primary-btn" onClick={() => go("compiler")}>جرّب المحرر <Icon name="arrow" /></button></div><div className="language-grid">{[{name:"Python",desc:"ابدأ البرمجة والبيانات بسهولة",tone:"green",level:"مبتدئ"},{name:"JavaScript",desc:"اصنع مواقع وتطبيقات تفاعلية",tone:"yellow",level:"مبتدئ - متقدم"},{name:"HTML & CSS",desc:"ابنِ واجهات ويب جميلة",tone:"blue",level:"مبتدئ"},{name:"SQL",desc:"تعلّم التعامل مع البيانات",tone:"red",level:"متوسط"}].map((language) => <button className="language-card" key={language.name} onClick={() => go("courses")}><span className={`language-logo ${language.tone}`}>{language.name === "HTML & CSS" ? "<>" : language.name.slice(0,2)}</span><span><h3>{language.name}</h3><p>{language.desc}</p><small>{language.level} <Icon name="arrow" /></small></span></button>)}</div><div className="quick-tools"><button onClick={() => go("compiler")}><span>⌘</span><b>المحرر التفاعلي</b><small>اكتب وجرب الكود مباشرة</small></button><button onClick={() => go("quiz")}><span>✓</span><b>اختبر نفسك</b><small>أسئلة قصيرة بعد كل مستوى</small></button></div></div> }

function Compiler({ notify }) { const [code, setCode] = useState("const greeting = 'أهلاً CodeAcademy Pro';\nconsole.log(greeting);"); const [output, setOutput] = useState(""); const run = () => { setOutput("أهلاً CodeAcademy Pro"); notify("تم تشغيل الكود بنجاح"); }; return <div className="page inner-page"><div className="page-intro"><div><span className="section-kicker">تعلّم بالتجربة</span><h1>المحرر التفاعلي.</h1><p>اكتب الكود، شغّله، وشاهد النتيجة فورًا بدون مغادرة المنصة.</p></div><span className="editor-status"><i /> جاهز للتجربة</span></div><div className="editor-shell"><div className="editor-toolbar"><span>JavaScript</span><button onClick={run}>تشغيل الكود <Icon name="arrow" /></button></div><div className="editor-body"><textarea value={code} onChange={(e) => setCode(e.target.value)} spellCheck="false" /><div className="output"><b>النتيجة</b><pre>{output || "اضغط على تشغيل الكود لرؤية النتيجة هنا"}</pre></div></div></div></div> }

function Quiz({ notify }) { const [answer, setAnswer] = useState(""); const [submitted, setSubmitted] = useState(false); const options = ["const", "variable", "let", "define"]; return <div className="page inner-page"><div className="quiz-wrap"><span className="section-kicker">اختبار سريع · JavaScript</span><h1>هل أنت مستعد للتحدي؟</h1><p>أجب عن السؤال التالي لتتأكد من فهمك للدرس.</p><div className="quiz-progress"><i /></div><div className="question-card"><span>السؤال 01 / 05</span><h2>أي كلمة نستخدم لتعريف متغير لا يمكن إعادة إسناده؟</h2><div className="options">{options.map((option) => <button className={answer === option ? "selected" : ""} key={option} onClick={() => setAnswer(option)}><span>{option}</span>{answer === option && <Icon name="check" />}</button>)}</div><button className="primary-btn" disabled={!answer} onClick={() => { setSubmitted(true); notify(answer === "const" ? "إجابة صحيحة، أحسنت" : "حاول مرة أخرى"); }}>تحقق من الإجابة <Icon name="arrow" /></button>{submitted && <small className={`answer-feedback ${answer === "const" ? "correct" : "wrong"}`}>{answer === "const" ? "إجابة صحيحة. const تمنع إعادة إسناد المتغير." : "الإجابة الصحيحة هي const."}</small>}</div></div></div> }

function Challenges({ filter, setFilter, notify }) { const shown = challenges.filter((challenge) => filter === "الكل" || challenge.category === filter); return <div className="page inner-page"><div className="page-intro"><div><span className="section-kicker">تعلّم باللعب</span><h1>تحديات ترفع مستواك.</h1><p>اختبر معلوماتك، اكسب النقاط، وافتح مستويات جديدة.</p></div><div className="points-badge"><span>✦</span><div><b>480</b><small>نقاطك الحالية</small></div></div></div><div className="challenge-hero"><div><span className="section-kicker">تحدي الأسبوع</span><h2>هل تستطيع بناء<br /><em>آلة حاسبة؟</em></h2><p>استخدم ما تعلمته في HTML وCSS وJavaScript لبناء مشروعك الأول.</p><button className="primary-btn light" onClick={() => notify("بدأ التحدي بنجاح")}>ابدأ التحدي <Icon name="arrow" /></button></div><div className="challenge-orbit"><div className="orbit-ring" /><b>JS</b><span>function<br />build()</span><i>✦</i></div></div><div className="filters">{["الكل", "JavaScript", "Python", "مشروع"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div><div className="challenge-grid">{shown.map((challenge) => <button className={`challenge-card ${!challenge.unlocked ? "locked" : ""}`} key={challenge.title} onClick={() => challenge.unlocked ? notify(`تم فتح تحدي ${challenge.title}`) : notify("أكمل التحديات السابقة لفتح هذا المستوى")}><div className="challenge-top"><span className={`tag ${challenge.category === "Python" ? "green" : challenge.category === "مشروع" ? "yellow" : "blue"}`}>{challenge.category}</span>{challenge.unlocked ? <span className="points">+{challenge.points} XP</span> : <Icon name="lock" />}</div><h3>{challenge.title}</h3><div className="challenge-bottom"><span>{challenge.difficulty}</span><span>{challenge.unlocked ? "متاح الآن" : "مقفل"} <Icon name="arrow" /></span></div></button>)}</div></div> }

function Resources({ query, setQuery, resources: shown, notify }) { return <div className="page inner-page"><div className="page-intro"><div><span className="section-kicker">صندوق أدواتك</span><h1>مصادر تساعدك أكثر.</h1><p>مراجع مختارة بعناية لتعود إليها في أي وقت.</p></div><div className="resource-search"><Icon name="search" /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحث عن مصدر..." /></div></div><div className="resource-layout"><div className="resource-list">{shown.map((item) => <button className="resource-card" key={item.title} onClick={() => notify(`فتح ${item.title}`)}><span className={`resource-cover ${item.color}`}><b>{item.color === "red" ? "HTML" : item.color === "blue" ? "CSS" : "JS"}</b></span><span className="resource-info"><span className="tag">{item.kind}</span><h3>{item.title}</h3><p>{item.desc}</p><small>اقرأ المصدر <Icon name="arrow" /></small></span><span className="save">♡</span></button>)}{shown.length === 0 && <div className="empty-state">لم نجد مصدرًا بهذا الاسم.</div>}</div><aside className="favorites"><div className="side-title"><b>المفضلة</b><span>3 مصادر</span></div><div className="favorite-item"><span className="fav-dot red" />JavaScript.info<Icon name="arrow" /></div><div className="favorite-item"><span className="fav-dot blue" />MDN Web Docs<Icon name="arrow" /></div><div className="favorite-item"><span className="fav-dot yellow" />CSS Tricks<Icon name="arrow" /></div><button className="text-btn" onClick={() => notify("جاري تحميل قائمة المصادر")}>اكتشف المزيد <Icon name="arrow" /></button></aside></div></div> }

export default App;
