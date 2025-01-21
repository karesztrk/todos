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
	let dragging = $state(false);
	let mouseDownY = $state(0);
	let offset = $state(0);
	const maxOffset = 75;

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

	const onMouseDown = (e: PointerEvent) => {
		e.preventDefault();
		dragging = true;
		mouseDownY = e.screenY;

		document.addEventListener('pointermove', onMouseMove);
		document.addEventListener('pointerup', onMouseUp);
	};

	const onMouseMove = (e: MouseEvent) => {
		if (dragging) {
			offset = Math.max(0, e.screenY - mouseDownY);
		}
	};

	const onMouseUp = () => {
		if (dialog && dragging && offset > maxOffset) {
			dialog.close();
		}
		offset = 0;
		dragging = false;

		document.removeEventListener('pointermove', onMouseMove);
		document.removeEventListener('pointerup', onMouseUp);
	};
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<dialog bind:this={dialog} onclose={onClose} style:--offset={offset + 'px'}>
	<button aria-label="Close" onpointerdown={onMouseDown}>
		<svg width="50" height="6" viewBox="0 0 50 6" fill="none" xmlns="http://www.w3.org/2000/svg">
			<rect width="50" height="6" rx="3" />
		</svg>
	</button>
	<div>
		{@render children?.()}
		{@render actions?.()}
	</div>
</dialog>

<style>
	dialog {
		--_inline-margin: 0;
		--_block-end-margin: 0;
		--_min-height: 20svh;
		--_min-width: 100%;
		--_border-radius: 20px;
		--_border: 2px solid var(--color-modal-border);
		--_shadow-blur: 20px;
		--_shadow-spead: 4px;
		border-top-left-radius: var(--_border-radius);
		border-top-right-radius: var(--_border-radius);
		border: 0;
		padding: 0;
		background: var(--color-modal-background);
		box-shadow: 0 0 var(--_shadow-blur) var(--_shadow-spead) var(--color-modal-box-shadow);
		container: modal / inline-size;
		margin-block-end: var(--_block-end-margin);
		margin-inline: var(--_inline-margin);
		min-block-size: var(--_min-height);
		min-inline-size: var(--_min-width);
		translate: 0 var(--offset, 0px);
		transition: translate 50ms linear;

		@container main (width > 90ch) {
			--_inline-margin: auto;
			--_block-end-margin: auto;
			--_min-width: min(100%, 32em);
			--_min-height: auto;
			--_shadow-spead: 2px;
			--_shadow-blur: 4px;

			--_border-radius: 12px;
			border-radius: var(--_border-radius);
		}

		&::backdrop {
			backdrop-filter: blur(2px);
			opacity: 0;
		}

		> div {
			padding: 0.5rem 1.5rem;

			@container modal (width > 50ch) {
				padding: 2rem 2.5rem;
			}
		}

		button {
			display: block;
			width: 100%;
			outline: none;
			padding-block-end: 1rem;

			background: none;
			svg {
				fill: var(--color-button-default-bg);
			}

			@container main (width > 90ch) {
				display: none;
			}
		}
	}

	dialog[open]::backdrop {
		opacity: 1;
	}
</style>
