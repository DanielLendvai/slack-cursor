# 🔐 Webes Biztonsági Sebezhetőségek
## Prezentációs Segédlet

### 📋 Bemutató Áttekintés
**Időtartam:** 45-60 perc  
**Célközönség:** Fejlesztők, biztonsági szakemberek, IT hallgatók  
**Formátum:** Interaktív bemutató gyakorlati példákkal

---

## 📊 1. DIA - Címlap

### **Webes Biztonsági Sebezhetőségek**
#### *Prototype Pollution, Clickjacking és DOM Clobbering*

**Előadó:** [Név]  
**Dátum:** [Dátum]  
**Helyszín:** [Helyszín]

**Célok:**
- Megérteni a gyakori webes sebezhetőségeket
- Megtanulni az azonosítási módszereket
- Elsajátítani a védekezési technikákat

---

## 📊 2. DIA - Napirend

### **Mit fogunk ma megtanulni?**

1. **🧬 Prototype Pollution** (15 perc)
   - Mi ez és hogyan működik?
   - Gyakorlati támadás bemutatása
   - Védekezési módszerek

2. **🎭 Clickjacking** (15 perc)
   - UI Redressing támadások
   - Valós példák és szimuláció
   - HTTP fejlécek védelme

3. **🌐 DOM Clobbering** (15 perc)
   - Globális változók felülírása
   - HTML injection kihasználása
   - Biztonságos programozási gyakorlatok

4. **🔧 Gyakorlati bemutató** (10 perc)
5. **❓ Kérdések és válaszok** (5 perc)

---

## 📊 3. DIA - Bevezetés

### **Miért fontosak ezek a sebezhetőségek?**

#### **Statisztikák:**
- A webes támadások **85%-a** kliens oldali sebezhetőségeket használ
- **OWASP Top 10** rendszeresen tartalmazza ezeket
- Átlagosan **$4.24 millió** egy adatvédelmi incidens költsége

#### **Valós következmények:**
- Adatlopás és személyes információk megszerzése
- Felhasználói fiókok átvétele
- Pénzügyi károk és reputációs veszteségek
- Jogi következmények (GDPR, stb.)

---

## 📊 4. DIA - Prototype Pollution Bevezető

### **🧬 Prototype Pollution**

#### **Mi ez?**
A JavaScript prototype lánc módosítása, amely minden objektumot érint

#### **Hogyan működik?**
```javascript
// Minden JavaScript objektum örökli Object.prototype-t
const obj = {};
console.log(obj.toString); // [Function: toString]

// Ha módosítjuk a prototype-t...
Object.prototype.hacked = true;
console.log(obj.hacked); // true - Minden objektum érintett!
```

#### **Miért veszélyes?**
- **Globális hatás:** Minden új objektum érintett
- **Logikai bypass:** Feltételek megkerülése
- **DoS támadások:** Alkalmazás összeomlása
- **RCE lehetőség:** Szerencsés esetekben kód futtatás

---

## 📊 5. DIA - Prototype Pollution Támadás

### **Gyakorlati Támadás Bemutatása**

#### **Sebezhetős kód:**
```javascript
function merge(target, source) {
    for (let key in source) {
        if (typeof source[key] === 'object' && source[key] !== null) {
            if (!target[key]) target[key] = {};
            merge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}
```

#### **Támadó payload:**
```json
{
    "__proto__": {
        "isAdmin": true,
        "polluted": "Sikeres támadás!"
    }
}
```

#### **Eredmény:**
```javascript
const user = {};
console.log(user.isAdmin); // true - Mindenki admin lett!
```

**💡 Élő bemutató:** [Demo futtatása a projektben]

---

## 📊 6. DIA - Prototype Pollution Védelem

### **Hogyan védekezhetünk?**

#### **1. Input validáció és szűrés:**
```javascript
function safeMerge(target, source) {
    for (let key in source) {
        // Veszélyes kulcsok kiszűrése
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            continue;
        }
        // ... biztonságos merge logika
    }
}
```

#### **2. JSON.parse revivers használata:**
```javascript
JSON.parse(input, (key, value) => {
    if (key === '__proto__') return undefined;
    return value;
});
```

