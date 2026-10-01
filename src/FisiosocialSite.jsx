import { useEffect, useRef, useState } from "react";
import "./FisiosocialSite.css";

const ASSET_ROOT = "https://www.fisiosocial.it/wp-content/uploads";
const COMPANY_SLUG = import.meta.env.VITE_FISIOSOCIAL_COMPANY_SLUG || "fisiosocial";

function fisiosocialBookingHref() {
  const configured = import.meta.env.VITE_FISIOSOCIAL_BOOKING_URL?.trim();
  if (!configured) return "#prenotazione";

  const url = new URL(configured, window.location.origin);
  url.searchParams.set("brand", "fisiosocial");
  url.searchParams.set("source", "website");
  return url.origin === window.location.origin ? `${url.pathname}${url.search}` : url.toString();
}

function fisiosocialPortalHref(bookingHref) {
  if (!bookingHref || bookingHref.startsWith("#")) return bookingHref || "#prenotazione";
  const url = new URL(bookingHref, window.location.origin);
  url.pathname = "/area-cliente";
  url.search = `?company=${encodeURIComponent(COMPANY_SLUG)}`;
  url.hash = "";
  return url.origin === window.location.origin ? `${url.pathname}${url.search}` : url.toString();
}

const paths = [
  {
    title: "Milano",
    text: "Valutazione e fisioterapia nel centro di Via Volvinio 33.",
    detail: "In studio · lun-ven",
    className: "fs-path--primary",
  },
  {
    title: "Brescia",
    text: "Un percorso seguito nel centro di Via Cremona 180.",
    detail: "In studio · lun-sab",
    className: "fs-path--light",
  },
  {
    title: "A domicilio",
    text: "Il professionista raggiunge il paziente quando spostarsi è difficile.",
    detail: "Disponibile su Milano",
    className: "fs-path--image",
  },
  {
    title: "Online",
    text: "Valutazione, programma personalizzato e controlli periodici da remoto.",
    detail: "Da qualsiasi luogo",
    className: "fs-path--dark",
  },
];

const methodSteps = [
  ["Ascolto", "Partiamo dalla tua storia, dalle difficoltà quotidiane e dagli obiettivi che vuoi raggiungere."],
  ["Valutazione", "Il professionista osserva il movimento e individua il percorso più adatto alla situazione."],
  ["Percorso", "Costruiamo un programma progressivo, comprensibile e sostenibile nel tempo."],
  ["Autonomia", "Controlliamo i progressi e ti aiutiamo a gestire il movimento con maggiore consapevolezza."],
];

const team = [
  { name: "Klaus Qemal", role: "Fisioterapista, personal trainer e fondatore", city: "Milano", image: `${ASSET_ROOT}/2025/02/1.png` },
  { name: "Francesco Lanzini", role: "Fisioterapista e fondatore", city: "Brescia", image: `${ASSET_ROOT}/2025/02/2.png` },
  { name: "Bartolomeo Bernago", role: "Fisioterapista", city: "Milano", image: `${ASSET_ROOT}/2025/02/3.png` },
  { name: "Simone De Rosa", role: "Fisioterapista", city: "Milano", image: `${ASSET_ROOT}/2026/05/simone-de-rosa-300x300.png` },
  { name: "Giovanni Zanetti", role: "Fisioterapista", city: "Brescia", image: `${ASSET_ROOT}/2026/05/giovanni-zanetti-1-300x300.png` },
  { name: "Mattia Bellini", role: "Fisioterapista", city: "Brescia", image: `${ASSET_ROOT}/2026/05/mattia-bellini-300x300.png` },
];

function ArrowIcon() {
  return <span className="fs-arrow" aria-hidden="true">→</span>;
}

