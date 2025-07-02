# 🔧 Gyakorlati Útmutató
## Biztonsági Sebezhetőségek Tesztelése és Védelme

### 📋 Gyors Referencia

---

## 🚀 Projekt Indítási Útmutató

### **Előfeltételek**
```bash
# Node.js telepítése (14.0.0 vagy újabb)
node --version
npm --version

# Git telepítése
git --version
```

### **Projekt Indítása**
```bash
# 1. Dependenciák telepítése
npm install

# 2. Szerver indítása
npm start

# 3. Böngésző megnyitása
http://localhost:3000
```

### **Alternatív Indítási Módok**
```bash
# Python szerverrel (ha nincs Node.js)
python3 -m http.server 8000
# Ezután: http://localhost:8000

# Vagy egyszerűen fájl megnyitás
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

---

## 🧬 Prototype Pollution - Gyakorlati Tesztelés

### **Alapvető Teszt Payloadok**

#### **1. Egyszerű Pollution**
```json
{"__proto__": {"polluted": true}}
```

#### **2. Admin Privilege Escalation**
```json
{"__proto__": {"isAdmin": true, "role": "admin"}}
```

#### **3. Konstruktor Pollution**
```json
{"constructor": {"prototype": {"hacked": "yes"}}}
```

#### **4. Mély Objektum Pollution**
```json
{
  "__proto__": {
    "toString": "function(){return 'hacked'}",
    "valueOf": "function(){return 999}"
  }
}
```

### **Tesztelési Lépések**
1. **Nyisd meg a demót:** `http://localhost:3000`
2. **Kattints a "Prototype Pollution" fülre**
3. **Másold be az egyik payloadot**
4. **Kattints "Execute Payload"**
5. **Figyeld meg az eredményt**
6. **Próbáld ki a biztonságos verziót is**

### **Mit Nézel?**
- **Előtte:** `({}).polluted = undefined`
- **Utána:** `({}).polluted = true` ← **Sikeres támadás!**

### **Védelem Tesztelése**
```javascript
// Teszteld le a safe merge funkcióval
// Eredmény: "SAFE MERGE SUCCESSFUL!" üzenet
```

---

## 🎭 Clickjacking - Gyakorlati Demonstráció

### **Tesztelési Lépések**

#### **1. Sebezhetős Oldal Tesztelése**
```bash
# Nyisd meg külön ablakban
http://localhost:3000/vulnerable-page.html
```

#### **2. Fejlécek Ellenőrzése**
```bash
# Developer Tools (F12) → Network → Reload
# Keress rá: Response Headers
# Hiányzik: X-Frame-Options, CSP
```

#### **3. Clickjacking Szimuláció**
1. **Kattints "Create Clickjacking Attack"**
2. **Figyeld meg a piros keretes iframe-et**
3. **5 másodperc után automatikusan visszaáll**

#### **4. Védett Oldal Tesztelése**
```bash
# Nyisd meg
http://localhost:3000/protected-page.html
```

### **Védelmi Fejlécek Ellenőrzése**
```bash
# curl paranccsal
curl -I http://localhost:3000/protected-page.html

# Várható válasz:
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'
```

### **Valós Tesztelés Böngészőben**
```html
<!-- Próbáld ki ezt egy külön HTML fájlban -->
<iframe src="http://localhost:3000/vulnerable-page.html"></iframe>
<!-- Ez működni fog -->

<iframe src="http://localhost:3000/protected-page.html"></iframe>
<!-- Ez blokkolva lesz -->
```

---

## 🌐 DOM Clobbering - Gyakorlati Tesztelés

### **Alapvető Teszt Payloadok**

#### **1. Form Alapú Clobbering**
```html
<form id="config">
    <input name="apiUrl" value="https://evil.com">
</form>
```

#### **2. Image Alapú Clobbering**
```html
<img id="config" name="apiUrl" src="https://evil.com">
```

#### **3. Nested Clobbering**
```html
<form id="config">
    <input name="apiUrl" value="https://evil.com">
    <input name="timeout" value="0">
    <input name="debug" value="true">
</form>
```

