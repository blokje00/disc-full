# Changelog

Alle belangrijke wijzigingen in dit project worden in dit bestand gedocumenteerd.

## [1.1.0] - 2024-06-13

### Toegevoegd
- Vier DISC-gebaseerde coach persona's geïmplementeerd (Rood, Geel, Groen, Blauw)
- Automatische coach selectie op basis van het gekozen DISC-type
- Reset functionaliteit voor het herstellen van de standaard persona's
- Reset pagina (reset.html) voor het geval er problemen zijn met de localStorage

### Gewijzigd
- Verbeterde gebruikersinterface met prominentere DISC-selector
- Verwijderd wit blok met tekst onderin de pagina
- Alleen laadwiel wordt getoond tijdens het genereren van de coaching tekst
- Automatische start van achtergrondmuziek en text-to-speech

### Verbeterd
- Betere integratie van het DISC-model in de coaching ervaring
- Gepersonaliseerde coaching stijl op basis van persoonlijkheidstype

## [1.0.0] - 2024-06-13

### Toegevoegd
- Eerste officiële release van de Mindfulness Coach App
- Progressive Web App functionaliteit met offline ondersteuning
- Text-to-speech voorlezing van coaching teksten
- Procedureel gegenereerde achtergrondmuziek (Calm Meditation, Ocean Waves, Forest Ambience)
- DISC persoonlijkheidstype selectie voor gepersonaliseerde coaching
- Verschillende coaching types: Bodyscan, Ademhaling, Mindfulness
- Instelbare sessieduur (5, 10, 15 minuten)
- Admin modus voor het beheren van coach-persona's
- Integratie met Ollama en het Cogito:3b model voor het genereren van coaching teksten
- Automatisch starten van achtergrondmuziek
- Welkomstscherm voor het initialiseren van audio

### Technisch
- Gebouwd met React en Vite
- Gebruikt Web Speech API voor text-to-speech
- Gebruikt Web Audio API voor procedureel gegenereerde achtergrondmuziek
- Geïmplementeerd als Progressive Web App met service worker
- Lokale opslag voor het bewaren van coach-persona's
