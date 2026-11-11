// Metro resolves `global.css` through Uniwind; TypeScript needs the module to exist.
// Without this, TS 6 reports TS2882 on the side-effect import in App.tsx.
declare module '*.css';
