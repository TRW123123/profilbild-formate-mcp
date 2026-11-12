# Profilbild-Formate (MCP-Server)

Remote-MCP-Server, der für Profil- und Bewerbungsfotos beantwortet: Welche Größe (px, bei Druck auch mm), welches Seitenverhältnis, welche Dateiformate und welche Hinweise zum Ausschnitt gelten für Bewerbung (Deutschland), LinkedIn, XING, WhatsApp und Instagram? Jede Zahl mit Quelle, Einordnung und Stand-Datum.

- Registry-Name (vorbereitet, nicht eingereicht): `de.profilfoto-ki/profilbild-formate`
- Website: https://www.profilfoto-ki.de
- Entwickler: Profilfoto-KI (Safak Tepecik)
- Lizenz: MIT
- Transport: Streamable HTTP, JSON-RPC 2.0 auf `POST /mcp`; `GET /health`; Protokollversionen 2025-03-26, 2025-06-18, 2025-11-25

## Status

**Öffentliche Preview (kostenlos, Netlify Function, gleicher Code):** `https://profilbild-formate-mcp.netlify.app/mcp` – am 12.11.2026 per curl geprüft (health 200, initialize, tools/list, tools/call positiv und negativ, OPTIONS 204). Manueller Deploy, nicht mit GitHub verknüpft.

Version 0.1.0, gebaut und getestet am 12.11.2026, Daten live geprüft am 12.11.2026. Lokal mit `wrangler dev` und 51 Vitest-Tests geprüft. **Kein Production-Deploy**; die URL in `server.json` (`https://profilbild-mcp.profilfoto-ki.de/mcp`) ist ein Vorschlag. Der bestehende Server auf mcp.profilfoto-ki.de bleibt unverändert.

## Tools

| Tool | Zweck |
|---|---|
| `get_profilbild_formate` | Eingabe `plattform` (`bewerbung`, `linkedin`, `xing`, `whatsapp`, `instagram`; Groß-/Kleinschreibung egal, einfache Aliase wie `bewerbungsfoto`, `insta`). Ausgabe: `masse` (je Eintrag `px`, `mm`, `seitenverhaeltnis`, `kategorie`, `px_herkunft`, `quelle`), `dateiformate`, `max_dateigroesse_mb`, `ausschnitt_hinweise`, `einordnung`, `quellen`, `stand`, `kein_amtliches_foto`. |
| `list_profilbild_plattformen` | Unterstützte Plattformen mit Kurzhinweis und Stand-Datum, dazu die bewusst fehlenden Plattformen mit Grund. |

Unbekannte oder nicht geprüfte Plattformen (z. B. `tiktok`, `facebook`) werden mit klarer Fehlermeldung abgelehnt; `passbild` verweist auf den separaten MCP „Passbild-Regel-Check“.

## Einordnung

- `offizielle_vorgabe`: technische Grenze, die die Plattform selbst nennt.
- `offizielle_empfehlung`: Empfehlung auf der Hilfe-Seite der Plattform.
- `gaengige_empfehlung`: Empfehlung einer seriösen Stelle ohne Pflicht (hier: Bundesagentur für Arbeit).
- `px_herkunft: umrechnung_300_dpi`: von uns aus mm berechnet (mm ÷ 25,4 × 300), keine Vorgabe der Quelle.

## Daten (Stand 12.11.2026)

| Plattform | Maße | Einordnung |
|---|---|---|
| Bewerbung (DE) | Lebenslauf etwa 40 × 60 bis 40 × 80 mm (≈ 472 × 709 bis 472 × 945 px bei 300 dpi), Deckblatt max. 90 × 130 mm (≈ 1063 × 1535 px) | gängige Empfehlung der BA, keine Pflicht |
| LinkedIn | Profilfoto 400 × 400 bis 7680 × 4320 px, max. 8 MB, PNG/JPEG, kein GIF; Hintergrundbild 1584 × 396 px | offizielle Vorgabe / Empfehlung |
| XING | Profilfoto 1024 × 1024 px, JPG/BMP/PNG bis 20 MB, quadratisch; Titelbild (Premium) 1280 × 624 px | offizielle Empfehlung |
| WhatsApp | keine Maße veröffentlicht; Sichtbarkeit über Privatsphäre-Einstellungen | nur Hinweise |
| Instagram | keine Maße veröffentlicht; Profilbild ist öffentlich | nur Hinweise |

## Quellen (live geprüft am 12.11.2026)

- Bundesagentur für Arbeit, Bewerbungskompass für Arbeitsstellen (Auflage Mai 2026): https://www.arbeitsagentur.de/vor-ort/datei/broschuere-bewerbungskompass-arbeitsstellen_ba097317.pdf
- LinkedIn Hilfe, Foto lässt sich nicht hochladen: https://www.linkedin.com/help/linkedin/answer/a549049/foto-lasst-sich-nicht-in-profil-hochladen?lang=de
- LinkedIn Hilfe, Richtlinien für Profilfotos: https://www.linkedin.com/help/linkedin/answer/a1377087/profile-photo-guidelines-and-conditions?lang=de
- LinkedIn Hilfe, Profilfoto hinzufügen oder ändern: https://www.linkedin.com/help/linkedin/answer/a541850/ihr-profilfoto-hinzufugen-oder-andern?lang=de
- XING Hilfe-Center, Profilfoto hochladen: https://help.xing.com/hc/de/articles/31499187723805-Ein-Profilfoto-hochladen-%C3%A4ndern-oder-l%C3%B6schen
- XING Hilfe-Center, Das XING Profil: https://help.xing.com/hc/de/articles/31499130265629-Das-XING-Profil
- XING Hilfe-Center, Titelbild: https://help.xing.com/hc/de/articles/31499254575261-Ein-Titelbild-hinzuf%C3%BCgen
- WhatsApp-Hilfebereich, Profil bearbeiten: https://faq.whatsapp.com/859240711908360/?cms_platform=web&locale=de_DE
- WhatsApp-Hilfebereich, Profilinformationen nicht sichtbar: https://faq.whatsapp.com/847237289639336/?locale=de_DE
- Instagram Help Center, Profilbild: https://help.instagram.com/557544397610546

## Kein amtliches Foto

Ein selbst erstelltes oder KI-generiertes Porträt ist kein amtliches Passbild. Keine Plattform schreibt ein KI-Foto vor. Jede Antwort sagt das im Feld `kein_amtliches_foto`.

## Scope

Gibt hinterlegte, datierte Angaben wieder. Prüft kein Foto, ruft keine Website ab, scrapt nichts, speichert nichts. Geloggt werden nur Tool-Name, Erfolg und Dauer.

## Lokal starten und testen

```bash
npm install
npm run typecheck
npm test
npm run secret-scan
npm run dev            # wrangler dev auf http://127.0.0.1:8793, ohne Cloudflare-Login
bash scripts/smoke.sh  # zweites Terminal: health, initialize, tools/list, tools/call positiv und negativ
```

## Production (offen)

Braucht einen gültigen Cloudflare-Login auf der Box und Safaks OK für eine neue Subdomain. Danach `npx wrangler deploy`, Custom Domain, `scripts/smoke.sh https://…`, dann Registry-Eintrag.