export default function FisiosocialSite() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMobileBooking, setShowMobileBooking] = useState(false);
  const heroRef = useRef(null);
  const bookingHref = fisiosocialBookingHref();
  const portalHref = fisiosocialPortalHref(bookingHref);

  useEffect(() => {
    const previousTitle = document.title;
    const description = document.querySelector('meta[name="description"]');
    const previousDescription = description?.getAttribute("content") || "";
    const themeColor = document.querySelector('meta[name="theme-color"]');
    const previousTheme = themeColor?.getAttribute("content") || "";

    document.title = "Fisiosocial - Fisioterapia a Milano, Brescia e online";
    description?.setAttribute("content", "Percorsi di fisioterapia personalizzati nei centri Fisiosocial di Milano e Brescia, a domicilio e online. Prenota direttamente online.");
    themeColor?.setAttribute("content", "#f4f7fb");
    document.body.classList.add("fisiosocial-page-active");

    return () => {
      document.title = previousTitle;
      description?.setAttribute("content", previousDescription);
      themeColor?.setAttribute("content", previousTheme);
      document.body.classList.remove("fisiosocial-page-active");
    };
  }, []);

  useEffect(() => {
    if (!heroRef.current || !("IntersectionObserver" in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => setShowMobileBooking(!entry.isIntersecting), { threshold: 0.08 });
    observer.observe(heroRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll(".fs-site [data-reveal]"));
    if (!elements.length) return undefined;

    if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      elements.forEach((element) => element.classList.add("is-revealed"));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14, rootMargin: "0px 0px -5%" });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="fs-site">
      <a className="fs-skip" href="#contenuto">Vai al contenuto</a>

      <header className="fs-header">
        <a className="fs-logo" href="/" aria-label="Fisiosocial, homepage">
          <img src={`${ASSET_ROOT}/2020/09/logo-fisiosocial-1024x186.png`} alt="Fisiosocial" />
        </a>
        <button
          className="fs-menu-button"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="fs-navigation"
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span /><span />
          <span className="sr-only">Apri il menu</span>
        </button>
        <nav id="fs-navigation" className={menuOpen ? "is-open" : ""} aria-label="Navigazione principale">
          <a href="#percorsi" onClick={closeMenu}>Percorsi</a>
          <a href="#metodo" onClick={closeMenu}>Metodo</a>
          <a href="#sedi" onClick={closeMenu}>Sedi</a>
          <a href="#team" onClick={closeMenu}>Team</a>
          <a href="#contenuti" onClick={closeMenu}>Contenuti</a>
        </nav>
        <a className="fs-button fs-button--small" href={bookingHref}>Prenota <ArrowIcon /></a>
      </header>

      <main id="contenuto">
        <section className="fs-hero" aria-labelledby="fs-hero-title" ref={heroRef}>
          <div className="fs-hero-copy">
            <p className="fs-eyebrow"><span /> Fisioterapia, con metodo</p>
            <h1 id="fs-hero-title">Torna a muoverti.<br /><em>Con consapevolezza.</em></h1>
            <p className="fs-hero-lead">Percorsi costruiti intorno alla persona, nei centri di Milano e Brescia, a domicilio oppure online.</p>
            <div className="fs-hero-actions">
              <a className="fs-button" href={bookingHref}>Trova un appuntamento <ArrowIcon /></a>
              <a className="fs-text-link" href="#metodo">Scopri il metodo <span aria-hidden="true">↓</span></a>
            </div>
          </div>

          <div className="fs-hero-visual">
            <div className="fs-hero-image-wrap">
              <img
                src={`${ASSET_ROOT}/2024/08/Untitled-1000-x-1300-px-1-min.png`}
                alt="Klaus Qemal e Francesco Lanzini, fondatori di Fisiosocial"
                width="1100"
                height="1300"
              />
            </div>
            <div className="fs-floating-note">
              <div><strong>Disponibilità online</strong><span>Scegli servizio e orario</span></div>
              <ArrowIcon />
            </div>
          </div>
        </section>

        <aside className="fs-booking-strip" aria-label="Come funziona la prenotazione online">
          <div className="fs-booking-strip-intro"><span>Booking online</span><strong>Dal sito al calendario, senza telefonate.</strong></div>
          <ol>
            <li><p><strong>Scegli</strong> il servizio</p></li>
            <li><p><strong>Trova</strong> un orario reale</p></li>
            <li><p><strong>Conferma</strong> l’appuntamento</p></li>
          </ol>
          <a href={bookingHref} aria-label="Apri la prenotazione online"><ArrowIcon /></a>
        </aside>

        <section className="fs-evidence" aria-label="Fisiosocial in numeri" data-reveal>
          <div><strong>Dal 2017</strong><span>fisioterapia spiegata con chiarezza</span></div>
          <div><strong>2 centri</strong><span>Milano e Brescia</span></div>
          <div><strong>150 mila+</strong><span>iscritti alla community YouTube</span></div>
          <div><strong>13 milioni+</strong><span>visualizzazioni dei contenuti</span></div>
        </section>

        <section className="fs-intro" aria-label="Presentazione">
          <p>Non inseguiamo una soluzione veloce.</p>
          <h2 data-reveal>Ti aiutiamo a capire il movimento, recuperarlo e renderlo di nuovo parte della tua vita.</h2>
        </section>

        <section className="fs-section" id="percorsi" aria-labelledby="fs-paths-title">
          <div className="fs-section-heading">
            <div data-reveal><h2 id="fs-paths-title">Un percorso, quattro modi per seguirlo.</h2></div>
            <p>In studio, a casa o da remoto: la qualità del metodo resta la stessa. Cambia il modo in cui raggiungiamo il tuo obiettivo.</p>
          </div>
          <div className="fs-path-grid">
            {paths.map((path, index) => (
              <article key={path.title} className={`fs-path ${path.className}`} data-reveal style={{ "--fs-delay": `${index * 70}ms` }}>
                <div><p>{path.detail}</p><h3>{path.title}</h3><span>{path.text}</span></div>
                <a href={bookingHref} aria-label={`Prenota per ${path.title}`}>Prenota <ArrowIcon /></a>
              </article>
            ))}
          </div>
        </section>

        <section className="fs-method" id="metodo" aria-labelledby="fs-method-title">
          <div className="fs-method-sticky">
            <p className="fs-eyebrow fs-eyebrow--light"><span /> Il metodo Fisiosocial</p>
            <h2 id="fs-method-title">Il paziente non assiste al recupero.<br /><em>Ne diventa protagonista.</em></h2>
            <p>Ogni scelta viene spiegata. Ogni esercizio ha uno scopo. Ogni progresso diventa uno strumento per acquisire autonomia.</p>
            <a className="fs-text-link fs-text-link--light" href={bookingHref}>Inizia dalla valutazione <ArrowIcon /></a>
          </div>
          <ol className="fs-method-list">
            {methodSteps.map(([title, text], index) => (
              <li key={title} data-reveal style={{ "--fs-delay": `${index * 65}ms` }}><span aria-hidden="true" /><div><h3>{title}</h3><p>{text}</p></div></li>
            ))}
          </ol>
        </section>

        <section className="fs-body-map" aria-labelledby="fs-help-title">
          <div className="fs-body-map-copy">
            <h2 id="fs-help-title" data-reveal>Partiamo da ciò che oggi limita il tuo movimento.</h2>
            <p>Dolore, rigidità, recupero dopo un intervento o ritorno allo sport: la prima visita serve a inquadrare il problema e impostare il lavoro.</p>
            <a className="fs-button fs-button--outline" href={bookingHref}>Prenota una valutazione <ArrowIcon /></a>
          </div>
          <div className="fs-topic-list">
            {["Schiena e cervicale", "Spalla e arto superiore", "Anca e ginocchio", "Piede e caviglia", "Recupero post-operatorio", "Infortuni sportivi", "Riabilitazione neurologica", "Mobilità e postura"].map((topic, index) => (
              <div key={topic} data-reveal style={{ "--fs-delay": `${index * 35}ms` }}><span aria-hidden="true" /><p>{topic}</p></div>
            ))}
          </div>
        </section>

        <section className="fs-section fs-locations" id="sedi" aria-labelledby="fs-locations-title">
          <div className="fs-section-heading fs-section-heading--compact">
            <div data-reveal><h2 id="fs-locations-title">Due centri, lo stesso approccio.</h2></div>
          </div>
          <div className="fs-location-grid">
            <article className="fs-location fs-location--milano">
              <img src={`${ASSET_ROOT}/2024/08/MILANO.webp`} alt="Centro fisioterapico Fisiosocial di Milano" loading="lazy" />
              <div className="fs-location-panel">
                <span>Milano</span><h3>Via Volvinio, 33</h3>
                <p>Lunedì-venerdì<br />10:00-13:00 · 15:00-20:00</p>
                <div><a href={bookingHref}>Prenota a Milano <ArrowIcon /></a><a href="https://maps.google.com/?q=Via+Volvinio+33+Milano" target="_blank" rel="noreferrer">Indicazioni ↗</a></div>
              </div>
            </article>
            <article className="fs-location fs-location--brescia">
              <img src={`${ASSET_ROOT}/2024/08/MILANO-_1_.webp`} alt="Centro fisioterapico Fisiosocial di Brescia" loading="lazy" />
              <div className="fs-location-panel">
                <span>Brescia</span><h3>Via Cremona, 180</h3>
                <p>Lunedì-venerdì 10:00-13:00 · 15:00-20:00<br />Sabato 10:00-13:00</p>
                <div><a href={bookingHref}>Prenota a Brescia <ArrowIcon /></a><a href="https://maps.google.com/?q=Via+Cremona+180+Brescia" target="_blank" rel="noreferrer">Indicazioni ↗</a></div>
              </div>
            </article>
          </div>
        </section>

        <section className="fs-team" id="team" aria-labelledby="fs-team-title">
          <div className="fs-team-heading" data-reveal>
            <h2 id="fs-team-title">Professionisti che ascoltano, spiegano e costruiscono il percorso con te.</h2>
          </div>
          <div className="fs-team-grid">
            {team.map((person, index) => (
              <article className={index < 2 ? "fs-person fs-person--featured" : "fs-person"} key={person.name} data-reveal style={{ "--fs-delay": `${index * 55}ms` }}>
                <div className="fs-person-image"><img src={person.image} alt={`Dott. ${person.name}`} loading="lazy" /></div>
                <div><span>{person.city}</span><h3>Dott. {person.name}</h3><p>{person.role}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section className="fs-editorial" id="contenuti" aria-labelledby="fs-editorial-title">
          <div className="fs-editorial-main">
            <span className="fs-editorial-count">150K+</span>
            <div data-reveal><h2 id="fs-editorial-title">La fisioterapia continua anche fuori dallo studio.</h2><p>Video, approfondimenti ed esercizi spiegati in modo chiaro per aiutare più persone a conoscere il proprio corpo.</p></div>
          </div>
          <div className="fs-editorial-links">
            <a href="https://www.youtube.com/@FISIOSOCIAL" target="_blank" rel="noreferrer"><span>YouTube</span><strong>Guarda i video</strong><ArrowIcon /></a>
            <a href="https://www.fisiosocial.it/blog/" target="_blank" rel="noreferrer"><span>Approfondimenti</span><strong>Leggi gli articoli</strong><ArrowIcon /></a>
            <a href="https://www.fisiosocial.it/risorse-e-corsi/" target="_blank" rel="noreferrer"><span>Percorsi autonomi</span><strong>Scopri i videocorsi</strong><ArrowIcon /></a>
          </div>
        </section>

        <section className="fs-final-cta" id="prenotazione" aria-labelledby="fs-final-title">
          <p className="fs-eyebrow"><span /> Il primo passo</p>
          <h2 id="fs-final-title">Capire da dove partire.</h2>
          <p>Scegli il servizio e consulta gli orari disponibili. La prenotazione entra direttamente nel calendario Fisiosocial.</p>
          <a className="fs-button" href={bookingHref}>Trova il primo appuntamento <ArrowIcon /></a>
          <span className="fs-final-watermark" aria-hidden="true">FISIOSOCIAL</span>
        </section>
      </main>

      <footer className="fs-footer">
        <div className="fs-footer-brand"><a className="fs-logo fs-logo--light" href="/"><img src={`${ASSET_ROOT}/2020/09/logo_white3-1024x186.png`} alt="Fisiosocial" /></a><p>Il movimento torna ad avere senso quando sai perché lo stai facendo.</p></div>
        <div><span>Milano</span><p>Via Volvinio, 33<br /><a href="tel:+393519670510">351 967 0510</a></p></div>
        <div><span>Brescia</span><p>Via Cremona, 180<br /><a href="tel:+393513318535">351 331 8535</a></p></div>
        <div><span>Seguici</span><p><a href="https://www.instagram.com/fisiosocial_official/" target="_blank" rel="noreferrer">Instagram ↗</a><br /><a href="https://www.youtube.com/@FISIOSOCIAL" target="_blank" rel="noreferrer">YouTube ↗</a></p></div>
        <div className="fs-footer-bottom"><p>© Fisiosocial di Qemal e Lanzini S.N.C. - S.T.P.</p><nav aria-label="Link legali"><a href="https://www.iubenda.com/privacy-policy/73702944" target="_blank" rel="noreferrer">Privacy</a><a href="https://www.iubenda.com/privacy-policy/73702944/cookie-policy" target="_blank" rel="noreferrer">Cookie</a><a href={portalHref}>Area paziente</a></nav></div>
      </footer>

      <a className={`fs-mobile-booking ${showMobileBooking ? "is-visible" : ""}`} href={bookingHref}>Prenota online <ArrowIcon /></a>
    </div>
  );
}
