<script lang="ts">
	import type { Snippet } from 'svelte';
	import ModalDragState from './ModalDragState.svelte';

	interface Props {
		show?: boolean;
		children: Snippet;
		actions?: Snippet;
		onClose?: (e: Event) => void;
	}

	let { show = $bindable(), children, actions, onClose: onCloseProp }: Props = $props();

	let element = $state<HTMLDialogElement>();
	const dragState = new ModalDragState();

	$effect(() => {
		if (show && element) {
			element.showModal();
			dragState.open();
		}
	});

	const onClose = (e: Event) => {
		clean();
		if (onCloseProp) {
			onCloseProp(e);
		}
	};

	const onDialogClick = (e: Event) => {
		if (e.target === element) {
			onClose(e);
		}
	};

	const onMouseDown = (e: MouseEvent) => {
		if (dragState.dragging) {
			return;
		}
		dragState.start(e.screenY);

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onDragEnd);
		document.addEventListener('mouseleave', onDragEnd);
	};

	const onTouchStart = (e: TouchEvent) => {
		e.preventDefault();
		if (dragState.dragging) {
			return;
		}
		dragState.start(e.touches[0].clientY);
		document.addEventListener('touchmove', onTouchMove);
		document.addEventListener('touchend', onDragEnd);
		document.addEventListener('touchcancel', onDragEnd);
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!dragState.dragging || !element) {
			return;
		}
		dragState.drag(e.screenY, element);
	};

	const onTouchMove = (e: TouchEvent) => {
		e.preventDefault();
		if (!dragState.dragging || !element) {
			return;
		}

		dragState.drag(e.touches[0].clientY, element);
	};

	const onDragEnd = (e: Event) => {
		if (!element || !dragState.dragging) {
			return;
		}

		e.preventDefault();

		if (dragState.isCloseHeightReached()) {
			clean();
		} else {
			resetHeight();
		}

		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onDragEnd);
		document.removeEventListener('mouseleave', onDragEnd);

		document.removeEventListener('touchmove', onTouchMove);
		document.removeEventListener('touchend', onDragEnd);
		document.removeEventListener('touchcancel', onDragEnd);
	};

	const onContextMenu = (e: Event) => {
		e.preventDefault();
	};

	const resetHeight = () => {
		dragState.stop('open');
	};

	const clean = () => {
		show = false;
		dragState.stop('close');
		setTimeout(() => {
			if (element) {
				element.close();
			}
		}, 175);
	};
</script>

<svelte:document />
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog
	bind:this={element}
	onclose={onClose}
	onclick={onDialogClick}
	style="--offset: {dragState.current}%"
>
	<!-- svelte-ignore a11y_autofocus -->
	<button
		onmousedown={onMouseDown}
		ontouchstart={onTouchStart}
		oncontextmenu={onContextMenu}
		type="button"
		autofocus
		data-dragging={dragState.dragging ? 'true' : undefined}
	>
		<span></span>
		<span class="visually-hidden">Drawer handle</span>
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
		transition: translate 175ms
			linear(0, 0.091 2.5%, 0.75 12.1%, 0.892 16.1%, 0.972 20.8%, 0.996 24.6%, 1.005 29.8%, 1);
		translate: 0 var(--offset, 0%);
		will-change: transform;
		backface-visibility: hidden;
		touch-action: none;

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
			padding-block-start: 0rem;
			padding-block-end: 0.5rem;
			padding-inline: 1.5rem;

			@container modal (width > 50ch) {
				padding-block-start: 1rem;
				padding-block-end: 2rem;
				padding-inline: 2.5rem;
			}
		}

		button {
			backface-visibility: hidden;
			touch-action: none;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			width: 100%;
			outline: none;
			block-size: 2.5rem;
			background: none;
			user-select: none;

			span:not(.visually-hidden) {
				width: 8ch;
				height: 6px;
				border-radius: 10px;
				background: var(--color-button-default-bg);
				transition: background-color 200ms ease;
			}

			&[data-dragging] {
				span {
					background-color: var(--color-button-default-active);
				}
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
