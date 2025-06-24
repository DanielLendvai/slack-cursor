# 🔒 Frontend Encapsulation & Security - Shadow DOM Showcase

An interactive demonstration project showcasing security implications of different frontend encapsulation approaches: Light DOM vs Shadow DOM vs IFrames.

## 🎯 Project Overview

This project provides a comprehensive, live demonstration comparing three different encapsulation methods:

- **🔓 Light DOM**: Traditional DOM structure (vulnerable to external manipulation)
- **🛡️ Shadow DOM**: Encapsulated DOM with style isolation (protected structure)  
- **🏰 IFrame**: Complete security boundary (maximum isolation)

Perfect for educational presentations, security training, and understanding frontend encapsulation concepts.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+ recommended)
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

```bash
# Clone or download the project
git clone <repository-url>
cd shadow-dom-security-showcase

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will open automatically at `http://localhost:3000`

### Alternative Setup (No Node.js)

If you don't have Node.js, you can run this directly in any modern browser:

```bash
# Compile TypeScript (if you have TypeScript installed globally)
tsc

# Or simply open index.html in your browser
# The project includes compiled JavaScript files for convenience
```

## 📁 Project Structure

```
shadow-dom-security-showcase/
├── index.html              # Main HTML entry point
├── src/
│   ├── App.ts              # Main application coordinator
│   ├── NormalInput.ts      # Light DOM component (vulnerable)
│   ├── SecureInput.ts      # Shadow DOM component (protected)
│   └── iframe-example.html # IFrame content (isolated)
├── styles/
│   └── global.css          # Global styles (demonstrates CSS injection)
├── package.json            # Project configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # This file
```

## 🎭 Component Breakdown

### 🔓 Light DOM Component (`NormalInput.ts`)
- **Purpose**: Demonstrates vulnerability to external manipulation
- **Vulnerabilities**: 
  - DOM elements directly accessible via `document.querySelector()`
  - Global CSS can override component styles
  - Event listeners can be hijacked
  - Internal state fully exposed

### 🛡️ Shadow DOM Component (`SecureInput.ts`)  
- **Purpose**: Demonstrates encapsulation and protection
- **Protections**:
  - Internal DOM structure hidden from external access
  - Styles completely isolated and protected
  - Controlled public API with limited methods
  - Events bubble but internal structure remains protected

### 🏰 IFrame Component (`iframe-example.html`)
- **Purpose**: Demonstrates maximum isolation
- **Isolation Features**:
  - Complete security boundary
  - Separate JavaScript execution context
  - Independent styling and DOM
  - Cross-origin capability with sandbox attributes

## 🎯 Attack Playground Features

### Interactive Attack Testing
- **Custom Attack Code**: Write and execute JavaScript attacks in real-time
- **Pre-built Examples**: Ready-to-use attack patterns
- **Results Analysis**: Clear success/failure reporting
- **Live Demonstration**: Perfect for presentations and training

### Available Attack Types

1. **🎯 Value Access Attack**
   - Attempts to read input values from all components
   - Shows which components protect their internal state

2. **🎨 Style Override Attack**  
   - Tries to inject malicious CSS to override component styles
   - Demonstrates style encapsulation differences

3. **👂 Event Hijacking Attack**
   - Attempts to attach event listeners to intercept user input
   - Shows event isolation capabilities

## 🎓 Educational Use

### For Presentations (60 minutes)

**Suggested Flow:**
1. **Introduction** (5 min) - Overview of encapsulation approaches
2. **Light DOM Vulnerabilities** (10 min) - Demonstrate attacks
3. **Shadow DOM Protection** (10 min) - Show encapsulation benefits  
4. **IFrame Isolation** (10 min) - Maximum security demonstration
5. **Comparative Analysis** (15 min) - Side-by-side results
6. **Q&A & Live Coding** (10 min) - Interactive exploration

### Key Teaching Points

- **Shadow DOM ≠ Security**: It's about encapsulation, not security boundaries
- **Same-Origin Limitations**: None of these protect against XSS in same origin
- **Use Case Selection**: Choose the right tool for the right job
- **Defense in Depth**: Always layer security measures

## 🛡️ Security Concepts Explained

### What Shadow DOM Protects Against
✅ External style manipulation  
✅ Direct DOM access from parent page  
✅ Unintended style bleeding  
✅ Component structure inspection  

### What Shadow DOM Does NOT Protect Against
❌ XSS attacks in the same origin  
❌ Event bubbling (events still bubble up)  
❌ Malicious scripts with full page access  
❌ Network-level attacks  

### When to Use Each Approach

**Light DOM**: 
- Simple components
- No encapsulation needed
- Full parent integration required

**Shadow DOM**:
- Component libraries
- Style isolation needed
- Same-origin scenarios
- Performance important

**IFrame**:
- Third-party content
- Maximum security isolation
- Cross-origin scenarios
- Legacy system integration

## 🔧 Customization

### Adding New Attack Examples

```typescript
// In App.ts, add to executePrebuiltAttack method
private executeCustomAttack(): AttackResult[] {
    const results: AttackResult[] = [];
    
    // Your custom attack logic here
    
    return results;
}
```

### Creating New Components

```typescript
// Follow the pattern in NormalInput.ts or SecureInput.ts
export class CustomComponent extends HTMLElement {
    constructor() {
        super();
        // Your component logic
    }
}

customElements.define('custom-component', CustomComponent);
```

## 🌐 Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support  
- **Safari**: Full support
- **Edge**: Full support
- **IE**: Not supported (Shadow DOM not available)

## 📊 Performance Considerations

- **Light DOM**: Fastest rendering, no isolation overhead
- **Shadow DOM**: Slight performance cost for encapsulation
- **IFrame**: Highest resource usage, complete context separation

## 🔍 Development Notes

### TypeScript Configuration
- Target: ES2020
- Module: ES2020
- Strict mode enabled
- Source maps included for debugging

### Styling Approach
- CSS Custom Properties for theming
- Responsive design with CSS Grid
- Visual indicators for security status

## 🤝 Contributing

This project is designed for educational purposes. Contributions welcome:

1. **Additional Attack Examples**: New attack patterns to demonstrate
2. **Enhanced Styling**: Better visual representation of security concepts
3. **Documentation**: Improved explanations or translations
4. **Bug Fixes**: Any issues with the demonstration

## 📚 Additional Resources

- [MDN Shadow DOM Guide](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [Web Components Standards](https://www.webcomponents.org/)
- [IFrame Security Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/iframe#security)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)

## 📄 License

MIT License - Feel free to use this project for educational purposes.

## 🎉 Acknowledgments

Created for frontend security education and training. Perfect for:
- Web development workshops
- Security awareness training  
- University computer science courses
- Conference presentations
- Team technical discussions

---

**Ready to explore frontend security?** Start the application and try the attack examples! 🚀
