<script lang="ts">
	import polyfill from '@oddbird/css-anchor-positioning/fn';

	if (!('anchorName' in document.documentElement.style)) {
		polyfill();
	}
</script>

<footer></footer>

<style>
	footer {
		grid-column: content;
		container: footer / inline-size;
	}
</style>
