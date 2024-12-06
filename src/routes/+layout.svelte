<script lang="ts">
	import Header from './Header.svelte';
	import { Provider } from '$lib/jazz';
	import '../app.css';
	import { PasskeyAuthBasicUI, usePasskeyAuth } from 'jazz-svelte';

	let auth = usePasskeyAuth({ appName: 'todo-app' });

	$inspect(auth.state);

	let { children } = $props();
</script>

<Header />

<main
	style="width: 100vw; height: 100vh; display: flex; align-items: center; justify-content: center;"
>
	<PasskeyAuthBasicUI state={auth.state} />
	{#if auth.current}
		<Provider
			auth={auth.current}
			peer="wss://cloud.jazz.tools/?key=torok.karoly.krisztian@gmail.com"
			storage="indexedDB"
		>
			{@render children?.()}
		</Provider>
	{/if}
</main>

<footer></footer>

<style>
	main,
	footer {
		grid-column: content;
		container: main / inline-size;
	}
</style>
