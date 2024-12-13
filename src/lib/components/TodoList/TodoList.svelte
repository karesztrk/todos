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

<t-list active={active ? '' : undefined} class={className}>
	<t-header>
		{@render header?.()}
	</t-header>
	{@render children?.()}
</t-list>

<style>
	t-list {
		height: 100%;
		display: grid;
		grid-template-columns: 1fr;
		grid-auto-rows: var(--max-row-height);
		t-header {
			display: flex;
			justify-content: space-between;
			border-block-end: 1px solid #fff;
		}

		&[active] {
			color: var(--active-color);
		}
	}
</style>
