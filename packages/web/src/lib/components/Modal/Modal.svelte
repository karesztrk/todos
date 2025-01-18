<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		show?: boolean;
		children: Snippet;
		actions?: Snippet;
		onClose?: (e: Event) => void;
	}

	let { show = $bindable(), children, actions, onClose: onCloseProp }: Props = $props();

	let dialog = $state<HTMLDialogElement>();

	$effect(() => {
		if (show && dialog) {
			dialog.showModal();
		}
	});

	const onClose = (e: Event) => {
		show = false;
		if (dialog) {
			dialog.close();
		}
		if (onCloseProp) {
			onCloseProp(e);
		}
	};
</script>

<dialog bind:this={dialog} onclose={onClose}>
	<div>
		{@render children?.()}
		{@render actions?.()}
	</div>
</dialog>

<style>
	dialog {
		width: min(100%, 32em);
		border-radius: 12px;
		border: 2px solid var(--color-modal-border);
		padding: 0;
		background: var(--color-modal-background);
		box-shadow: 0 0 8px 0 var(--color-modal-box-shadow);
		opacity: 0;
		container: modal / inline-size;
		margin-block: 1rem;
		block-size: 100dvh;

		@container main (width > 90ch) {
			margin-block: auto;
			block-size: revert;
		}

		&::backdrop {
			backdrop-filter: blur(2px);
			opacity: 0;
		}

		> div {
			padding: 1rem 1.5rem;

			@container modal (width > 50ch) {
				padding: 2rem 2.5rem;
			}
		}

		&[open] {
			opacity: 1;
		}
	}

	dialog[open]::backdrop {
		opacity: 1;
	}

	@starting-style {
		dialog[open],
		dialog[open]::backdrop {
			opacity: 0;
		}
	}
</style>