#### **3. Object.create(null) használata:**
```javascript
const safeObject = Object.create(null); // Nincs prototype
```

#### **4. Könyvtárak használata:**
- `lodash.merge` helyett `lodash.mergeWith`
- `just-safe-get` és hasonló safe könyvtárak

---

## 📊 7. DIA - Clickjacking Bevezető

### **🎭 Clickjacking (UI Redressing)**

#### **Mi ez?**
A felhasználót megtévesztő támadás, ahol nem azt kattintja, amit gondol

#### **Hogyan működik?**
1. **Legitim oldal beágyazása** láthatatlan iframe-be
2. **Csaló tartalom** elhelyezése felülre
3. **Felhasználó megtévesztése** - azt gondolja másra kattint
4. **Valós művelet végrehajtása** a háttérben

#### **Példa szcenárió:**
- Felhasználó egy "Játék indítása" gombra kattint
- Valójában egy "1000$ átutalás" gombra kattint
- A háttérben futó banki alkalmazásban történik a művelet

#### **Típusai:**
- **Klasszikus clickjacking**
- **Likejacking** (social media)
- **Cursorjacking**
- **Drag & drop támadások**

---

## 📊 8. DIA - Clickjacking Támadás

### **Gyakorlati Támadás Bemutatása**

#### **Támadó oldal HTML-je:**
```html
<div class="fake-game">
    <h2>🎮 Új Játék!</h2>
    <p>Kattints a gombra a játék indításához!</p>
    
    <!-- Felhasználó ezt látja -->
    <button class="fake-button">Játék Indítása</button>
    
    <!-- Ez van a háttérben (láthatatlan) -->
    <iframe src="https://bank.com/transfer" 
            style="position: absolute; top: 0; left: 0; 
                   opacity: 0; z-index: 999;">
    </iframe>
</div>
```

#### **CSS trükk:**
```css
.fake-button {
    position: relative;
    z-index: 1;
}

iframe {
    position: absolute;
    top: 50px; /* A banki gomb pozíciója */
    left: 100px;
    opacity: 0; /* Láthatatlan */
    z-index: 999; /* Legfelül */
}
```

**💡 Élő bemutató:** [Clickjacking szimuláció futtatása]

---

## 📊 9. DIA - Clickjacking Védelem

### **Védekezési módszerek**

#### **1. X-Frame-Options HTTP fejléc:**
```http
X-Frame-Options: DENY
# vagy
X-Frame-Options: SAMEORIGIN
# vagy
X-Frame-Options: ALLOW-FROM https://trusted-site.com
```

#### **2. Content Security Policy (CSP):**
```http
Content-Security-Policy: frame-ancestors 'none'
# vagy
Content-Security-Policy: frame-ancestors 'self'
# vagy
Content-Security-Policy: frame-ancestors https://trusted-site.com
```

#### **3. JavaScript framebusting:**
```javascript
// Régi módszer (nem teljesen megbízható)
if (window.top !== window.self) {
    window.top.location = window.self.location;
}
```

#### **4. Server-side implementáció (Express.js):**
```javascript
app.use((req, res, next) => {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Content-Security-Policy', "frame-ancestors 'none'");
    next();
});
```

---

## 📊 10. DIA - DOM Clobbering Bevezető

### **🌐 DOM Clobbering**

#### **Mi ez?**
HTML elemek használata JavaScript globális változók felülírására

#### **Hogyan működik?**
A böngészők automatikusan létrehoznak globális változókat bizonyos HTML elemekből:

```html
<!-- Ez létrehoz egy 'myForm' globális változót -->
<form id="myForm">
    <input name="apiUrl" value="https://evil.com">
</form>
```

```javascript
// A JavaScript kód ezt várja:
if (config && config.apiUrl) {
    fetch(config.apiUrl + '/data'); // evil.com-ra megy!
}
```

#### **Érintett HTML elemek:**
- `<form id="name">`
- `<img id="name">`
- `<embed id="name">`
- `<object id="name">`
- Elemek `name` attribútummal

---

## 📊 11. DIA - DOM Clobbering Támadás

