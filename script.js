// Smooth scroll
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href.startsWith('#')) {
      // Internal page anchor — do smooth scroll
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
    // Otherwise, normal navigation happens naturally
  });
});

// Scroll reveal effect
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-fade-in');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

//dropdown list control
const menuBtn = document.getElementById("menu-btn");
  const menu = document.getElementById("menu");

  menuBtn.addEventListener("click", () => {
    if (menu.classList.contains("max-h-0")) {
      menu.classList.remove("max-h-0");
      menu.classList.add("max-h-96"); // show
    } else {
      menu.classList.remove("max-h-96");
      menu.classList.add("max-h-0"); // hide
    }
  });



// Student modal
function showStudentIntro(name, number, intro) {
  document.getElementById("modalName").textContent = name;
  document.getElementById("modalNumber").textContent = number;
  document.getElementById("modalIntro").textContent = intro;
  document.getElementById("studentModal").classList.remove("hidden");
}

// Teacher modal
function showTeacherIntro(name, number, intro) {
  document.getElementById("modalTeacherName").textContent = name;
  document.getElementById("modalTeacherNumber").textContent = number;
  document.getElementById("modalTeacherIntro").textContent = intro;
  document.getElementById("teacherModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("studentModal")?.classList.add("hidden");
  document.getElementById("teacherModal")?.classList.add("hidden");
}

//students card
const students = [
  { name: '尤〇〇', id: '1', intro: 'A lovely student.' },
  { name: '方〇〇', id: '2', intro: 'A lovely student.' },
  { name: '毛〇〇', id: '3', intro: 'A lovely student.' },
  { name: '甘〇〇', id: '4', intro: 'A lovely student.' },
  { name: '朱〇〇', id: '5', intro: 'A lovely student.' },
  { name: '朱〇〇', id: '6', intro: 'A lovely student.' },
  { name: '李〇〇', id: '7', intro: 'A lovely student.' },
  { name: '谷〇', id: '8', intro: 'A lovely student.' },
  { name: '林〇〇', id: '9', intro: 'A lovely student.' },
  { name: '洪〇〇', id: '10', intro: 'A lovely student.' },
  { name: '徐〇〇', id: '11', intro: 'A lovely student.' },
  { name: '高〇〇', id: '12', intro: 'A lovely student.' },
  { name: '郭〇〇', id: '13', intro: 'A lovely student.' },
  { name: '陳〇〇', id: '14', intro: 'A lovely student.' },
  { name: '陳〇〇', id: '15', intro: 'A lovely student.' },
  { name: '陳〇〇', id: '16', intro: 'A lovely student.' },
  { name: '黃〇〇', id: '17', intro: 'A lovely student.' },
  { name: '黃〇〇', id: '18', intro: 'A lovely student.' },
  { name: '黃〇〇', id: '19', intro: 'A lovely student.' },
  { name: '楊禾振 Nate', id: '20', intro: 'A lovely student.' },
  { name: '楊〇〇', id: '21', intro: 'A lovely student.' },
  { name: '葉〇〇', id: '22', intro: 'A lovely student.' },
  { name: '鄒〇〇', id: '23', intro: 'A lovely student.' },
  { name: '廖韋喆 Jerry', id: '24', intro: 'A lovely student.' },
  { name: '劉〇〇', id: '25', intro: 'A lovely student.' },
  { name: '蔡〇〇', id: '26', intro: 'A lovely student.' },
  { name: '蔡〇〇', id: '27', intro: 'A lovely student.' },
  { name: '盧〇〇', id: '28', intro: 'A lovely student.' },
  { name: '盧〇〇', id: '29', intro: 'A lovely student.' },
  { name: '蕭〇〇', id: '30', intro: 'A lovely student.' },
  { name: '賴〇〇', id: '31', intro: 'A lovely student.' },
  { name: '簡〇〇', id: '32', intro: 'A lovely student.' },
  { name: '羅〇〇', id: '33', intro: 'A lovely student.' },
  { name: '蘇〇〇', id: '34', intro: 'A lovely student.' },
  { name: '康〇〇', id: '35', intro: 'A lovely student.' },
];

function showStudentIntro(name, number, intro) {
  document.getElementById("modalName").textContent = name;
  document.getElementById("modalNumber").textContent = number;
  document.getElementById("modalIntro").textContent = intro;
  document.getElementById("studentModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("studentModal").classList.add("hidden");
}

const container = document.querySelector('main div.grid');
container.innerHTML = ''; // 清空預設內容

students.forEach(({name, id, intro}) => {
  const card = document.createElement('div');
  card.className = 'bg-white p-6 shadow-lg rounded-lg cursor-pointer hover:scale-105 transform transition duration-300';
  card.onclick = () => showStudentIntro(name, id, intro);

  const h3 = document.createElement('h3');
  h3.className = 'text-xl font-semibold';
  h3.textContent = name;

  const p = document.createElement('p');
  p.className = 'text-gray-600';
  p.textContent = id;

  card.appendChild(h3);
  card.appendChild(p);
  container.appendChild(card);
});




