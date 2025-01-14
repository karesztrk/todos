<script lang="ts">
  import Header from "@todotrk/web/components/Header";
  import "@todotrk/web/style/app.css";
  import "@todotrk/web/style/fonts.css";

  let { children } = $props();
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
