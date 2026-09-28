(function () {
  const splash = document.getElementById("splash");
  const site = document.getElementById("site");
  const audio = document.getElementById("ambient-audio");
  const muteToggle = document.getElementById("mute-toggle");
  const frames = document.querySelectorAll(".scene__frame");
  const shells = document.querySelectorAll(".shell");
  const panel = document.getElementById("panel");
  const panelContent = document.getElementById("panel-content");
  const panelClose = document.getElementById("panel-close");

  const FRAME_INTERVAL_MS = 650;
  let frameIndex = 0;
  let frameTimer = null;
  let entered = false;

  const panels = {
    about: `
      <h2>About</h2>
      <p>Hi — I'm Nikhil Kohli. This site is my corner of the web: projects, writing, and ways to get in touch.</p>
      <p>I'm building software and exploring music, systems, and creative tools. More bio copy coming soon.</p>
      <p><a href="https://github.com/nikhilkohli27" target="_blank" rel="noopener noreferrer">GitHub</a></p>
    `,
    portfolio: `
      <h2>Portfolio</h2>
      <div class="card">
        <h3>Musync</h3>
        <p>Collaborative music listening — sync playback across devices.</p>
        <p><a href="https://github.com/nikhilkohli27" target="_blank" rel="noopener noreferrer">View on GitHub</a></p>
      </div>
      <p>More projects will land here as they ship.</p>
    `,
    writing: `
      <h2>Writing</h2>
      <p>Essays and notes — coming soon.</p>
      <ul>
        <li>Placeholder for future posts</li>
      </ul>
    `,
    contact: `
      <h2>Contact</h2>
      <p>Reach me via GitHub for now, or add your preferred email here when you're ready.</p>
      <p><a href="https://github.com/nikhilkohli27" target="_blank" rel="noopener noreferrer">github.com/nikhilkohli27</a></p>
    `,
    resume: `
      <h2>Resume</h2>
      <p>CV / resume PDF link can go here.</p>
    `,
  };

  function startFrameCycle() {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (frames.length < 2) return;
    frameTimer = window.setInterval(() => {
      frames[frameIndex].classList.remove("scene__frame--active");
      frameIndex = (frameIndex + 1) % frames.length;
      frames[frameIndex].classList.add("scene__frame--active");
    }, FRAME_INTERVAL_MS);
  }

  function openPanel(id) {
    const html = panels[id];
    if (!html) return;
    panelContent.innerHTML = html;
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add("panel--open"));
  }

  function closePanel() {
    panel.classList.remove("panel--open");
    window.setTimeout(() => {
      panel.hidden = true;
      panelContent.innerHTML = "";
    }, 450);
  }

  function enterSite() {
    if (entered) return;
    entered = true;

    splash.classList.add("splash--exit");
    site.classList.remove("site--hidden");
    site.classList.add("site--visible");
    site.setAttribute("aria-hidden", "false");

    startFrameCycle();

    const playPromise = audio.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        /* No audio file yet or autoplay blocked after gesture edge case */
      });
    }
  }

  splash.addEventListener("click", enterSite);
  splash.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      enterSite();
    }
  });

  shells.forEach((btn) => {
    btn.addEventListener("click", () => openPanel(btn.dataset.panel));
  });

  panelClose.addEventListener("click", closePanel);

  muteToggle.addEventListener("click", () => {
    audio.muted = !audio.muted;
    muteToggle.setAttribute("aria-pressed", String(audio.muted));
    muteToggle.setAttribute("aria-label", audio.muted ? "Unmute music" : "Mute music");
  });

  const savedMute = localStorage.getItem("nikhil-site-muted");
  if (savedMute === "1") {
    audio.muted = true;
    muteToggle.setAttribute("aria-pressed", "true");
  }

  audio.addEventListener("volumechange", () => {
    localStorage.setItem("nikhil-site-muted", audio.muted ? "1" : "0");
  });
})();
