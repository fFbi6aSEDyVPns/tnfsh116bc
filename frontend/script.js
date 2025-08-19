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
  { name: '陳宗穎 Joe', id: '14', intro: 'A guy still waiting to get his Canadian Visa.' , tags: [{ text: '留學人', color: 'bg-gray-500' },{ text: 'Canada', color: 'bg-red-500' }]},
  { name: '陳〇〇', id: '15', intro: 'A lovely student.' },
  { name: '陳〇〇', id: '16', intro: 'A lovely student.' },
  { name: '黃〇〇', id: '17', intro: 'A lovely student.' },
  { name: '黃〇〇', id: '18', intro: 'A lovely student.' },
  { name: '黃〇〇', id: '19', intro: 'A lovely student.' },
  { name: '楊禾振 Nate', id: '20', intro: 'A lovely student.' , tags: [{ text: '班級影片創作者', color: 'bg-green-500' }]},
  { name: '楊〇〇', id: '21', intro: 'A lovely student.' },
  { name: '葉〇〇', id: '22', intro: 'A lovely student.' },
  { name: '鄒〇〇', id: '23', intro: 'A lovely student.' },
  { name: '廖韋喆 Jerry', id: '24', intro: 'A lovely student.',tags: [{ text: '網站製作', color: 'bg-gray-500' }]},
  { name: '劉〇〇', id: '25', intro: 'A lovely student.' },
  { name: '蔡〇〇', id: '26', intro: 'A lovely student.' },
  { name: '蔡〇〇', id: '27', intro: 'A lovely student.' },
  { name: '盧〇〇', id: '28', intro: 'A lovely student.' },
  { name: '盧〇〇', id: '29', intro: 'A lovely student.' },
  { name: '蕭〇〇', id: '30', intro: 'A lovely student.' },
  { name: '賴〇〇', id: '31', intro: 'A lovely student.' },
  { name: '簡旭廷 Justin', id: '32', intro: 'A lovely student.'},
  { name: '羅〇〇', id: '33', intro: 'A lovely student.' },
  { name: '蘇〇〇', id: '34', intro: 'A lovely student.' },
  { name: '康〇〇', id: '35', intro: 'A lovely student.',tags: [{ text: 'Freshman', color: 'bg-gray-500' }]  },
];


/*
Available Tailwind colors
bg-red-500 (red)
bg-blue-500 (blue)
bg-green-500 (green)
bg-yellow-500 (yellow)
bg-purple-500 (purple)
bg-pink-500 (pink)
bg-indigo-500 (indigo)
bg-gray-500 (gray)
bg-orange-500 (orange)
*/

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

students.forEach(({name, id, intro, tags}) => {
  const card = document.createElement('div');
  card.className = 'bg-white p-6 shadow-lg rounded-lg cursor-pointer hover:scale-105 transform transition duration-300 relative overflow-hidden';
  card.onclick = () => showStudentIntro(name, id, intro);

  // Add tags if they exist
  if (tags && tags.length > 0) {
    const tagsContainer = document.createElement('div');
    tagsContainer.className = 'absolute top-3 left-3 z-10 flex flex-wrap gap-1 max-w-full';
    
    tags.forEach((tag) => {
      const tagElement = document.createElement('span');
      const tagText = typeof tag === 'string' ? tag : tag.text;
      const tagColor = typeof tag === 'string' ? 'bg-blue-500' : (tag.color || 'bg-blue-500');
      
      tagElement.className = `${tagColor} text-white text-xs px-2 py-1 rounded-full whitespace-nowrap`;
      tagElement.textContent = tagText;
      tagsContainer.appendChild(tagElement);
    });
    
    card.appendChild(tagsContainer);
  }

  // Always add consistent top padding for all cards
  const contentDiv = document.createElement('div');
  contentDiv.className = 'pt-4';

  const h3 = document.createElement('h3');
  h3.className = 'text-xl font-semibold';
  h3.textContent = name;

  const p = document.createElement('p');
  p.className = 'text-gray-600';
  p.textContent = id;

  contentDiv.appendChild(h3);
  contentDiv.appendChild(p);
  card.appendChild(contentDiv);
  container.appendChild(card);
});



