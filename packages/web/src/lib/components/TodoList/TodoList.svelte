<script lang="ts">
	import type { Snippet } from 'svelte';
	interface Props {
		active?: boolean;
		children: Snippet;
		header: Snippet;
		class?: string;
	}

	const { active, children, header, class: className }: Props = $props();
</script>

<t-list active={active ? '' : undefined} class={className} role="list">
	<t-header>
		{@render header?.()}
	</t-header>
	{@render children?.()}
</t-list>

<style>
	t-list {
		min-block-size: calc(var(--row-height) * 5);
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: var(--row-height);

		&[active] {
			t-header {
				color: var(--color-text-highlighted);
			}
		}

		t-header {
			display: flex;
			justify-content: space-between;
			border-block-end: 1px solid var(--color-border);
			font-size: 1.25rem;
		}
	}
</style>
