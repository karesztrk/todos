<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Props {
		someday?: boolean;
		weekend?: boolean;
		active?: boolean;
		children: Snippet;
		header: Snippet;
	}

	const { someday, weekend, active, children, header }: Props = $props();
</script>

<t-list
	someday={someday ? '' : undefined}
	weekend={weekend ? '' : undefined}
	active={active ? '' : undefined}
>
	<t-header>
		{@render header?.()}
	</t-header>
	{@render children?.()}
</t-list>

<style>
	t-list {
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: var(--max-row-height);
		grid-row: 1 / span 2;
		background: repeating-linear-gradient(
			transparent 0 calc(var(--max-row-height) - 1px),
			rgba(255, 255, 255, 0.25) calc(var(--max-row-height) - 1px) var(--max-row-height)
		);
		t-header {
			display: flex;
			justify-content: space-between;
			border-block-end: 1px solid #fff;
		}

		&[weekend] {
			grid-row: span 1;
		}

		&[active] {
			color: var(--active-color);
		}

		&[someday] {
			grid-column: span 2;
			grid-row: 3 / span 1;
		}
	}
</style>
