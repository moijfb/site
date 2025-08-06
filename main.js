document.addEventListener("DOMContentLoaded", function() {
    // Simule un temps de chargement
    setTimeout(() => {
        const loader = document.getElementById('loader');
        const content = document.getElementById('content');
        
        loader.style.display = 'none';
        content.style.display = 'block';
        document.body.style.overflow = 'auto';

        // Ici, nous appellerons la fonction pour charger les données et construire le site
        loadDataAndBuildSite();

    }, 1500); // 1.5 secondes de chargement simulé
});

async function loadDataAndBuildSite() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        buildSite(data);
    } catch (error) {
        console.error('Erreur de chargement des données:', error);
        document.getElementById('content').innerHTML = '<p style="text-align:center;">Erreur de chargement du contenu. Veuillez réessayer.</p>';
    }
}

function buildSite(data) {
    document.querySelector('.glitch').textContent = data.nom;
    document.querySelector('.glitch').setAttribute('data-text', data.nom);
    document.querySelector('.subtitle').textContent = data.titre;

    buildSkills(data.competences, document.querySelector('.skills-container'));
    buildProjects(data.projets, document.querySelector('.projects-container'));
    buildExperience(data.experiences_professionnelles, document.querySelector('.experience-container'));
    buildFormation(data.formation, document.querySelector('.formation-container'));
    buildContact(data.contact, document.querySelector('.contact-container'));
    buildMoreAboutMe(data.soft_skills, data.langues, data.centres_interet, document.querySelector('.soft-skills-langues-interets-container'));

    // Initialiser les animations etc.
    initAnimations();
}

function buildSkills(skills, container) {
    let html = '';
    for (const category in skills) {
        html += `<div class="skill-category"><h3>${category.replace('_', ' ')}</h3><div class="skills-list">`;
        skills[category].forEach(skill => {
            html += `<div class="skill-item">${skill}</div>`;
        });
        html += `</div></div>`;
    }
    container.innerHTML = html;
}

function buildProjects(projects, container) {
    let html = '';
    projects.forEach(project => {
        html += `
            <div class="project-card">
                <h3>${project.titre}</h3>
                <p class="project-date">${project.date}</p>
                <div class="technologies">${project.technologies.map(t => `<span class="tech">${t}</span>`).join('')}</div>
                <p>${project.description}</p>
                <div class="project-links">
                    <a href="${project.project_link}" class="project-link" target="_blank">Voir le projet</a>
                    <a href="${project.code_source}" class="project-link" target="_blank">Code Source</a>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

function buildExperience(experiences, container) {
    let html = '';
    experiences.forEach(exp => {
        html += `
            <div class="experience-item">
                <h3>${exp.titre} - ${exp.entreprise}</h3>
                <p class="experience-date">${exp.date}</p>
                <p>${exp.description}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function buildFormation(formations, container) {
    let html = '';
    formations.forEach(form => {
        html += `
            <div class="formation-item">
                <h3>${form.titre}</h3>
                <p class="formation-etablissement">${form.etablissement}</p>
                <p class="formation-date">${form.date}</p>
                <p>${form.description}</p>
            </div>
        `;
    });
    container.innerHTML = html;
}

function buildContact(contact, container) {
    const formHtml = `
        <form id="contact-form" class="contact-form" action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
            <input type="hidden" name="_subject" value="Nouveau message de votre portfolio !" />
            <div class="form-group">
                <input type="text" name="name" placeholder="Votre Nom" required>
            </div>
            <div class="form-group">
                <input type="email" name="email" placeholder="Votre Email" required>
            </div>
            <div class="form-group">
                <textarea name="message" placeholder="Votre Message" required></textarea>
            </div>
            <button type="submit" class="btn-submit">Envoyer</button>
        </form>
        <div class="contact-info">
             <p><a href="mailto:thomas.bouvais25@gmail.com">thomas.bouvais25@gmail.com</a></p>
             <p>${contact.telephone}</p>
        </div>
    `;
    container.innerHTML = formHtml;

    // Formspree handles the submission directly, no JavaScript needed here.
    // You will need to confirm your email address with Formspree after the first submission.
    // The form's action attribute in index.html will point to the Formspree endpoint.
}

function buildMoreAboutMe(softSkills, langues, centresInteret, container) {
    let html = '';

    // Soft Skills
    html += `<div class="section-category"><h3>Soft Skills</h3><ul class="list-items">`;
    softSkills.forEach(skill => {
        html += `<li>${skill}</li>`;
    });
    html += `</ul></div>`;

    // Langues
    html += `<div class="section-category"><h3>Langues</h3><ul class="list-items">`;
    langues.forEach(lang => {
        if (lang.langue === "Anglais") {
            const evaluations = lang.niveau.split(', ').map(eval => `<span>${eval}</span>`).join('');
            html += `<li>${lang.langue}: <div class="evaluations">${evaluations}</div></li>`;
        } else {
            html += `<li>${lang.langue}: ${lang.niveau}</li>`;
        }
    });
    html += `</ul></div>`;

    // Centres d'intérêt
    html += `<div class="section-category"><h3>Centres d'intérêt</h3><ul class="list-items">`;
    centresInteret.forEach(interest => {
        html += `<li>${interest}</li>`;
    });
    html += `</ul></div>`;

    container.innerHTML = html;
}

function initAnimations() {
    const content = document.getElementById('content');
    content.classList.add('loaded');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section > *').forEach(el => {
        el.classList.add('hidden');
        observer.observe(el);
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    initThreeJS();
    initTiltEffect();
    initKonamiCode();
}

function animateText(element) {
    const text = element.textContent;
    element.textContent = '';
    const chars = text.split('');
    chars.forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        span.style.transform = 'translateY(20px)';
        span.style.transition = `opacity 0.5s ${i * 0.05}s, transform 0.5s ${i * 0.05}s`;
        element.appendChild(span);
        setTimeout(() => {
            span.style.opacity = '1';
            span.style.transform = 'translateY(0)';
        }, 100);
    });
}

function initThreeJS() {
    const container = document.getElementById('three-canvas-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('three-canvas'), alpha: true });
    renderer.setSize(container.offsetWidth, container.offsetHeight);

    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xff00ff, wireframe: true });
    const torusKnot = new THREE.Mesh(geometry, material);
    scene.add(torusKnot);

    const pointLight = new THREE.PointLight(0xffffff);
    pointLight.position.set(20, 20, 20);
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(pointLight, ambientLight);

    camera.position.z = 30;

    const mouse = { x: 0, y: 0 };
    document.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    function animate() {
        requestAnimationFrame(animate);
        torusKnot.rotation.x += 0.005;
        torusKnot.rotation.y += 0.005;

        // Interaction
        torusKnot.rotation.y += (mouse.x - torusKnot.rotation.y) * 0.05;
        torusKnot.rotation.x += (mouse.y - torusKnot.rotation.x) * 0.05;

        renderer.render(scene, camera);
    }

    window.addEventListener('resize', () => {
        camera.aspect = container.offsetWidth / container.offsetHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.offsetWidth, container.offsetHeight);
    });

    animate();
}

function initTiltEffect() {
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });
}

function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let index = 0;
    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[index]) {
            index++;
            if (index === konamiCode.length) {
                document.body.classList.add('barrel-roll');
                setTimeout(() => {
                    document.body.classList.remove('barrel-roll');
                }, 1500);
                index = 0;
            }
        } else {
            index = 0;
        }
    });
}