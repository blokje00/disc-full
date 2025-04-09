# Deployment naar Netlify

Volg deze stappen om de Mindfulness Coach app te deployen naar Netlify:

## 1. Maak een Netlify account aan

Ga naar [Netlify](https://www.netlify.com/) en maak een account aan als je er nog geen hebt.

## 2. Deploy via de Netlify UI

1. Log in op je Netlify account
2. Ga naar de Netlify dashboard
3. Sleep de `dist` map naar het "Drag and drop your site folder here" gebied
4. Wacht tot de upload en deployment is voltooid
5. Je site is nu live op een willekeurig Netlify subdomein

## 3. Deploy via de Netlify CLI

Als alternatief kun je de Netlify CLI gebruiken:

```bash
# Installeer de Netlify CLI
npm install netlify-cli -g

# Login op Netlify
netlify login

# Initialiseer je project
netlify init

# Deploy je site
netlify deploy --prod
```

## 4. Continuous Deployment instellen

Voor continuous deployment vanaf GitHub:

1. Push je code naar een GitHub repository
2. Log in op Netlify
3. Klik op "New site from Git"
4. Kies GitHub als je Git provider
5. Selecteer je repository
6. Configureer de build instellingen:
   - Build command: `npm run build`
   - Publish directory: `dist`
7. Klik op "Deploy site"

## 5. Aangepast domein instellen

1. Ga naar je site instellingen in Netlify
2. Klik op "Domain settings"
3. Klik op "Add custom domain"
4. Volg de instructies om je domein te configureren

## Belangrijk

- Voor Netlify deployment hoef je de `base` in `vite.config.js` niet aan te passen
- Het `netlify.toml` bestand zorgt ervoor dat alle routes correct worden afgehandeld voor een SPA
