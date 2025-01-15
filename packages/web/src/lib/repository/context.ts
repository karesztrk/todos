import { getContext, setContext } from 'svelte';
import Store from './db';

const key = Symbol('store');

export const getStoreContext = (): Store => getContext(key);

export const setStoreContext = () => {
	setContext(key, new Store());
};
