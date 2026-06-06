const { JSDOM } = require('jsdom');
const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf-8');
const script = fs.readFileSync('script.js', 'utf-8');

const virtualConsole = new (require('jsdom').VirtualConsole)();
virtualConsole.sendTo(console);

const dom = new JSDOM(html, { 
    runScripts: 'dangerously',
    virtualConsole
});

dom.window.eval(script);

// trigger DOMContentLoaded
dom.window.document.dispatchEvent(new dom.window.Event('DOMContentLoaded'));

console.log('Test completed.');
