# Deployment Instructies

Volg deze stappen om de Mindfulness Coach app te deployen naar GitHub Pages:

## 1. Maak een GitHub repository aan

Ga naar [GitHub](https://github.com) en maak een nieuwe repository aan met de naam `mindfulness-coach`.

## 2. Initialiseer Git en push je code

```bash
# Ga naar de project directory
cd mindfulness-coach

# Initialiseer Git
git init

# Voeg alle bestanden toe
git add .

# Commit de bestanden
git commit -m "Initial commit v1.0.0"

# Voeg de remote repository toe
git remote add origin https://github.com/JOUW_GEBRUIKERSNAAM/mindfulness-coach.git

# Push de code naar GitHub
git push -u origin main
```

## 3. Configureer GitHub Pages

1. Ga naar je repository op GitHub
2. Ga naar "Settings" > "Pages"
3. Bij "Source", selecteer "GitHub Actions"
4. De workflow die we hebben toegevoegd zal automatisch de app bouwen en deployen

## 4. Toegang tot de app

Na een succesvolle deployment is je app beschikbaar op:
`https://JOUW_GEBRUIKERSNAAM.github.io/mindfulness-coach/`

## 5. Handmatige deployment

Als je de app handmatig wilt deployen, kun je de volgende commando's gebruiken:

```bash
# Bouw de app
npm run build

# Installeer gh-pages als dev dependency
npm install gh-pages --save-dev

# Deploy de app
npx gh-pages -d dist
```

## Belangrijk

- Zorg ervoor dat je de `base` in `vite.config.js` hebt ingesteld op `/mindfulness-coach/`
- Zorg ervoor dat de `start_url` in het manifest ook is ingesteld op `/mindfulness-coach/`
- Als je een aangepaste domein gebruikt, pas dan deze paden aan
