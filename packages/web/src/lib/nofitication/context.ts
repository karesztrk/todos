import { getContext, setContext } from 'svelte';
import WebNotificationService from './service';

const key = Symbol('notification');

export const getNotificationContext = (): WebNotificationService => getContext(key);

export const setNotificationContext = () => {
	setContext(key, new WebNotificationService());
};
