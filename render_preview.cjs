const React = require('react');
const ReactDOMServer = require('react-dom/server');
const Hero = require('/tmp/hero-bundle.js').default;
const html = ReactDOMServer.renderToStaticMarkup(React.createElement(Hero));
require('fs').writeFileSync('/tmp/hero-render.html', html);
console.log('rendered', html.length, 'chars');
