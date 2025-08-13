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
  { name: 'John Doe', id: '1', intro: 'John loves math, plays basketball, and enjoys coding.' },
  { name: 'Jane Smith', id: '2', intro: 'Jane is passionate about science, painting, and volunteering.' },
  { name: 'Alice Chen', id: '3', intro: 'Alice likes reading, hiking, and chess.' },
  { name: 'Bob Lee', id: '4', intro: 'Bob enjoys music, photography, and cooking.' },
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



//teachers card
// Teachers data and functions
const teachers = [
  { name: 'Mr. Chen', id: 'T001', intro: 'Teaches Physics and Robotics, loves hiking and outdoor adventures.' },
  { name: 'Ms. Lin', id: 'T002', intro: 'English teacher, passionate about literature and drama performances.' },
  { name: 'Dr. Wang', id: 'T003', intro: 'Mathematics professor with expertise in calculus and statistics.' },
  { name: 'Ms. Zhang', id: 'T004', intro: 'Chemistry teacher who enjoys laboratory experiments and research.' },
];

// Generate teacher cards (only run if on teachers page)
function generateTeacherCards() {
  const container = document.getElementById('teachersContainer');
  if (!container) return; // Exit if not on teachers page
  
  container.innerHTML = '';

  teachers.forEach(({name, id, intro}) => {
    const card = document.createElement('div');
    card.className = 'bg-white p-6 shadow-lg rounded-lg cursor-pointer hover:scale-105 transform transition duration-300';
    card.onclick = () => showTeacherIntro(name, id, intro);

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
}

// Close teacher modal
function closeTeacherModal() {
  const modal = document.getElementById("teacherModal");
  if (modal) modal.classList.add("hidden");
}

// Initialize teacher cards when page loads
document.addEventListener('DOMContentLoaded', generateTeacherCards);