### **Gyakorlati Támadás Bemutatása**

#### **Sebezhetős alkalmazás kód:**
```javascript
// Az alkalmazás ezt várja:
const API_CONFIG = {
    apiUrl: 'https://legitimate-api.com'
};

function loadData() {
    // Veszélyes: globális 'config' használata
    if (config && config.apiUrl) {
        fetch(config.apiUrl + '/sensitive-data')
            .then(response => response.json())
            .then(data => displayUserData(data));
    }
}
```

#### **Támadó HTML injection:**
```html
<!-- XSS vagy content injection útján bekerülő HTML -->
<form id="config">
    <input name="apiUrl" value="https://attacker.com">
</form>
```

#### **Eredmény:**
```javascript
console.log(config); // HTMLFormElement
console.log(config.apiUrl); // "https://attacker.com"
// Az API hívás a támadó szerverére megy!
```

**💡 Élő bemutató:** [DOM Clobbering szimuláció]

---

## 📊 12. DIA - DOM Clobbering Védelem

### **Védekezési stratégiák**

#### **1. Explicit változó deklaráció:**
```javascript
// Rossz:
if (config && config.apiUrl) { ... }

// Jó:
const CONFIG = {
    apiUrl: 'https://legitimate-api.com'
};
if (CONFIG && CONFIG.apiUrl) { ... }
```

#### **2. Namespace használata:**
```javascript
const MyApp = {
    config: {
        apiUrl: 'https://legitimate-api.com'
    },
    
    loadData() {
        if (this.config && this.config.apiUrl) {
            // Biztonságos
        }
    }
};
```

#### **3. Strict változó ellenőrzés:**
```javascript
function isValidConfig(config) {
    return config && 
           typeof config === 'object' &&
           config.constructor === Object &&
           typeof config.apiUrl === 'string';
}
```

#### **4. CSP használata:**
```http
Content-Security-Policy: default-src 'self'
```

---

## 📊 13. DIA - Gyakorlati Bemutató

### **🔧 Élő Demó Futtatása**

#### **Bemutató lépések:**
1. **Projekt indítása:**
   ```bash
   npm start
   # http://localhost:3000
   ```

2. **Prototype Pollution tesztelése:**
   - Payload módosítása
   - Támadás végrehajtása
   - Biztonságos verzió tesztelése

3. **Clickjacking demonstráció:**
   - Sebezhetős oldal bemutatása
   - Védett oldal összehasonlítása
   - Fejléc vizsgálata fejlesztői eszközökkel

4. **DOM Clobbering kipróbálása:**
   - HTML injektálás
   - Globális változó felülírás
   - Biztonságos implementáció

#### **Közönség bevonása:**
- Kérdések a demó során
- Saját payload kipróbálása
- Védelem hatékonyságának tesztelése

---

## 📊 14. DIA - Összehasonlító Táblázat

### **Sebezhetőségek Összehasonlítása**

| Aspektus | Prototype Pollution | Clickjacking | DOM Clobbering |
|----------|-------------------|--------------|----------------|
| **Típus** | Logic/Data | UI/Social | Logic/Data |
| **Vektor** | JSON/Object merge | iframe overlay | HTML injection |
| **Hatás** | Globális objektum módosítás | Felhasználó megtévesztése | Változó felülírás |
| **Súlyosság** | Magas | Közepes-Magas | Közepes |
| **Detektálás** | Nehéz | Közepes | Közepes |
| **Védelem** | Input validáció | HTTP headers | Namespace, validáció |
| **Automatizálhatóság** | Igen | Részben | Igen |

### **Gyakoriság rangsor:**
1. **Clickjacking** - Nagyon gyakori
2. **DOM Clobbering** - Gyakori
3. **Prototype Pollution** - Növekvő tendencia

---

## 📊 15. DIA - Legjobb Gyakorlatok

### **🛡️ Általános Biztonsági Alapelvek**

#### **Defense in Depth (Védelem mélységben):**
1. **Input validáció** minden szinten
2. **Output encoding** megfelelő kontextusban
3. **HTTP biztonsági fejlécek** használata
4. **Content Security Policy** implementálása
5. **Regular security testing** automatizált eszközökkel

