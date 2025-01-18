import { getContext, setContext } from 'svelte';
import WebStore from './db';

const key = Symbol('store');

export const getStoreContext = (): WebStore => getContext(key);

export const setStoreContext = () => {
	setContext(key, new WebStore());
};