#### **4. Komplex Clobbering**
```html
<form id="window">
    <input name="location" value="https://evil.com">
</form>
```

### **Tesztelési Folyamat**
1. **Másold be a HTML payloadot**
2. **Kattints "Inject HTML"**
3. **Nézd meg az injektált tartalmat**
4. **Kattints "Process Config"**
5. **Figyeld meg a DOM clobbering eredményét**

### **Konzol Tesztelés**
```javascript
// A demó futtatása után próbáld ki ezeket:
console.log(typeof window.config);     // object (HTMLFormElement)
console.log(config.constructor.name);  // HTMLFormElement
console.log(config.apiUrl);            // "https://evil.com"
```

### **Biztonságos Verzió Tesztelése**
1. **JSON konfigurációt adj meg**
2. **Kattints "Set Safe Config"**
3. **Kattints "Process Safe Config"**
4. **Eredmény: Biztonságos működés**

---

## ✅ Ellenőrző Listák

### **Pre-Demo Checklist (Előadó számára)**

#### **Technikai Előkészületek**
- [ ] Node.js telepítve és működik
- [ ] Projekt letöltve és függőségek telepítve
- [ ] Server sikeresen indul (`npm start`)
- [ ] Minden demó működik böngészőben
- [ ] Internet kapcsolat stabil
- [ ] Backup terv készen áll (screenshotok)

#### **Prezentációs Környezet**
- [ ] Második monitor vagy projektor tesztelve
- [ ] Böngésző zoom optimalizálva (125% ajánlott)
- [ ] Developer Tools előkészítve (F12)
- [ ] Szükséges lapok megnyitva és könyvjelzőzve
- [ ] Prezentációs segédlet kinyomtatva

### **Live Demo Checklist**

#### **Prototype Pollution Demo**
- [ ] Alapértelmezett payload látható
- [ ] "Execute Payload" kattintás
- [ ] Eredmény magyarázata
- [ ] Safe verzió bemutatása
- [ ] Konzol ellenőrzés (`({}).polluted`)

#### **Clickjacking Demo**
- [ ] Vulnerable page megnyitása
- [ ] Fejlécek hiányának bemutatása
- [ ] Clickjacking attack szimuláció
- [ ] Protected page összehasonlítás
- [ ] Developer Tools network vizsgálat

#### **DOM Clobbering Demo**
- [ ] HTML payload injektálás
- [ ] Konzol vizsgálat (`typeof config`)
- [ ] Process Config végrehajtás
- [ ] Safe config beállítás
- [ ] Biztonságos verzió tesztelés

### **Post-Demo Checklist**
- [ ] Minden demo ablak bezárása
- [ ] Server leállítása
- [ ] Kérdések megválaszolása
- [ ] Kapcsolattartási információk megosztása
- [ ] Follow-up anyagok küldése

---

## 🔍 Hibakeresési Útmutató

### **Gyakori Problémák és Megoldások**

#### **Server nem indul**
```bash
# Hiba: Port már használatban
ERROR: Port 3000 already in use

# Megoldás 1: Másik port használata
PORT=3001 npm start

# Megoldás 2: Futó process megkeresése és leállítása
lsof -ti:3000 | xargs kill -9
# vagy Windows-on
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F
```

#### **Demó nem működik**
```bash
# 1. Cache tisztítás
Ctrl+Shift+R  # Hard reload

# 2. Konzol ellenőrzés
F12 → Console → Hibaüzenetek keresése

# 3. JavaScript engedélyezés ellenőrzése
# Biztos, hogy engedélyezve van a JS?
```

#### **Clickjacking iframe nem látszik**
```css
/* CSS debug - tegyél be ideiglenesen */
.hidden-iframe {
    opacity: 1 !important;  /* Láthatóvá tétel */
    border: 5px solid red !important;
}
```

