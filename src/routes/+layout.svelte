<script lang="ts">
	import Header from './Header.svelte';
	import '../app.css';
	import '../fonts.css';
	import { Provider, useAccountOrGuest } from '$lib/repository/jazz';
	import {
		Account,
		ephemeralCredentialsAuth,
		fixedCredentialsAuth,
		type AuthMethod,
		type ID
	} from 'jazz-tools';
	import { PasskeyAuthBasicUI } from 'jazz-svelte';
	import { BrowserDemoAuth } from 'jazz-browser';

	const accountID = 'co_z5cGh@example.com' as ID<Account>;

	const auth = fixedCredentialsAuth({
		accountID,
		secret: 'demo'
	});
	let peer = 'wss://cloud.jazz.tools/?key=torok.karoly.krisztian@gmail.com' as const;
	let { children } = $props();
</script>

<Header />

<main>
	<Provider {auth} {peer}>
		{@render children()}
	</Provider>
</main>

<footer></footer>

<style>
	main,
	footer {
		grid-column: content;
		container: main / inline-size;
	}
</style>
