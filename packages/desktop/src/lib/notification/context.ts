import { getContext, setContext } from 'svelte';
import TauriNotificationService from './service';

const key = Symbol('notification');

export const getNotificationContext = (): TauriNotificationService => getContext(key);

export const setNotificationContext = () => {
	setContext(key, new TauriNotificationService());
};