#### **DOM Clobbering nem működik**
```javascript
// Konzolban ellenőrizd:
console.log('config' in window);        // true kell legyen
console.log(typeof window.config);      // "object" kell legyen
console.log(config.constructor.name);   // "HTMLFormElement"
```

---

## 📊 Prezentációs Tippek

### **Időzítés és Ütemezés**

#### **60 perces verzió:**
- **Bevezetés:** 5 perc
- **Prototype Pollution:** 15 perc (5 elmélet + 10 demo)
- **Clickjacking:** 15 perc (5 elmélet + 10 demo)
- **DOM Clobbering:** 15 perc (5 elmélet + 10 demo)
- **Összefoglalás:** 5 perc
- **Q&A:** 5 perc

#### **30 perces verzió:**
- **Bevezetés:** 2 perc
- **Mind a 3 sebezhetőség:** 7-7 perc (3 elmélet + 4 demo)
- **Összefoglalás:** 2 perc
- **Q&A:** 3 perc

### **Interaktív Elemek**

#### **Kérdések a közönségnek:**
- "Ki találkozott már ezekkel a sebezhetőségekkel?"
- "Melyik biztonsági eszközöket használjátok?"
- "Milyen gyakran csináltok security audit-ot?"

#### **Hands-on részek:**
- Közönség próbálhatja ki a payloadokat
- Saját példák bemutatása
- Valós projektek megbeszélése

### **Technikai Prezentációs Tippek**

#### **Képernyő Beállítások:**
```bash
# Böngésző zoom: 125-150%
# Terminál font: 16-18pt
# Kódszerkesztő font: 14-16pt
```

#### **Backup Tervek:**
1. **Screenshots minden demóról**
2. **Offline HTML verzió**
3. **Videó felvételek a demókról**
4. **PDF export a kódokról**

---

## 🎯 Célközönség Specifikus Kiegészítések

### **Fejlesztőknek**

#### **Code Review Checklist:**
```javascript
// Mit keressünk code review-ban?

// 1. Prototype Pollution
function merge(target, source) {
    // ❌ Veszélyes - nincs kulcs validáció
    // ✅ Biztonságos - van __proto__ szűrés
}

// 2. Globális változó használat
if (config && config.apiUrl) {
    // ❌ Veszélyes - globális config
    // ✅ Biztonságos - explicit konfig
}

// 3. Frame védelmi fejlécek
// ❌ Hiányzó X-Frame-Options
// ✅ Van X-Frame-Options és CSP
```

### **Biztonsági Szakembereknek**

#### **Penetration Testing Checklist:**
- [ ] **Prototype Pollution:** JSON endpoint tesztelés
- [ ] **Clickjacking:** Frame-opciók ellenőrzése
- [ ] **DOM Clobbering:** HTML injection pontok
- [ ] **Automated scanning:** OWASP ZAP, Burp Suite
- [ ] **Manual testing:** Browser Developer Tools

### **Managementnek**

#### **Business Impact Kalkulátor:**
```
Átlagos incidens költség: $4.24M
Risk reduction: 85%
Implementation cost: $50K
ROI: 85x visszatérülés
```

---

## 📚 További Források

### **Azonnali Implementáció**

#### **Express.js Security Headers:**
```javascript
const helmet = require('helmet');
app.use(helmet({
    frameguard: { action: 'deny' },
    contentSecurityPolicy: {
        directives: {
            frameAncestors: ["'none'"]
        }
    }
}));
```

#### **Input Validation Template:**
```javascript
const safeKeys = ['name', 'email', 'message'];
function validateInput(obj) {
    const safe = {};
    for (const key of safeKeys) {
        if (obj.hasOwnProperty(key)) {
            safe[key] = obj[key];
        }
    }
    return safe;
}
```

### **Monitoring és Alerting**
```javascript
// Prototype pollution detection
Object.defineProperty(Object.prototype, 'polluted', {
    set: function(value) {
        console.warn('Prototype pollution detected!');
        // Alert security team
    }
});
```

---

*💡 Ez a gyakorlati útmutató folyamatosan frissíthető a tapasztalatok alapján.*