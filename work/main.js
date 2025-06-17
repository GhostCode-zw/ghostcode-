document.addEventListener('DOMContentLoaded', () => {
  const projectForm = document.getElementById('project-form');
  const projectsDisplay = document.getElementById('projects-display');
  const modeToggleBtn = document.getElementById('mode-toggle');
  const body = document.body;

  // Load projects from localStorage and render
  function loadProjects() {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projectsDisplay.innerHTML = '';
    projects.forEach((project, index) => {
      const projectCard = document.createElement('div');
      projectCard.classList.add('project-card');

      // Create title element
      const titleEl = document.createElement('h3');
      titleEl.textContent = project.title;
      projectCard.appendChild(titleEl);

      // Create link element
      const linkEl = document.createElement('a');
      linkEl.href = project.link;
      linkEl.textContent = project.link;
      linkEl.target = '_blank';
      linkEl.rel = 'noopener noreferrer';
      projectCard.appendChild(linkEl);

      // Create images container with slider functionality
      const imagesContainer = document.createElement('div');
      imagesContainer.classList.add('project-images-container');

      // Current image index
      let currentImageIndex = 0;

      // Create img element for displaying one image at a time
      const imgEl = document.createElement('img');
      imgEl.src = project.images[currentImageIndex];
      imgEl.alt = project.title + ' screenshot';
      imgEl.classList.add('project-image');
      imagesContainer.appendChild(imgEl);

      // Create navigation buttons
      const prevBtn = document.createElement('button');
      prevBtn.textContent = '<';
      prevBtn.classList.add('slider-btn', 'prev-btn');

      const nextBtn = document.createElement('button');
      nextBtn.textContent = '>';
      nextBtn.classList.add('slider-btn', 'next-btn');

      imagesContainer.appendChild(prevBtn);
      imagesContainer.appendChild(nextBtn);

      // Event listeners for buttons
      prevBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + project.images.length) % project.images.length;
        imgEl.src = project.images[currentImageIndex];
      });

      nextBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % project.images.length;
        imgEl.src = project.images[currentImageIndex];
      });

      projectCard.appendChild(imagesContainer);

      projectsDisplay.appendChild(projectCard);
    });
  }

  // Save project to localStorage
  function saveProject(project) {
    const projects = JSON.parse(localStorage.getItem('projects')) || [];
    projects.push(project);
    localStorage.setItem('projects', JSON.stringify(projects));
  }

  // Handle project form submission
  projectForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = projectForm['project-title'].value.trim();
    const link = projectForm['project-link'].value.trim();
    const files = projectForm['project-images'].files;

    if (!title || !link || files.length === 0) {
      alert('Please fill in all fields and select at least one image.');
      return;
    }

    const images = [];
    let filesProcessed = 0;

    // Read each file as Data URL
    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        images.push(event.target.result);
        filesProcessed++;
        if (filesProcessed === files.length) {
          // All files processed, save project
          const project = { title, link, images };
          saveProject(project);
          loadProjects();
          projectForm.reset();
        }
      };
      reader.readAsDataURL(file);
    });
  });

  // EmailJS integration for contact form
  const contactForm = document.getElementById('contact-form');

  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    // Replace these with your EmailJS service ID, template ID, and user ID
    const serviceID = 'service_rzs8qfs';
    const templateID = 'template_6xda7c8';
    const userID = 'MaZEM3E4Bxhhk4yeE';

    emailjs.sendForm(serviceID, templateID, this, userID)
      .then(() => {
        alert('Message sent successfully!');
        contactForm.reset();
      }, (err) => {
        alert('Failed to send message. Please try again later.');
        console.error('EmailJS error:', err);
      });
  });

  // Dark mode toggle functionality
  function setDarkMode(isDark) {
    if (isDark) {
      body.classList.add('dark-mode');
      modeToggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
      localStorage.setItem('darkMode', 'enabled');
    } else {
      body.classList.remove('dark-mode');
      modeToggleBtn.innerHTML = "<i class='bx bx-moon'></i>";
      localStorage.setItem('darkMode', 'disabled');
    }
  }

  // Load dark mode preference on page load
  const darkModePref = localStorage.getItem('darkMode');
  if (darkModePref === 'enabled') {
    setDarkMode(true);
  } else {
    setDarkMode(false);
  }

  // Toggle dark mode on button click
  modeToggleBtn.addEventListener('click', () => {
    const isDark = body.classList.contains('dark-mode');
    setDarkMode(!isDark);
  });

  loadProjects();
});
