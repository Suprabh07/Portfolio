import React, { useState, useEffect, useRef } from 'react';
import { 
  Rocket, 
  Mail, 
  FileText, 
  Menu, 
  X, 
  Satellite, 
  Calendar, 
  Code, 
  Layers, 
  Server, 
  Cpu, 
  Wrench, 
  GraduationCap, 
  Award, 
  Phone, 
  MapPin, 
  Send, 
  Download, 
  CheckCircle, 
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import './App.css';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [projectFilter, setProjectFilter] = useState('all');
  const [resumeModalOpen, setResumeModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  
  // Contact Form State
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Rocket Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Simulation Metrics State
  const [telemetry, setTelemetry] = useState({
    altitude: 1420,
    pitch: 12.0,
    roll: -3.0,
    velocity: 184
  });

  const pulseBoostRef = useRef(false);

  // -------------------------------------------------------------
  // 1. Scroll Active Section Tracker
  // -------------------------------------------------------------
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'experience', 'projects', 'skills', 'education', 'contact'];
      const scrollPos = window.scrollY + 120;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // -------------------------------------------------------------
  // 2. Real-Time Rocket Avionics Telemetry Canvas Animation
  // -------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const render = () => {
      // Auto-fit parent
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }

      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;

      time += 0.04;

      const currentPitch = 12 + Math.sin(time * 2) * 2;
      const currentRoll = -3 + Math.cos(time * 1.5) * 1.5;
      const boost = pulseBoostRef.current;

      setTelemetry(prev => ({
        altitude: Math.round(prev.altitude + (boost ? 2.5 : Math.sin(time) * 0.3)),
        pitch: parseFloat(currentPitch.toFixed(1)),
        roll: parseFloat(currentRoll.toFixed(1)),
        velocity: Math.round(184 + Math.sin(time * 3) * 5 + (boost ? 40 : 0))
      }));

      ctx.clearRect(0, 0, width, height);

      // Background Grid
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, width);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Horizon Line (Roll Rotation)
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((currentRoll * Math.PI) / 180);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.3)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(-160, 0);
      ctx.lineTo(160, 0);
      ctx.stroke();
      ctx.setLineDash([]);

      // Pitch Rotation for Rocket Body
      ctx.rotate((-currentPitch * Math.PI) / 180);

      // Exhaust Plume
      const plumeLen = 30 + Math.random() * 15 + (boost ? 30 : 0);
      const plumeGradient = ctx.createLinearGradient(0, 45, 0, 45 + plumeLen);
      plumeGradient.addColorStop(0, '#F59E0B');
      plumeGradient.addColorStop(0.5, '#EF4444');
      plumeGradient.addColorStop(1, 'transparent');

      ctx.fillStyle = plumeGradient;
      ctx.beginPath();
      ctx.moveTo(-8, 45);
      ctx.lineTo(0, 45 + plumeLen);
      ctx.lineTo(8, 45);
      ctx.closePath();
      ctx.fill();

      // Fins
      ctx.fillStyle = '#047857';
      ctx.beginPath();
      ctx.moveTo(-10, 20);
      ctx.lineTo(-24, 45);
      ctx.lineTo(-10, 42);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(10, 20);
      ctx.lineTo(24, 45);
      ctx.lineTo(10, 42);
      ctx.closePath();
      ctx.fill();

      // Rocket Body
      const bodyGrad = ctx.createLinearGradient(-10, 0, 10, 0);
      bodyGrad.addColorStop(0, '#E2E8F0');
      bodyGrad.addColorStop(0.5, '#FFFFFF');
      bodyGrad.addColorStop(1, '#94A3B8');

      ctx.fillStyle = bodyGrad;
      ctx.fillRect(-10, -35, 20, 80);

      // Nosecone
      ctx.fillStyle = '#065F46';
      ctx.beginPath();
      ctx.moveTo(0, -65);
      ctx.quadraticCurveTo(-10, -45, -10, -35);
      ctx.lineTo(10, -35);
      ctx.quadraticCurveTo(10, -45, 0, -65);
      ctx.closePath();
      ctx.fill();

      // Accent Band
      ctx.fillStyle = '#B45309';
      ctx.fillRect(-10, -20, 20, 6);

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const triggerPulseBoost = () => {
    pulseBoostRef.current = true;
    setTimeout(() => {
      pulseBoostRef.current = false;
    }, 1500);
  };

  // Contact Form Submission Handler
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setToastMessage('Message sent successfully! Suprabh will get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setToastMessage(''), 4000);
    }
  };

  // Projects Data
  const projects = [
    {
      id: 1,
      title: 'High-Altitude Rocketry Ground Station Dashboard',
      category: 'avionics',
      badge: 'Avionics & Web Engineering',
      accomplishments: [
        'Engineered an offline-capable web dashboard to log, decode, and visualize live LoRa flight telemetry data.',
        'Implemented 3D orientation tracking for rocket state estimation during flight testing.'
      ],
      tags: ['React', 'Web Serial API', 'Leaflet JS', '3D Canvas', 'WebSockets'],
      github: 'https://github.com/Suprabh07'
    },
    {
      id: 2,
      title: 'Kalakriti Artisan Marketplace',
      category: 'web',
      badge: 'Full-Stack Web Development',
      accomplishments: [
        'Engineered a full-stack Single Page Application (SPA), optimizing UI workflows to reduce page load time by 20%.',
        'Modeled database schemas on Supabase and Firebase for real-time inventory management supporting 500+ artisan product listings.'
      ],
      tags: ['React', 'Node.js', 'Express.js', 'Supabase', 'Firebase'],
      github: 'https://github.com/Suprabh07'
    },
    {
      id: 3,
      title: 'Attendance Management System (AMS)',
      category: 'mobile',
      badge: 'Mobile Application',
      accomplishments: [
        'Developed a cross-platform mobile app streamlining attendance verification for 300+ educators and students.',
        'Structured a Firestore NoSQL database with domain-locked authorization rules, cutting permission validation overhead by 15%.'
      ],
      tags: ['Flutter', 'Dart', 'Firebase Firestore', 'Auth Rules'],
      github: 'https://github.com/Suprabh07'
    },
    {
      id: 4,
      title: 'Embedded Multi-Sensor Avionics Telemetry Flight Computer',
      category: 'avionics',
      badge: 'Embedded Systems & Hardware',
      accomplishments: [
        'Programmed custom sensor telemetry firmware on microcontrollers to process accelerometer, gyroscope, and altimeter telemetry packets over LoRa wireless links.',
        'Implemented real-time fail-safe abort and safety-critical threshold checking logic.'
      ],
      tags: ['ESP32 / Teensy 4.1', 'C++', 'Ebyte LoRa (SX1278)', 'IMU Sensors'],
      github: 'https://github.com/Suprabh07'
    }
  ];

  const filteredProjects = projectFilter === 'all' 
    ? projects 
    : projects.filter(p => p.category === projectFilter);

  return (
    <div className="portfolio-app">
      
      {/* -------------------------------------------------------------
          Header / Navigation Bar
          ------------------------------------------------------------- */}
      <header className="header">
        <div className="container nav-container">
          <a href="#hero" className="brand-logo">
            <div className="brand-avatar" style={{ overflow: 'hidden', padding: 0 }}>
              <img 
                src="/profile.png" 
                alt="Suprabh P Khandke" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  if (e.currentTarget.parentElement) {
                    e.currentTarget.parentElement.innerText = 'SK';
                  }
                }}
              />
            </div>
            <span>Suprabh P Khandke</span>
          </a>

          <nav>
            <ul className={`nav-links ${mobileMenuOpen ? 'active' : ''}`}>
              {['about', 'experience', 'projects', 'skills', 'education', 'contact'].map((sec) => (
                <li key={sec}>
                  <a 
                    href={`#${sec}`} 
                    className={`nav-link ${activeSection === sec ? 'active' : ''}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {sec.charAt(0).toUpperCase() + sec.slice(1)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="nav-cta">
            <button className="btn btn-primary" onClick={() => setResumeModalOpen(true)}>
              <FileText size={18} /> Download Resume
            </button>
            <button 
              className="mobile-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* -------------------------------------------------------------
            Hero Section
            ------------------------------------------------------------- */}
        <section className="hero" id="hero">
          <div className="container hero-grid">
            <div className="hero-content">

              <h1 className="hero-title">
                Hi, I'm <span>Suprabh P Khandke</span>.
              </h1>

              <p className="hero-subtitle">
                Computer Science Student at BMS College of Engineering.
              </p>

              <p className="hero-bio">
                Building scalable web applications, real-time hardware interfaces, and embedded avionics systems—bridging full-stack software with telemetry hardware.
              </p>

              <div className="hero-actions">
                <a href="#projects" className="btn btn-primary">
                  <Rocket size={18} /> View Selected Work
                </a>
                <a href="#contact" className="btn btn-secondary">
                  <Mail size={18} /> Get In Touch
                </a>
              </div>

              <div className="hero-socials">
                <a href="https://github.com/Suprabh07" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> GitHub
                </a>
                <a href="https://www.linkedin.com/in/suprabh-p-khandke" target="_blank" rel="noopener noreferrer" className="social-link">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> LinkedIn
                </a>
                <a href="mailto:suprabhpkhandke@gmail.com" className="social-link">
                  <Mail size={20} /> Email
                </a>
              </div>
            </div>

            {/* Hero Profile Photo Container */}
            <div className="hero-photo-container" style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}>
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                aspectRatio: '1/1'
              }}>
                <img 
                  src="/profile.png" 
                  alt="Suprabh P Khandke" 
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    display: 'block',
                    boxShadow: '0 20px 40px -10px rgba(25, 37, 214, 0.35), 0 10px 25px -5px rgba(0, 0, 0, 0.0)'
                  }}
                  onError={(e) => {
                    // Fallback visually if user hasn't added photo yet
                    e.currentTarget.style.display = 'none';
                    const parent = e.currentTarget.parentElement;
                    if (parent && !parent.querySelector('.fallback-box')) {
                      const div = document.createElement('div');
                      div.className = 'fallback-box';
                      div.style.cssText = 'width:100%;height:100%;border-radius:50%;background:#1E293B;color:#F8FAFC;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:1.5rem;box-shadow: 0 20px 40px -10px rgba(6, 95, 70, 0.35);';
                      div.innerHTML = '<div style="font-size:3rem;margin-bottom:0.5rem;">👨‍💻</div><div style="font-weight:700;font-size:1.1rem;color:#38BDF8;">Add profile.png</div><div style="font-size:0.85rem;color:#94A3B8;margin-top:0.25rem;">Place your photo in public/profile.png</div>';
                      parent.appendChild(div);
                    }
                  }}
                />
              </div>
            </div>

          </div>
        </section>

        {/* -------------------------------------------------------------
            About & Experience Section
            ------------------------------------------------------------- */}
        <section className="section experience" id="experience">
          <div className="container">
            <h2 className="section-title">Professional Experience</h2>
            <p className="section-subtitle">Real-time telemetry systems and full-stack software development.</p>

            <div className="experience-card">
              <div className="exp-header">
                <div>
                  <h3 className="exp-role">Avionics & Software Engineer</h3>
                  <div className="exp-org">BMSCE Rocketry Ground Station Dashboard</div>
                </div>
                <div className="exp-date">
                  <Calendar size={14} /> Feb 2026 – Mar 2026
                </div>
              </div>

              <ul className="exp-bullet-list">
                <li className="exp-bullet-item">
                  Architected a real-time Ground Station telemetry dashboard using React, reducing sensor packet latency by 30% for precise flight path tracking.
                </li>
                <li className="exp-bullet-item">
                  Implemented browser-to-hardware communication using the Web Serial API and integrated state estimation algorithms for 100% live flight diagnostics with 3D orientation and trajectory visualization.
                </li>
                <li className="exp-bullet-item">
                  Designed offline map tracking layers and high-frequency data logging pipelines tailored for field launches.
                </li>
              </ul>

              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span className="tag-pill primary">React</span>
                <span className="tag-pill primary">Web Serial API</span>
                <span className="tag-pill warm">3D Trajectory</span>
                <span className="tag-pill secondary">LoRa Telemetry</span>
                <span className="tag-pill">State Estimation</span>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------
            Featured Projects Section
            ------------------------------------------------------------- */}
        <section className="section projects" id="projects">
          <div className="container">
            <h2 className="section-title">Featured Projects</h2>
            <p className="section-subtitle">Systems spanning full-stack web platforms, mobile apps, and avionics hardware.</p>

            <div className="projects-filter">
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'avionics', label: 'Avionics & Hardware' },
                { id: 'web', label: 'Full-Stack Web' },
                { id: 'mobile', label: 'Mobile Applications' }
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`filter-btn ${projectFilter === tab.id ? 'active' : ''}`}
                  onClick={() => setProjectFilter(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="projects-grid">
              {filteredProjects.map(proj => (
                <div className="project-card" key={proj.id}>
                  <div className="project-badge-bar">
                    <span className="project-category">{proj.badge}</span>
                  </div>
                  <div className="project-content">
                    <h3 className="project-title">{proj.title}</h3>
                    <ul className="project-accomplishments">
                      {proj.accomplishments.map((acc, i) => (
                        <li key={i}>{acc}</li>
                      ))}
                    </ul>
                    <div className="project-tags">
                      {proj.tags.map((tag, i) => (
                        <span key={i} className="tag-pill">{tag}</span>
                      ))}
                    </div>
                    <div className="project-footer">
                      <a href={proj.github} target="_blank" rel="noopener noreferrer" className="project-link">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> GitHub Repo
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------
            Technical Skills Matrix Section
            ------------------------------------------------------------- */}
        <section className="section skills" id="skills">
          <div className="container">
            <h2 className="section-title">Technical Skills Matrix</h2>
            <p className="section-subtitle">Core proficiency across software layers and hardware domains.</p>

            <div className="skills-matrix-grid">
              
              <div className="skill-category-card">
                <div className="skill-cat-header">
                  <div className="skill-icon-box"><Code size={20} /></div>
                  <h3 className="skill-cat-title">Languages</h3>
                </div>
                <div className="skill-tags-list">
                  <span className="tag-pill primary">JavaScript</span>
                  <span className="tag-pill primary">TypeScript</span>
                  <span className="tag-pill warm">C / C++</span>
                  <span className="tag-pill secondary">Python</span>
                  <span className="tag-pill">Java</span>
                  <span className="tag-pill">Dart</span>
                </div>
              </div>

              <div className="skill-category-card">
                <div className="skill-cat-header">
                  <div className="skill-icon-box"><Layers size={20} /></div>
                  <h3 className="skill-cat-title">Frontend & Mobile</h3>
                </div>
                <div className="skill-tags-list">
                  <span className="tag-pill primary">React</span>
                  <span className="tag-pill primary">Next.js</span>
                  <span className="tag-pill secondary">Flutter</span>
                  <span className="tag-pill">HTML5 / CSS3</span>
                  <span className="tag-pill">Tailwind CSS</span>
                </div>
              </div>

              <div className="skill-category-card">
                <div className="skill-cat-header">
                  <div className="skill-icon-box"><Server size={20} /></div>
                  <h3 className="skill-cat-title">Backend & Databases</h3>
                </div>
                <div className="skill-tags-list">
                  <span className="tag-pill primary">Node.js</span>
                  <span className="tag-pill primary">Express.js</span>
                  <span className="tag-pill">REST APIs</span>
                  <span className="tag-pill warm">MongoDB</span>
                  <span className="tag-pill warm">Supabase</span>
                  <span className="tag-pill warm">Firebase</span>
                </div>
              </div>

              <div className="skill-category-card">
                <div className="skill-cat-header">
                  <div className="skill-icon-box"><Cpu size={20} /></div>
                  <h3 className="skill-cat-title">Hardware & Avionics</h3>
                </div>
                <div className="skill-tags-list">
                  <span className="tag-pill warm">ESP32</span>
                  <span className="tag-pill warm">Teensy 4.1</span>
                  <span className="tag-pill">Arduino</span>
                  <span className="tag-pill primary">Web Serial API</span>
                  <span className="tag-pill secondary">Ebyte LoRa</span>
                </div>
              </div>

              <div className="skill-category-card">
                <div className="skill-cat-header">
                  <div className="skill-icon-box"><Wrench size={20} /></div>
                  <h3 className="skill-cat-title">Tools & Methodologies</h3>
                </div>
                <div className="skill-tags-list">
                  <span className="tag-pill">Git</span>
                  <span className="tag-pill">GitHub</span>
                  <span className="tag-pill">Postman</span>
                  <span className="tag-pill">Unit Testing</span>
                  <span className="tag-pill">Debugging</span>
                  <span className="tag-pill secondary">Linux</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------
            Education & Certifications Section
            ------------------------------------------------------------- */}
        <section className="section education" id="education">
          <div className="container">
            <h2 className="section-title">Education & Certifications</h2>
            <p className="section-subtitle">Strong foundational academic performance and continuous learning.</p>

            <div className="edu-cert-grid">
              <div className="edu-timeline">
                <div className="edu-card">
                  <div>
                    <h3 className="edu-degree">B.E. in Computer Science & Engineering</h3>
                    <div className="edu-institution">B.M.S. College of Engineering (BMSCE), Bangalore</div>
                    <div className="edu-date"><Calendar size={14} /> Aug 2024 – Present</div>
                  </div>
                  <div className="edu-score-badge">CGPA: 9.33</div>
                </div>

                <div className="edu-card">
                  <div>
                    <h3 className="edu-degree">Pre-University Education (12th)</h3>
                    <div className="edu-institution">Creative PU College, Karkala</div>
                    <div className="edu-date"><Calendar size={14} /> Completed May 2024</div>
                  </div>
                  <div className="edu-score-badge">98.00%</div>
                </div>

                <div className="edu-card">
                  <div>
                    <h3 className="edu-degree">SSLC (10th Standard)</h3>
                    <div className="edu-institution">St. Joseph's High School, Chikmagalur</div>
                    <div className="edu-date"><Calendar size={14} /> Completed May 2022</div>
                  </div>
                  <div className="edu-score-badge">97.76%</div>
                </div>
              </div>

              <div className="cert-list">
                <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-headline)' }}>Certifications</h3>
                
                <div className="cert-card">
                  <div className="cert-icon"><GraduationCap size={20} /></div>
                  <div>
                    <div className="cert-title">Ultimate Web Development Course</div>
                    <div className="cert-issuer">Udemy</div>
                  </div>
                </div>

                <div className="cert-card">
                  <div className="cert-icon"><Award size={20} /></div>
                  <div>
                    <div className="cert-title">C Programming for Beginners</div>
                    <div className="cert-issuer">Great Learning Academy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------------
            Contact Section
            ------------------------------------------------------------- */}
        <section className="section contact" id="contact">
          <div className="container">
            <h2 className="section-title">Contact Me</h2>
            <p className="section-subtitle">Let's build something together. Whether you want to discuss full-stack applications, avionics hardware, or open-source projects, feel free to reach out.</p>

            <div className="contact-grid">
              <div className="contact-info-card">
                <div className="contact-detail-item">
                  <div className="contact-icon-box"><Mail size={20} /></div>
                  <div>
                    <div className="contact-detail-label">Email</div>
                    <a href="mailto:suprabhpkhandke@gmail.com" className="contact-detail-value">suprabhpkhandke@gmail.com</a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-box"><Phone size={20} /></div>
                  <div>
                    <div className="contact-detail-label">Phone</div>
                    <a href="tel:+919902807251" className="contact-detail-value">+91 9902807251</a>
                  </div>
                </div>

                <div className="contact-detail-item">
                  <div className="contact-icon-box"><MapPin size={20} /></div>
                  <div>
                    <div className="contact-detail-label">Location</div>
                    <div className="contact-detail-value">Bangalore / Chikmagalur, Karnataka, India</div>
                  </div>
                </div>

                <div style={{ marginTop: '1rem' }}>
                  <div className="contact-detail-label" style={{ marginBottom: '0.75rem' }}>Social Profiles</div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="https://github.com/Suprabh07" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg> GitHub
                    </a>
                    <a href="https://www.linkedin.com/in/suprabh-p-khandke" target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg> LinkedIn
                    </a>
                  </div>
                </div>
              </div>

              <div className="contact-form-card">
                <form onSubmit={handleContactSubmit}>
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Your Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      className="form-input" 
                      placeholder="e.g. Alex Johnson" 
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="email" className="form-label">Your Email</label>
                    <input 
                      type="email" 
                      id="email" 
                      className="form-input" 
                      placeholder="e.g. alex@example.com" 
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message" className="form-label">Message</label>
                    <textarea 
                      id="message" 
                      className="form-textarea" 
                      placeholder="Hello Suprabh, I'd like to discuss a project..." 
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      required 
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                    <Send size={18} /> Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* -------------------------------------------------------------
          Footer
          ------------------------------------------------------------- */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">Suprabh P Khandke</div>
            <ul className="footer-links">
              <li><a href="#hero" className="footer-link">Home</a></li>
              <li><a href="#about" className="footer-link">About</a></li>
              <li><a href="#projects" className="footer-link">Projects</a></li>
              <li><a href="#skills" className="footer-link">Skills</a></li>
              <li><a href="#contact" className="footer-link">Contact</a></li>
            </ul>
          </div>
          <div className="footer-bottom">
            <div>&copy; 2026 Suprabh P Khandke. All rights reserved.</div>
            <div>Built with React & Vite Tech Stack</div>
          </div>
        </div>
      </footer>

      {/* -------------------------------------------------------------
          Resume Preview Modal
          ------------------------------------------------------------- */}
      {resumeModalOpen && (
        <div className="modal-overlay active" onClick={() => setResumeModalOpen(false)}>
          <div className="modal-container" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setResumeModalOpen(false)}>&times;</button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <FileText size={28} color="var(--accent-primary)" />
              <div>
                <h3 style={{ fontSize: '1.35rem', color: 'var(--text-headline)' }}>Suprabh P Khandke - Curriculum Vitae</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Full-Stack & Avionics Software Engineer | BMSCE</p>
              </div>
            </div>

            <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1.25rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem', fontSize: '0.95rem' }}>
              <p style={{ marginBottom: '0.5rem' }}><strong>Resume Highlights:</strong></p>
              <ul style={{ paddingLeft: '1.25rem', lineHeight: '1.6', color: 'var(--text-body)' }}>
                <li>BE in CS & Engineering (BMSCE) - <strong>9.33 CGPA</strong></li>
                <li>Avionics & Software Engineer at BMSCE Rocketry Ground Station</li>
                <li>Full-Stack Web (React, Node.js, Supabase) & Mobile Apps (Flutter)</li>
                <li>Embedded Systems & LoRa Telemetry Firmware (ESP32, Teensy)</li>
              </ul>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button className="btn btn-secondary" onClick={() => setResumeModalOpen(false)}>Close</button>
              <a href="/resume.pdf" download="Suprabh_P_Khandke_Resume.pdf" className="btn btn-primary">
                <Download size={18} /> Download PDF
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast show">
          <CheckCircle size={18} /> {toastMessage}
        </div>
      )}

    </div>
  );
}