#### **Secure Coding Guidelines:**
```javascript
// 1. Mindig validáld az inputot
function validateInput(data) {
    if (!data || typeof data !== 'object') {
        throw new Error('Invalid input');
    }
    // További validációk...
}

// 2. Használj namespace-eket
const App = {
    config: { /* safe config */ },
    utils: { /* utility functions */ }
};

// 3. Kerüld a globális változókat
(function() {
    'use strict';
    // Your code here
})();
```

#### **Testing eszközök:**
- **Static Analysis:** ESLint, SonarQube
- **Dynamic Testing:** OWASP ZAP, Burp Suite
- **Dependency Scanning:** npm audit, Snyk

---

## 📊 16. DIA - Ellenőrző Lista

### **✅ Biztonsági Checklist Fejlesztőknek**

#### **Prototype Pollution elleni védelem:**
- [ ] Input validáció minden merge műveletnél
- [ ] `__proto__`, `constructor`, `prototype` kulcsok szűrése
- [ ] Biztonságos könyvtárak használata
- [ ] JSON.parse reviver függvények alkalmazása

#### **Clickjacking elleni védelem:**
- [ ] X-Frame-Options fejléc beállítása
- [ ] Content-Security-Policy frame-ancestors direktíva
- [ ] Kritikus műveletek második hitelesítése
- [ ] Felhasználói tájékoztatás gyanús aktivitásról

#### **DOM Clobbering elleni védelem:**
- [ ] Globális változók kerülése
- [ ] Explicit változó deklarációk
- [ ] Namespace-ek használata
- [ ] typeof ellenőrzések objektumoknál

#### **Általános:**
- [ ] Regular security audit
- [ ] Dependency updates
- [ ] Security headers implementation
- [ ] User education

---

## 📊 17. DIA - Eszközök és Források

### **🔧 Hasznos Eszközök**

#### **Teszteléshez:**
- **OWASP ZAP** - Ingyenes security scanner
- **Burp Suite** - Professional web security testing
- **DOM Invader** - Browser extension DOM seb. teszteléshez
- **Security Headers** - https://securityheaders.com/

#### **Fejlesztéshez:**
- **ESLint Security Plugin** - Static analysis
- **Helmet.js** - Express.js security headers
- **DOMPurify** - XSS protection library
- **validator.js** - Input validation

#### **Tanuláshoz:**
- **OWASP WebGoat** - Vulnerable web application
- **Damn Vulnerable Web Application (DVWA)**
- **PortSwigger Web Security Academy**
- **HackerOne Hactivity** - Real-world examples

#### **Dokumentáció:**
- OWASP Testing Guide
- Mozilla Web Security Guidelines
- CWE (Common Weakness Enumeration)

---

## 📊 18. DIA - Következő lépések

### **🎯 Mit tegyek a prezentáció után?**

#### **Azonnali teendők:**
1. **Audit saját alkalmazásaidat** ezekre a sebezhetőségekre
2. **Implementáld a biztonsági fejléceket** minden projektedben
3. **Frissítsd a dependencies-t** és kapcsold be az audit-ot
4. **Tegyél hozzá security teszteket** a CI/CD pipeline-hoz

#### **Hosszú távú célok:**
1. **Security training** csapatnak szervezése
2. **Bug bounty program** indítása
3. **Incident response plan** kidolgozása
4. **Regular penetration testing** ütemezése

#### **Tanulási útvonal:**
1. OWASP Top 10 mélyebb megismerése
2. Web security sertifikációk megszerzése
3. Security konferenciák látogatása
4. Security community-khez csatlakozás

#### **Mérési mutatók:**
- Sebezhetőségek száma csökkenése
- Incident response time javulása
- Security awareness növekedése
- Compliance követelmények teljesítése

---

## 📊 19. DIA - Kérdések és Válaszok

### **❓ Gyakran Ismételt Kérdések**

#### **K: Melyik sebezhetőség a legveszélyesebb?**
**V:** Kontextusfüggő, de Prototype Pollution általában a legnagyobb hatású, míg Clickjacking a leggyakoribb.

