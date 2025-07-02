# Security Vulnerability Demonstrations

An educational web application that demonstrates three common web security vulnerabilities with both vulnerable and secure implementations.

## 🔍 Vulnerabilities Covered

### 1. **Prototype Pollution**
- **What it is**: A vulnerability that allows attackers to modify the prototype of base objects, affecting all instances
- **Attack Vector**: Malicious JSON input containing `__proto__` keys
- **Impact**: Can lead to DoS, property injection, and in some cases RCE
- **Demo**: Interactive comparison between vulnerable `merge()` and safe `safeMerge()` functions

### 2. **Clickjacking**
- **What it is**: UI redressing attack where users are tricked into clicking on something different from what they perceive
- **Attack Vector**: Embedding vulnerable pages in transparent iframes over decoy content
- **Impact**: Unauthorized actions, credential theft, malware installation
- **Demo**: Simulated banking interface with and without frame protection

### 3. **DOM Clobbering**
- **What it is**: Exploiting the way browsers handle HTML elements to override JavaScript variables
- **Attack Vector**: Injecting HTML elements with specific `id` and `name` attributes to clobber global variables
- **Impact**: Logic bypass, XSS, authentication bypass
- **Demo**: Global variable pollution via injected HTML forms

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd slack-cursor
   ```

2. **Open in browser**
   ```bash
   # Option 1: Simple file serving
   python3 -m http.server 8000
   # Then visit http://localhost:8000
   
   # Option 2: Direct file opening
   open index.html
   ```

3. **Explore the vulnerabilities**
   - Navigate between different vulnerability sections
   - Test the provided payloads
   - Compare vulnerable vs secure implementations

## 📁 Project Structure

```
├── index.html              # Main demonstration page
├── styles.css             # Styling and layout
├── script.js              # Vulnerability implementations
├── vulnerable-page.html   # Clickjacking target page
└── README.md             # This documentation
```

## 🛡️ Security Examples

### Prototype Pollution

**Vulnerable Code:**
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

**Attack Payload:**
```json
{"__proto__": {"polluted": "This prototype was polluted!"}}
```

**Safe Implementation:**
```javascript
function safeMerge(target, source) {
    for (let key in source) {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
            continue; // Skip dangerous keys
        }
        // ... rest of merge logic
    }
    return target;
}
```

### Clickjacking Protection

**Vulnerable Response:**
```
HTTP/1.1 200 OK
Content-Type: text/html
```

**Protected Response:**
```
HTTP/1.1 200 OK
Content-Type: text/html
X-Frame-Options: DENY
Content-Security-Policy: frame-ancestors 'none'
```

### DOM Clobbering

**Vulnerable Code:**
```javascript
function processConfig() {
    if (config && config.apiUrl) {
        fetch(config.apiUrl + '/data')
            .then(response => response.json())
            .then(data => displayData(data));
    }
}
```

**Attack Payload:**
```html
<form id="config">
    <input name="apiUrl" value="https://evil.com">
</form>
```

**Safe Implementation:**
```javascript
const AppConfig = {
    config: null,
    setConfig(newConfig) {
        this.config = newConfig;
    },
    processConfig() {
        if (this.config && typeof this.config.apiUrl === 'string') {
            // Safe processing
        }
    }
};
```

## 🔧 Interactive Features

- **Live Vulnerability Testing**: Execute attacks in real-time
- **Payload Customization**: Modify attack payloads to understand impact
- **Visual Feedback**: Clear indication of successful/failed attacks
- **Code Comparison**: Side-by-side vulnerable vs secure implementations
- **Educational Explanations**: Detailed descriptions of each vulnerability

## 🎯 Learning Objectives

After using this demonstration, you should understand:

1. **Prototype Pollution**
   - How prototype chains work in JavaScript
   - Why input validation is crucial
   - Safe object merging techniques

2. **Clickjacking**
   - The importance of frame protection headers
   - How UI redressing attacks work
   - Browser security policies (CSP)

3. **DOM Clobbering**
   - How HTML elements affect global JavaScript scope
   - The risks of global variable dependency
   - Proper variable scoping and validation

## ⚠️ Security Notice

This project is for **educational purposes only**. The vulnerable implementations should never be used in production environments. Always:

- Validate and sanitize user input
- Use proper security headers
- Implement secure coding practices
- Keep dependencies updated
- Follow security best practices

## 🤝 Contributing

Feel free to contribute additional vulnerability demonstrations, improvements to existing examples, or enhanced documentation.

## 📚 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Prototype Pollution - PortSwigger](https://portswigger.net/web-security/prototype-pollution)
- [Clickjacking - OWASP](https://owasp.org/www-community/attacks/Clickjacking)
- [DOM Clobbering - PortSwigger](https://portswigger.net/web-security/dom-based/dom-clobbering)

---

**⚠️ Disclaimer**: This project contains intentionally vulnerable code for educational purposes. Do not use these examples in production applications.
