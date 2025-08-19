// ====== 課表（保留原本） ======
const CLASS_TABLE = {
  1:[{p:"第一節",t:"08:00-08:50",s:"閩南語/台灣手語",teacher:"陳秀枝 / 黃素楨"},
     {p:"第二節",t:"09:00-09:50",s:"英文",teacher:"李俊文"},
     {p:"第三節",t:"10:10-11:00",s:"英文",teacher:"李俊文"},
     {p:"第四節",t:"11:10-12:00",s:"體育",teacher:"柯東成"},
     {p:"第五節",t:"13:10-14:00",s:"數學",teacher:"梁俊宏"},
     {p:"第六節",t:"14:10-15:00",s:"地球科學",teacher:"黃建彰"},
     {p:"第七節",t:"15:10-16:00",s:"數學",teacher:"梁俊宏"}],
  2:[{p:"第一節",t:"08:00-08:50",s:"全民國防教育",teacher:"王柏中"},
     {p:"第二節",t:"09:00-09:50",s:"英文",teacher:"李俊文"},
     {p:"第三節",t:"10:10-11:00",s:"閱讀與討論",teacher:"Evan"},
     {p:"第四節",t:"11:10-12:00",s:"閱讀與討論",teacher:"Evan"},
     {p:"第五節",t:"13:10-14:00",s:"國文",teacher:"林佩荃"},
     {p:"第六節",t:"14:10-15:00",s:"地理",teacher:"翁薰君"},
     {p:"第七節",t:"15:10-16:00",s:"生命教育",teacher:"吳玟芷"}],
  3:[{p:"第一節",t:"08:00-08:50",s:"數學",teacher:"梁俊宏"},
     {p:"第二節",t:"09:00-09:50",s:"體育",teacher:"柯東成"},
     {p:"第三節",t:"10:10-11:00",s:"生活科技",teacher:"莊淑如"},
     {p:"第四節",t:"11:10-12:00",s:"生活科技",teacher:"莊淑如"},
     {p:"第五節",t:"13:10-14:00",s:"彈性學習時間",teacher:"-"},
     {p:"第六節",t:"14:10-15:00",s:"彈性學習時間",teacher:"-"},
     {p:"第七節",t:"15:10-16:00",s:"團體活動時間",teacher:"李俊文"}],
  4:[{p:"第一節",t:"08:00-08:50",s:"團體活動時間",teacher:"李俊文"},
     {p:"第二節",t:"09:00-09:50",s:"數學",teacher:"梁俊宏"},
     {p:"第三節",t:"10:10-11:00",s:"自然科學探究與實作",teacher:"王俊乃 / 黃聖勳"},
     {p:"第四節",t:"11:10-12:00",s:"自然科學探究與實作",teacher:"王俊乃 / 黃聖勳"},
     {p:"第五節",t:"13:10-14:00",s:"地理",teacher:"翁薰君"},
     {p:"第六節",t:"14:10-15:00",s:"國文",teacher:"林佩荃"},
     {p:"第七節",t:"15:10-16:00",s:"國文",teacher:"林佩荃"}],
  5:[{p:"第一節",t:"08:00-08:50",s:"高一多元選修",teacher:"-"},
     {p:"第二節",t:"09:00-09:50",s:"英文",teacher:"李俊文"},
     {p:"第三節",t:"10:10-11:00",s:"地球科學",teacher:"黃建彰"},
     {p:"第四節",t:"11:10-12:00",s:"國文",teacher:"林佩荃"},
     {p:"第五節",t:"13:10-14:00",s:"英文",teacher:"李俊文"},
     {p:"第六節",t:"14:10-15:00",s:"美術",teacher:"顏勇達"},
     {p:"第七節",t:"15:10-16:00",s:"美術",teacher:"顏勇達"}],
};

// ====== 工具函數 ======
let current = new Date();
let selected = new Date();
const $ = (q) => document.querySelector(q);