#### **K: Lehet-e automatizálni ezeket a támadásokat?**
**V:** Igen, mindhárom automatizálható és gyakran használják mass scanning-ben.

#### **K: Mennyire költséges a védelem implementálása?**
**V:** Viszonylag olcsó - főleg fejlesztési best practice-ek és HTTP fejlécek.

#### **K: Hogyan tájékoztassam a csapatomat?**
**V:** Regular security training, code review, és hands-on workshop-ok.

#### **K: Mikor kell security audit-ot csinálni?**
**V:** Minimum évente, vagy major release-ek előtt.

### **Nyitott kérdések a közönségnek:**
- Van-e tapasztalat hasonló támadásokkal?
- Milyen biztonsági eszközöket használtok már?
- Melyik része volt a legmeglepőbb?

---

## 📊 20. DIA - Összefoglalás és Zárás

### **🎯 Mit tanultunk ma?**

#### **Kulcs üzenetek:**
1. **A webes biztonsági sebezhetőségek valósak** és széles körben elterjedtek
2. **Minden fejlesztő felelőssége** a biztonságos kód írása
3. **A védelem nem bonyolult**, de következetességet igényel
4. **Folyamatos tanulás szükséges** a fejlődő fenyegetések miatt

#### **Gyakorlati tanulságok:**
- Input validáció minden szinten kötelező
- HTTP biztonsági fejlécek alapvető követelmények
- Code review-ban szerepeljenek security szempontok
- Testing automatizálása security eszközökkel

#### **Következő lépések:**
1. **Azonnal:** Security headers implementálása
2. **1 héten belül:** Saját projektek auditálása
3. **1 hónapon belül:** Csapat training szervezése
4. **Folyamatosan:** Security best practices követése

### **Kapcsolattartás:**
**Email:** [email]  
**LinkedIn:** [profil]  
**GitHub:** [repository link]

### **Köszönöm a figyelmet!** 
**Kérdések?** 🙋‍♂️🙋‍♀️

---

## 📋 Prezentációs Tippek az Előadónak

### **🎤 Előadási Technikák**

#### **Időbeosztás (60 perces verzió):**
- Bevezető: 5 perc
- Prototype Pollution: 15 perc
- Clickjacking: 15 perc  
- DOM Clobbering: 15 perc
- Élő demó: 7 perc
- Q&A: 3 perc

#### **Interaktivitás:**
- Polls/szavazás minden szekcióban
- "Kéz fel" kérdések
- Közönség saját payload kipróbálása
- Valós tapasztalatok megosztása

#### **Technikai előkészületek:**
- Demo környezet tesztelése
- Backup slides készítése
- Internet kapcsolat biztosítása
- Screen sharing beállítása

#### **Backup tervek:**
- Demo nem működik → screenshotok használata
- Időhiány → rövidített verzió készítése
- Technikai probléma → offline content

### **🎯 Célközönség Adaptáció**

#### **Fejlesztők számára:**
- Több kód példa
- Deep dive technikai részletek
- Best practices kiemelése
- Code review checklist

#### **Management számára:**
- Business impact hangsúlyozása
- ROI kalkuláció
- Compliance aspektusok
- Risk management

#### **Biztonsági szakemberek számára:**
- Advanced attack vectors
- Forensics és detection
- Threat modeling
- Red teaming scenarios

---

## 📚 Kiegészítő Anyagok

### **Ajánlott Irodalom**
1. **OWASP Testing Guide v4.0**
2. **Web Application Hacker's Handbook**
3. **Tangled Web: A Guide to Securing Modern Web Applications**
4. **JavaScript: The Good Parts** (security perspective)

### **Online Kurzusok**
1. **PortSwigger Web Security Academy** (ingyenes)
2. **Coursera: Cybersecurity Specialization**
3. **Udemy: Web Application Security**
4. **SANS Web Application Security**

### **Gyakorlati Platformok**
1. **HackTheBox**
2. **TryHackMe**
3. **WebGoat**
4. **Juice Shop**

---

*📝 Ez a prezentációs segédlet szabadon módosítható és testre szabható az előadó igényei szerint.*