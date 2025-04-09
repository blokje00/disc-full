# Lokaal testen van de Mindfulness Coach App

Hier zijn verschillende manieren om de app lokaal te testen:

## 1. Ontwikkelingsserver

De eenvoudigste manier om de app lokaal te testen is met de ingebouwde ontwikkelingsserver van Vite:

```bash
# Start de ontwikkelingsserver
npm run dev
```

De app is dan beschikbaar op `http://localhost:5173` (of een andere poort als 5173 al in gebruik is).

## 2. Preview server

Om de productie build lokaal te testen:

```bash
# Bouw de app
npm run build

# Start de preview server
npm run preview
```

De app is dan beschikbaar op `http://localhost:4173` (of een andere poort als 4173 al in gebruik is).

## 3. HTTP server

Je kunt ook een eenvoudige HTTP server gebruiken om de gebouwde app te serveren:

```bash
# Bouw de app
npm run build

# Serveer de dist map
npm run serve-dist
```

Dit gebruikt `http-server` om de `dist` map te serveren en opent automatisch je browser.

## 4. Andere HTTP servers

Je kunt ook andere HTTP servers gebruiken:

### Python HTTP server:

```bash
cd dist
python -m http.server 8080
```

De app is dan beschikbaar op `http://localhost:8080`.

### Node.js serve:

```bash
# Installeer serve globaal
npm install -g serve

# Serveer de dist map
serve -s dist
```

## 5. Testen op andere apparaten in je lokale netwerk

Om de app te testen op andere apparaten in je lokale netwerk:

```bash
# Start de ontwikkelingsserver en maak deze beschikbaar op je netwerk
npm run dev -- --host
```

De app is dan beschikbaar op je lokale IP-adres, bijvoorbeeld `http://192.168.1.100:5173`.

## Belangrijk

- Voor PWA functionaliteit moet je de productie build gebruiken (`npm run build`)
- Voor het testen van de PWA functionaliteit is HTTPS vereist, wat lokaal lastig kan zijn
- De Ollama integratie werkt alleen als Ollama draait op dezelfde machine als de webserver
