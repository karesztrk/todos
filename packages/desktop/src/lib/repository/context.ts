import { getContext, setContext } from "svelte";
import TauriStore from "./db";

const key = Symbol("store");

export const getStoreContext = (): TauriStore => getContext(key);

export const setStoreContext = () => {
  setContext(key, new TauriStore());
};
