import App from './App.svelte';

// DEBUG
import assert from 'assert';
console.log("assert:"+ assert);

const app = new App({
    target: document.body,
    props: {
        name: 'blah'
    }
});

export default app;
