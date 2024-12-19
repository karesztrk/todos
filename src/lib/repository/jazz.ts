import { createJazzApp } from 'jazz-svelte';
import { MyAccount } from './schema';

export const { Provider, useCoState, useAccount, useAccountOrGuest } = createJazzApp({
	AccountSchema: MyAccount
});
