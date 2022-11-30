# Hvordan lage admin side for techtube

> Til Wictor

### Del 1 - Getting started

1. [Last ned git](https://github.com/git-for-windows/git/releases/download/v2.38.1.windows.1/Git-2.38.1-64-bit.exe)
2. Trykk på windows-knappen og søk på `powershell`, derretter trykk på powershell
3. Kjør kommandoen:

```powershell
cd "C:\users\wbro\"
git clone https://github.com/ToITAS/techtube
```

4. Åpne Visual Studio Code
5. Trykk på `CTRL + K + O`

6. Åpne mappen `techtube` i `C:\Users\Wbro\` <u>**IKKE**</u> `techtube-admin`

7. Gå gjennom stegene i `readme.md` husk å last ned en mysql server <u>**IKKE**</u> bruk xamp
8. Etter du har gått gjennom alle stegene kan du begynde å lage admin siden i `techtube-admin`. Jeg har begynt på den for deg slik det blir lett å begynne.

9. Test om siden funker ved å gå til localhost

10. Når du vil pushe til github, spør Lars

### Del 2 - Bruk av api

Du har når en lokal versjon av techtube, det består av:

- Mysql Database
- Express API
- NextJS Frontend
- Techtube-cms
- Techtube-admin

For å lese fra databasen, må du bruke API'en

Det står beskrevet hvordan du starter din lokale api i `readme.md` dette skal du allerede ha gjort

I javascript kan man lage requests til en api med `fetch()`

FOR EKSEMPEL:

```javascript
async function getData() {
  return await fetch("/api/artikler");
}

const data = await getData(); // [artikler...]
```

`/api/artikler` er en "endpoint"

En liste av alle enpointene i api'en finner du på `localhost/api/docs`

### Del 3 - Funksjonalitet i techtube-admin

Dette er all funksjonaliteten som trengs

- Administrere alle brukere
  - Se alle brukere, se autoriteten til brukeren
  - Kunne endre autoriteten til brukeren
- Administrere artikler
  - Slette
  - Endre tittel
- Admininistrere temaer og kataloger
  - Lage nye
  - Slette

#### TIPS!

1. Begynn med å kun hente data via api'en, det er lettest

2. Lær deg å lage element i html med javascript <br>
   https://www.javascripttutorial.net/dom/manipulating/create-a-dom-element/

3. Lær deg async await <br>
   https://javascript.info/async-await
