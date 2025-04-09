# Toegang tot de Mindfulness Coach App vanaf het Internet

Er zijn verschillende manieren om de Mindfulness Coach app vanaf het internet toegankelijk te maken:

## 1. GitHub Pages (Aanbevolen voor persoonlijk gebruik)

GitHub Pages is een gratis hosting service van GitHub die perfect is voor statische websites zoals deze app.

### Deployment stappen:
Volg de instructies in het [DEPLOY.md](./DEPLOY.md) bestand om de app te deployen naar GitHub Pages.

### Voordelen:
- Gratis hosting
- Eenvoudige setup
- Automatische deployment via GitHub Actions
- Werkt goed met PWA functionaliteit

### Nadelen:
- Vereist een GitHub account
- URL is in het formaat `username.github.io/mindfulness-coach`

## 2. Netlify (Aanbevolen voor professioneel gebruik)

Netlify biedt gratis hosting met meer functies dan GitHub Pages.

### Deployment stappen:
Volg de instructies in het [DEPLOY_NETLIFY.md](./DEPLOY_NETLIFY.md) bestand om de app te deployen naar Netlify.

### Voordelen:
- Gratis hosting
- Eenvoudige setup
- Continuous deployment
- Aangepaste domeinnamen
- Formulierverwerking
- Serverless functies

### Nadelen:
- Gratis tier heeft beperkingen voor bandbreedte

## 3. Vercel

Vercel is vergelijkbaar met Netlify en biedt ook gratis hosting voor statische websites.

### Deployment stappen:
1. Maak een account aan op [Vercel](https://vercel.com)
2. Installeer de Vercel CLI: `npm install -g vercel`
3. Login: `vercel login`
4. Deploy: `vercel`

### Voordelen:
- Gratis hosting
- Eenvoudige setup
- Continuous deployment
- Aangepaste domeinnamen
- Serverless functies

### Nadelen:
- Gratis tier heeft beperkingen

## 4. Firebase Hosting

Google's Firebase biedt ook hosting voor statische websites.

### Deployment stappen:
1. Maak een Firebase account aan
2. Installeer Firebase CLI: `npm install -g firebase-tools`
3. Login: `firebase login`
4. Initialiseer: `firebase init hosting`
5. Deploy: `firebase deploy --only hosting`

### Voordelen:
- Gratis hosting
- Integratie met andere Firebase diensten
- Goede prestaties

### Nadelen:
- Complexere setup

## 5. Eigen webserver

Als je toegang hebt tot een eigen webserver, kun je de app daar ook hosten.

### Deployment stappen:
1. Bouw de app: `npm run build`
2. Upload de inhoud van de `dist` map naar je webserver
3. Configureer je webserver om alle routes naar `index.html` te sturen

## Belangrijk

- Zorg ervoor dat je webserver HTTPS ondersteunt, dit is vereist voor PWA functionaliteit
- Als je een aangepast domein gebruikt, pas dan de `base` in `vite.config.js` en de `start_url` in het manifest aan