function toISODate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function isValidTimeFormat(timeStr) {
  return /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeStr);
}
function datePart(start) {
  return String(start).split("T")[0].split(" ")[0];
}
function timePart(start) {
  const parts = String(start).split(" ");
  if (parts.length > 1) return parts[1].substring(0,5);
  const t = String(start).split("T")[1];
  return t ? t.substring(0,5) : "";
}

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ====== 全域事件快取 ======
let ALL_EVENTS = [];

async function refreshEvents() {
  ALL_EVENTS = await getJSON("/api/events");
}
function eventsOf(dateStr) {
  return ALL_EVENTS.filter(e => datePart(e.start) === dateStr);
}

// ====== DOM 初始化 ======
document.addEventListener("DOMContentLoaded", () => {
  const calendarGrid = $("#calendarGrid");
  const monthLabel = $("#monthLabel");
  const prevMonthBtn = $("#prevMonth");
  const nextMonthBtn = $("#nextMonth");
  const classBody = $("#classBody");
  const eventList = $("#eventList");
  const dateTitle = $("#dateTitle");
  const modal = $("#modal");
  const evtTime = $("#evtTime");
  const evtText = $("#evtText");
  const addEventBtn = $("#addEventBtn");
  const closeModalBtn = $("#closeModal");
  const saveEventBtn = $("#saveEvent");
  const addAllDayBtn = $("#addAllDayBtn");
  const allDayInput = $("#allDayInput");

  // 月份切換
  prevMonthBtn?.addEventListener("click", async () => {
    current = new Date(current.getFullYear(), current.getMonth() - 1, 1);
    await renderCalendar();
  });
  nextMonthBtn?.addEventListener("click", async () => {
    current = new Date(current.getFullYear(), current.getMonth() + 1, 1);
    await renderCalendar();
  });

  // Modal 開關
  addEventBtn?.addEventListener("click", () => {
    evtTime.value = "";
    evtText.value = "";
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    evtTime.focus();
  });
  closeModalBtn?.addEventListener("click", () => {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  });

  // 儲存單一活動
  saveEventBtn?.addEventListener("click", async () => {
    const date = toISODate(selected);
    const time = evtTime.value.trim();
    const title = evtText.value.trim();
    if (!title || !time || !isValidTimeFormat(time)) {
      alert("請輸入正確的時間 (HH:MM) 與內容");
      return;
    }
    try {
      await postJSON("/api/events", { title, start: `${date} ${time}`, end: null });
      modal.classList.add("hidden");
      await refreshEvents();
      await renderCalendar();
      await renderDay();
    } catch (e) {
      alert("新增失敗: " + e.message);
    }
  });

  // 新增全天活動
  addAllDayBtn?.addEventListener("click", async () => {
    const title = allDayInput.value.trim();
    if (!title) return;
    try {
      await postJSON("/api/events", { title, start: `${toISODate(selected)} 00:00`, end: null });
      allDayInput.value = "";
      await refreshEvents();
      await renderCalendar();
      await renderDay();
    } catch (e) {
      alert("新增失敗: " + e.message);
    }
  });

  // 初始載入
  (async () => {
    await refreshEvents();
    await renderCalendar();
    await renderDay();
  })();

  // === 日曆渲染 ===
  async function renderCalendar() {
    if (!calendarGrid || !monthLabel) return;
    calendarGrid.innerHTML = "";
    const y = current.getFullYear(), m = current.getMonth();
    monthLabel.textContent = new Date(y, m, 1).toLocaleDateString("zh-TW", { year:"numeric", month:"long" });

    const firstWeekday = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    const monthStr = `${y}-${String(m+1).padStart(2,"0")}`;
    const marked = new Set(
      ALL_EVENTS
        .map(e => datePart(e.start))
        .filter(ds => ds.startsWith(monthStr))
    );

    for (let i=0; i<firstWeekday; i++) calendarGrid.appendChild(document.createElement("div"));
    for (let d=1; d<=daysInMonth; d++) {
      const btn = document.createElement("button");
      btn.className = "relative p-2 rounded hover:bg-blue-100";
      btn.textContent = d;
      const dateStr = `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

      if (marked.has(dateStr)) {
        const dot = document.createElement("span");
        dot.className = "absolute right-1 top-1 w-2 h-2 rounded-full bg-red-500";
        btn.appendChild(dot);
      }

      const isToday = new Date().toDateString() === new Date(y,m,d).toDateString();
      const isSelected = selected.toDateString() === new Date(y,m,d).toDateString();
      if (isToday) btn.classList.add("bg-blue-600","text-white");
      if (isSelected) btn.classList.add("bg-blue-200","border-2","border-blue-500");

      btn.addEventListener("click", async () => {
        selected = new Date(y, m, d);
        await renderDay();
        await renderCalendar();
      });
      calendarGrid.appendChild(btn);
    }
  }

  // === 當日顯示 ===
  async function renderDay() {
    if (!dateTitle || !classBody) return;
    dateTitle.textContent = selected.toLocaleDateString("zh-TW",{ year:"numeric", month:"long", day:"numeric", weekday:"long" });
    const wd = selected.getDay();
    classBody.innerHTML = "";

    if (wd===0 || wd===6) {
      classBody.innerHTML = `<tr><td colspan="4" class="p-3 text-center text-gray-500">週末無課程</td></tr>`;
    } else {
      (CLASS_TABLE[wd]||[]).forEach(r => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td class="border p-2 font-medium">${r.p}</td>
          <td class="border p-2 text-sm text-gray-600">${r.t}</td>
          <td class="border p-2">${r.s}</td>
          <td class="border p-2 text-sm">${r.teacher}</td>`;
        classBody.appendChild(tr);
      });
    }

    await renderEventsList();
  }

  // === 事件清單 ===
  async function renderEventsList() {
    if (!eventList) return;
    eventList.innerHTML = "";

    const dateStr = toISODate(selected);
    const data = eventsOf(dateStr);

    if (!data.length) {
      eventList.innerHTML = `<li class="text-gray-500 italic">本日無特殊活動</li>`;
      return;
    }

    // 分成全天 & 一般
    const allDayEvents = data.filter(e => timePart(e.start) === "00:00");
    const timedEvents = data.filter(e => timePart(e.start) !== "00:00");

    // 全天先顯示
    for (const e of allDayEvents) {
      const li = document.createElement("li");
      li.className = "border rounded-lg p-3 flex justify-between bg-yellow-50 hover:bg-yellow-100";
      li.innerHTML = `
        <div><span class="text-sm font-medium text-yellow-700">📅</span>
        <span class="ml-2">${escapeHtml(e.title)}</span></div>
        <button class="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600">刪除</button>`;

      li.querySelector("button").addEventListener("click", async () => {
        if (confirm("確定刪除？")) {
          const res = await fetch(`/api/events/${e.id}`, { method: "DELETE" });
          if (res.ok) {
            await refreshEvents();
            await renderCalendar();
            await renderDay();
          } else {
            alert("刪除失敗");
          }
        }
      });
      eventList.appendChild(li);
    }

    // 再顯示有時間的
    for (const e of timedEvents) {
      const li = document.createElement("li");
      li.className = "border rounded-lg p-3 flex justify-between bg-blue-50 hover:bg-blue-100";
      const t = timePart(e.start);
      li.innerHTML = `
        <div><span class="text-sm font-medium text-blue-700">${t ? "🕐 "+t : ""}</span>
        <span class="ml-2">${escapeHtml(e.title)}</span></div>
        <button class="text-xs px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600">刪除</button>`;

      li.querySelector("button").addEventListener("click", async () => {
        if (confirm("確定刪除？")) {
          const res = await fetch(`/api/events/${e.id}`, { method: "DELETE" });
          if (res.ok) {
            await refreshEvents();
            await renderCalendar();
            await renderDay();
          } else {
            alert("刪除失敗");
          }
        }
      });
      eventList.appendChild(li);
    }
  }
});
