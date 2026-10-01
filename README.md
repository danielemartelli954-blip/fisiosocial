# Fisiosocial Site

Sito pubblico autonomo di Fisiosocial. Il progetto non contiene il gestionale:
le CTA aprono esclusivamente il link pubblico di prenotazione generato da Cypher Web.

## Sviluppo locale

```bash
npm install
copy .env.example .env
npm run dev
```

Il sito locale viene eseguito su `http://localhost:5174`.

## Collegamento alle prenotazioni

Impostare in `.env` il link completo copiato dal gestionale:

```env
VITE_FISIOSOCIAL_BOOKING_URL=https://cypher-web-app-daniele-webc-ompany.vercel.app/prenota?company=demofisiosocial
VITE_FISIOSOCIAL_COMPANY_SLUG=demofisiosocial
```

Il sito aggiunge automaticamente i parametri `brand=fisiosocial` e
`source=website` senza modificare gli altri parametri del link generato.

## Deploy Vercel

Creare un nuovo progetto Vercel con questa cartella come Root Directory:

- Root Directory: `fisiosocial-site`
- Framework: Vite
- Build Command: `npm run build`
- Output Directory: `dist`

Configurare le due variabili d'ambiente prima del deploy di produzione.

