import {plattformen} from './schema';
export type Plattform=typeof plattformen[number];
export type Kategorie='offizielle_vorgabe'|'offizielle_empfehlung'|'gaengige_empfehlung';
export const STAND='2026-11-12';
export const DPI=300;
export const scope='Gibt nur hinterlegte, am Stand-Datum live geprüfte Angaben wieder. Prüft kein Foto, ruft keine Website ab, scrapt nichts, speichert nichts. Plattformen können ihre Vorgaben jederzeit ändern; maßgeblich ist die jeweilige Hilfe-Seite.';
export const kein_amtliches_foto='Ein selbst erstelltes oder KI-generiertes Porträt ist kein amtliches Passbild. Keine der hier genannten Plattformen schreibt ein KI-Foto vor; die Angaben betreffen nur Format und Darstellung.';
export const einordnung_legende='offizielle_vorgabe = technische Grenze, die die Plattform selbst nennt; offizielle_empfehlung = Empfehlung auf der Hilfe-Seite der Plattform; gaengige_empfehlung = Empfehlung einer seriösen Stelle ohne Pflicht. px_herkunft "umrechnung_300_dpi" heißt: von uns aus mm berechnet (mm ÷ 25,4 × 300), keine Vorgabe der Quelle.';
export type Quelle={titel:string;url:string;stand_der_quelle:string;live_geprueft_am:string};
const q=(titel:string,url:string,stand_der_quelle:string):Quelle=>({titel,url,stand_der_quelle,live_geprueft_am:STAND});
export const Q={
 ba:q('Bundesagentur für Arbeit: Bewerbungskompass für Arbeitsstellen (Broschüre, Kapitel „Bewerbungsfoto – Wirkung auf Mensch und Maschine“)','https://www.arbeitsagentur.de/vor-ort/datei/broschuere-bewerbungskompass-arbeitsstellen_ba097317.pdf','Auflage Mai 2026'),
 liUpload:q('LinkedIn Hilfe: Foto lässt sich nicht in Ihr Profil hochladen','https://www.linkedin.com/help/linkedin/answer/a549049/foto-lasst-sich-nicht-in-profil-hochladen?lang=de','laut Seite „Zuletzt aktualisiert: Vor 1 Jahr“'),
 liRichtlinien:q('LinkedIn Hilfe: Richtlinien und Anforderungen für Profilfotos','https://www.linkedin.com/help/linkedin/answer/a1377087/profile-photo-guidelines-and-conditions?lang=de','laut Seite „Zuletzt aktualisiert: Vor 2 Jahren“'),
 liAendern:q('LinkedIn Hilfe: Ihr LinkedIn Profilfoto hinzufügen, ändern, bearbeiten oder löschen','https://www.linkedin.com/help/linkedin/answer/a541850/ihr-profilfoto-hinzufugen-oder-andern?lang=de','laut Seite „Zuletzt aktualisiert: Vor 1 Jahr“'),
 xingFoto:q('XING Hilfe-Center: Ein Profilfoto hochladen, ändern oder löschen','https://help.xing.com/hc/de/articles/31499187723805-Ein-Profilfoto-hochladen-%C3%A4ndern-oder-l%C3%B6schen','Artikel bearbeitet 12.01.2026'),
 xingProfil:q('XING Hilfe-Center: Das XING Profil (Checkliste für Recruiter-Profile)','https://help.xing.com/hc/de/articles/31499130265629-Das-XING-Profil','Artikel bearbeitet 03.12.2025'),
 xingTitel:q('XING Hilfe-Center: Ein Titelbild hinzufügen','https://help.xing.com/hc/de/articles/31499254575261-Ein-Titelbild-hinzuf%C3%BCgen','Artikel bearbeitet 03.12.2025'),
 waProfil:q('WhatsApp-Hilfebereich: Profil bearbeiten','https://faq.whatsapp.com/859240711908360/?cms_platform=web&locale=de_DE','ohne Datum auf der Seite'),
 waSichtbar:q('WhatsApp-Hilfebereich: Profilinformationen eines Kontakts werden nicht angezeigt','https://faq.whatsapp.com/847237289639336/?locale=de_DE','ohne Datum auf der Seite'),
 igProfil:q('Instagram Help Center: Add a profile picture or change your current picture on Instagram','https://help.instagram.com/557544397610546','ohne Datum auf der Seite')
} as const;
export type Masse={breite:number;hoehe:number};
export type Mass={bezeichnung:string;kategorie:Kategorie;px:Masse|null;px_herkunft:'quelle'|'umrechnung_300_dpi'|null;mm:Masse|null;seitenverhaeltnis:string|null;erlaeuterung:string;quelle:string};
export const mmZuPx=(mm:number,dpi=DPI)=>Math.round(mm/25.4*dpi);
const druck=(bezeichnung:string,breite:number,hoehe:number,seitenverhaeltnis:string,erlaeuterung:string,quelle:string):Mass=>({bezeichnung,kategorie:'gaengige_empfehlung',mm:{breite,hoehe},px:{breite:mmZuPx(breite),hoehe:mmZuPx(hoehe)},px_herkunft:'umrechnung_300_dpi',seitenverhaeltnis,erlaeuterung,quelle});
const digital=(bezeichnung:string,kategorie:Kategorie,breite:number,hoehe:number,seitenverhaeltnis:string,erlaeuterung:string,quelle:string):Mass=>({bezeichnung,kategorie,px:{breite,hoehe},px_herkunft:'quelle',mm:null,seitenverhaeltnis,erlaeuterung,quelle});
export type Format={plattform:Plattform;bezeichnung:string;kurzhinweis:string;offizielle_masse_veroeffentlicht:boolean;masse:Mass[];dateiformate:string[];max_dateigroesse_mb:number|null;ausschnitt_hinweise:string[];einordnung:string;quellen:Quelle[]};
export const formate:Record<Plattform,Format>={
 bewerbung:{plattform:'bewerbung',bezeichnung:'Bewerbungsfoto (Deutschland)',kurzhinweis:'Keine gesetzliche Vorgabe; Bundesagentur für Arbeit: Lebenslauf etwa 4 × 6 bis 4 × 8 cm, Deckblatt höchstens 9 × 13 cm.',offizielle_masse_veroeffentlicht:false,
  masse:[
   druck('Lebenslauf, untere Spanne',40,60,'2:3','BA: „Für den Lebenslauf eignet sich ein Format von etwa 4 × 6 cm bis 4 × 8 cm.“ px nur Umrechnung bei 300 dpi.',Q.ba.url),
   druck('Lebenslauf, obere Spanne',40,80,'1:2','Obere Grenze der BA-Spanne für den Lebenslauf. px nur Umrechnung bei 300 dpi.',Q.ba.url),
   druck('Deckblatt, maximal',90,130,'9:13','BA: „Für ein Deckblatt kann das Foto etwas größer sein (maximal 9 × 13 cm).“ px nur Umrechnung bei 300 dpi.',Q.ba.url)
  ],
  dateiformate:[],max_dateigroesse_mb:null,
  ausschnitt_hinweise:[
   'Ein Bewerbungsfoto ist keine Pflicht; viele Unternehmen verlangen keins. Lieber kein Foto als ein schlechtes (BA).',
   'Klar und scharf, ruhiger neutraler Hintergrund, natürlich und authentisch; leicht lächeln, in die Kamera blicken, gepflegte Kleidung (BA).',
   'Vermeiden: Selfies, Urlaubs- oder Freizeitfotos, unscharfe oder stark zugeschnittene Bilder (BA).',
   'Die BA weist darauf hin, dass von einer KI umgearbeitete Handyfotos oft künstlich wirken und Personalverantwortliche skeptisch reagieren können.',
   'Ein neues Foto ist sinnvoll, wenn es älter als ein Jahr ist oder sich das Aussehen deutlich verändert hat (BA).',
   'Für Online-Bewerbungen wird das Foto digital gebraucht; eine Pixelvorgabe nennt die BA nicht. Nennt ein Bewerbungsportal eigene Upload-Vorgaben, gelten diese.'
  ],
  einordnung:'Keine offizielle Vorgabe: Das Bewerbungsfoto ist gesetzlich nicht geregelt. Die cm-Maße sind eine Empfehlung der Bundesagentur für Arbeit (gaengige_empfehlung). Die px-Werte sind von uns bei 300 dpi umgerechnet, keine Vorgabe.',
  quellen:[Q.ba]},
 linkedin:{plattform:'linkedin',bezeichnung:'LinkedIn-Profilfoto',kurzhinweis:'Offiziell: 400 × 400 bis 7680 × 4320 px, max. 8 MB, PNG oder JPEG; Hintergrundbild empfohlen 1584 × 396 px.',offizielle_masse_veroeffentlicht:true,
  masse:[
   digital('Profilfoto, Mindestgröße','offizielle_vorgabe',400,400,'1:1','„Die Größe muss zwischen 400 x 400 Pixel (B x H) und 7680 x 4320 Pixel (B x H) liegen.“',Q.liUpload.url),
   digital('Profilfoto, Höchstgröße','offizielle_vorgabe',7680,4320,'16:9','Obere Grenze laut LinkedIn Hilfe.',Q.liUpload.url),
   digital('Hintergrundbild (nicht das Profilfoto)','offizielle_empfehlung',1584,396,'4:1','„Hintergrundbild: Die empfohlenen Abmessungen sind 1584 x 396 Pixel (B x H).“',Q.liUpload.url)
  ],
  dateiformate:['PNG','JPEG'],max_dateigroesse_mb:8,
  ausschnitt_hinweise:[
   'GIFs werden nicht unterstützt.',
   'LinkedIn empfiehlt ein Foto, das nicht stark zugeschnitten werden muss; nach dem Hochladen lassen sich Ausschnitt, Position und Größe anpassen.',
   'Das Profilfoto sollte dem eigenen Aussehen entsprechen; eine Illustration oder künstlerische Darstellung ist möglich, wenn sie das tut.',
   'LinkedIn kann Fotos entfernen, die nur Firmenlogos, Emojis, Landschaften, Tiere, Wörter oder Sätze, Kinder- oder Babyfotos oder andere Personen zeigen.',
   'Die Sichtbarkeit des Profilfotos lässt sich einstellen.'
  ],
  einordnung:'Die Pixelgrenzen, Dateigröße und Dateitypen sind offizielle Vorgaben aus der LinkedIn Hilfe. Ein festes Seitenverhältnis für das Profilfoto nennt LinkedIn nicht.',
  quellen:[Q.liUpload,Q.liRichtlinien,Q.liAendern]},
 xing:{plattform:'xing',bezeichnung:'XING-Profilfoto',kurzhinweis:'Offiziell empfohlen: 1024 × 1024 px; JPG, BMP oder PNG bis 20 MB; quadratisches Format am besten geeignet.',offizielle_masse_veroeffentlicht:true,
  masse:[
   digital('Profilfoto','offizielle_empfehlung',1024,1024,'1:1','„Empfohlene Auflösung: 1024 x 1024 Pixel.“',Q.xingFoto.url),
   digital('Titelbild (nur Premium, nicht das Profilfoto)','offizielle_empfehlung',1280,624,'80:39 (ca. 2,05:1)','Empfohlene Auflösung 1280 × 624 px; sofort sichtbar ist der Bereich 1280 × 338 px.',Q.xingTitel.url)
  ],
  dateiformate:['JPG','BMP','PNG'],max_dateigroesse_mb:20,
  ausschnitt_hinweise:[
   'Am besten geeignet ist ein quadratisches Format (XING Hilfe-Center, Checkliste für Recruiter-Profile).',
   'Nach dem Hochladen wählst du den angezeigten Bildbereich aus; Zoomen und Verschieben sind möglich.',
   'XING empfiehlt ein authentisches Bild mit sympathischem Gesichtsausdruck.'
  ],
  einordnung:'Die 1024 × 1024 px sind eine offizielle Empfehlung von XING, keine Mindestgröße. Dateitypen und 20 MB sind die von XING genannten Upload-Grenzen.',
  quellen:[Q.xingFoto,Q.xingProfil,Q.xingTitel]},
 whatsapp:{plattform:'whatsapp',bezeichnung:'WhatsApp-Profilbild',kurzhinweis:'WhatsApp nennt im Hilfebereich keine Maße; wichtig sind die Sichtbarkeits-Einstellungen.',offizielle_masse_veroeffentlicht:false,
  masse:[],dateiformate:[],max_dateigroesse_mb:null,
  ausschnitt_hinweise:[
   'Der WhatsApp-Hilfebereich nennt keine Pixelmaße, kein Seitenverhältnis und keine Dateigröße für das Profilbild. Zahlen aus Drittquellen übernehmen wir nicht.',
   'Profilbild: Foto aufnehmen, Bild hochladen oder Bild entfernen. In bestimmten Ländern gibt es eine Option für KI-generierte Profilbilder.',
   'Wer das Profilbild sieht, legst du unter Einstellungen > Privatsphäre > Profilbild fest: Alle, Meine Kontakte, Meine Kontakte außer … oder Niemand.',
   'Blockierte Personen sehen keine Aktualisierungen deines Profilbilds. Ohne angepasste Einstellungen erscheint das Profilbild in den Benachrichtigungen deiner Kontakte.',
   'Ist ein Profilbild nicht sichtbar, nennt WhatsApp als Gründe: Datenschutz-Einstellungen, fehlende Kontakt-Synchronisierung, Blockierung, Kontakt nicht gespeichert oder Netzwerkproblem.'
  ],
  einordnung:'Keine offiziellen Maße veröffentlicht. Die Hinweise zu Sichtbarkeit und Bearbeitung stammen aus dem WhatsApp-Hilfebereich.',
  quellen:[Q.waProfil,Q.waSichtbar]},
 instagram:{plattform:'instagram',bezeichnung:'Instagram-Profilbild',kurzhinweis:'Instagram nennt im Help Center keine Maße; das Profilbild ist öffentlich sichtbar.',offizielle_masse_veroeffentlicht:false,
  masse:[],dateiformate:[],max_dateigroesse_mb:null,
  ausschnitt_hinweise:[
   'Das Instagram Help Center nennt keine Pixelmaße, kein Seitenverhältnis und keine Dateigröße für das Profilbild. Häufig zitierte Zahlen wie 320 × 320 px stammen aus Drittquellen und werden hier nicht als Vorgabe übernommen.',
   'Laut Instagram ist das Profilbild für alle öffentlich, auf und außerhalb von Instagram, auch für Personen ohne Konto.',
   'Du kannst ein neues Foto aufnehmen, eines aus der Mediathek wählen oder das Facebook-Profilbild übernehmen.'
  ],
  einordnung:'Keine offiziellen Maße veröffentlicht. Die Hinweise stammen aus dem Instagram Help Center.',
  quellen:[Q.igProfil]}
};
export const nichtUnterstuetzt:Record<string,string>={
 facebook:'Facebook ist in v0.1 nicht enthalten, weil wir die Angaben nicht live gegen eine offizielle Meta-Hilfeseite geprüft haben.',
 tiktok:'TikTok ist in v0.1 nicht enthalten, weil wir keine offizielle Größenangabe live geprüft haben.',
 x:'X (Twitter) ist in v0.1 nicht enthalten, weil wir keine offizielle Größenangabe live geprüft haben.',
 twitter:'X (Twitter) ist in v0.1 nicht enthalten, weil wir keine offizielle Größenangabe live geprüft haben.',
 threads:'Threads ist in v0.1 nicht enthalten, weil wir keine offizielle Größenangabe live geprüft haben.',
 teams:'Microsoft Teams ist in v0.1 nicht enthalten, weil wir keine offizielle Größenangabe live geprüft haben.',
 zoom:'Zoom ist in v0.1 nicht enthalten, weil wir keine offizielle Größenangabe live geprüft haben.',
 passbild:'Passbilder für Ausweis und Reisepass sind amtlich geregelt und nicht Teil dieses Tools. Dafür gibt es den separaten MCP „Passbild-Regel-Check“.',
 ausweis:'Passbilder für Ausweis und Reisepass sind amtlich geregelt und nicht Teil dieses Tools. Dafür gibt es den separaten MCP „Passbild-Regel-Check“.',
 reisepass:'Passbilder für Ausweis und Reisepass sind amtlich geregelt und nicht Teil dieses Tools. Dafür gibt es den separaten MCP „Passbild-Regel-Check“.'
};
const aliase:Record<string,Plattform>={bewerbungsfoto:'bewerbung',lebenslauf:'bewerbung',bewerbung_de:'bewerbung','linked-in':'linkedin','linked in':'linkedin','whats app':'whatsapp',insta:'instagram',ig:'instagram'};
export function normalisiere(eingabe:string):Plattform{
 const k=eingabe.trim().toLowerCase();
 if((plattformen as readonly string[]).includes(k))return k as Plattform;
 if(Object.hasOwn(aliase,k))return aliase[k];
 if(Object.hasOwn(nichtUnterstuetzt,k))throw Error(`${nichtUnterstuetzt[k]} Unterstützt: ${plattformen.join(', ')}.`);
 throw Error(`Plattform „${eingabe.trim()}“ wird nicht unterstützt (keine live geprüfte offizielle Quelle). Unterstützt: ${plattformen.join(', ')}. Mit list_profilbild_plattformen die Liste abrufen.`);
}
export function getProfilbildFormate({plattform}:{plattform:string}){
 const f=formate[normalisiere(plattform)];
 return {...f,einordnung_legende,kein_amtliches_foto,stand:STAND,hinweis:'Angaben ohne Gewähr; Plattformen ändern Vorgaben ohne Ankündigung. Vor dem Hochladen die verlinkte Hilfe-Seite prüfen.',scope};
}
export function listProfilbildPlattformen(){
 return {stand:STAND,plattformen:plattformen.map(p=>{const f=formate[p];return {plattform:p,bezeichnung:f.bezeichnung,kurzhinweis:f.kurzhinweis,offizielle_masse_veroeffentlicht:f.offizielle_masse_veroeffentlicht,stand:STAND};}),
  nicht_unterstuetzt:['facebook','tiktok','x','threads','teams','zoom','passbild'].map(p=>({plattform:p,grund:nichtUnterstuetzt[p]})),
  kein_amtliches_foto,hinweis:'Details je Plattform mit get_profilbild_formate abrufen.',scope};
}
