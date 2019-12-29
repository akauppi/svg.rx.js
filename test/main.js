import TestApp from './TestApp.svelte';

const app = new TestApp({
    target: document.body,
    props: {
        name: 'blah'
    }
});

export default app;
