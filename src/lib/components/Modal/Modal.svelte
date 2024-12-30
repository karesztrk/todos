<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		show?: boolean;
		children: Snippet;
		onClose?: (e: Event) => void;
	}

	let { show = $bindable(), children, onClose: onCloseProp }: Props = $props();

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

		&::backdrop {
			backdrop-filter: blur(2px);
			opacity: 0;
		}

		> div {
			padding: 2rem 2.5rem;
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
