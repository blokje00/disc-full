# Mindfulness Coach App v1.1.0

Een Progressive Web App voor mindfulness, ademhalingsoefeningen en bodyscan meditaties met text-to-speech functionaliteit.

## Functionaliteiten

- Gepersonaliseerde mindfulness coaching
- Verschillende soorten meditatie en ademhalingsoefeningen
- Coaching aangepast aan jouw persoonlijkheidstype (DISC-model)
- Text-to-speech voorlezing van coaching teksten
- Procedureel gegenereerde achtergrondmuziek
- Admin modus voor het beheren van coach-persona's
- Progressive Web App (installeerbaar op desktop en mobiel)

## Technische Stack

- **Frontend Framework**: React 18+
- **Build Tool**: Vite
- **Language**: JavaScript (ES6+)
- **Styling**: CSS3 met CSS variabelen
- **API Integration**: Fetch API
- **Audio**: Web Speech API, Web Audio API
- **PWA**: Service Workers, Web App Manifest

## Installatie

1. Clone de repository
2. Installeer dependencies:
   ```
   npm install
   ```
3. Start de ontwikkelingsserver:
   ```
   npm run dev
   ```
4. Open http://localhost:5173 in je browser

## Ollama Integratie

De app maakt gebruik van Ollama voor het genereren van coaching teksten. Zorg ervoor dat Ollama is geïnstalleerd en draait op je lokale machine:

1. Installeer Ollama van [ollama.ai](https://ollama.ai)
2. Start Ollama
3. Pull het cogito:3b model:
   ```
   ollama pull cogito:3b
   ```

## Productie Build

Om een productie build te maken:

```
npm run build
```

De gebouwde bestanden worden in de `dist` map geplaatst en kunnen worden gehost op elke statische webserver.

## PWA Installatie

De app kan worden geïnstalleerd als een Progressive Web App:

1. Open de app in een ondersteunde browser (Chrome, Edge, etc.)
2. Klik op het installatie-icoon in de adresbalk of gebruik de installatieprompt in de app
3. Volg de instructies om de app te installeren

## Licentie

MIT
