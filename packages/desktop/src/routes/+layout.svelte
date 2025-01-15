<script lang="ts">
  import Header from "@todotrk/web/components/Header";
  import { setStoreContext } from "$lib/repository/context";
  import "@todotrk/web/style/app.css";
  import "@todotrk/web/style/fonts.css";

  let { children } = $props();
  setStoreContext();
</script>

<Header />

<main>
  {@render children()}
</main>

<footer></footer>

<style>
  main,
  footer {
    grid-column: content;
    container: main / inline-size;
  }
</style>
