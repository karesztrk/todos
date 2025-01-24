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
	let offset = $state(0);
	let initialY = $state(0);

	$effect(() => {
		if (show && dialog) {
			dialog.showModal();
		}
	});

	const onClose = (e: Event) => {
		show = false;
		dragging = false;
		if (dialog) {
			dialog.close();
		}
		if (onCloseProp) {
			onCloseProp(e);
		}
	};

	const onDialogClick = (e: Event) => {
		if (e.target === dialog) {
			onClose(e);
		}
	};

	const onMouseDown = (e: MouseEvent) => {
		if (dragging) {
			return;
		}
		offset = 0;
		dragging = true;
		initialY = e.screenY;

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onDragEnd);
		document.addEventListener('mouseleave', onDragEnd);
	};

	const onTouchStart = (e: TouchEvent) => {
		e.preventDefault();
		if (dragging) {
			return;
		}
		dragging = true;
		initialY = e.touches[0].clientY;
		document.addEventListener('touchmove', onTouchMove);
		document.addEventListener('touchend', onDragEnd);
		document.addEventListener('touchcancel', onDragEnd);
	};

	const onMouseMove = (e: MouseEvent) => {
		if (!dragging || !dialog) {
			return;
		}
		const delta = Math.max(0, e.screenY - initialY);
		const height = dialog.clientHeight;
		offset = Math.ceil(Math.max(0, delta / height) * 100);

		animateDialog();
	};

	const onTouchMove = (e: TouchEvent) => {
		e.preventDefault();
		if (!dragging || !dialog) {
			return;
		}
		const delta = Math.max(0, e.touches[0].clientY - initialY);
		const height = dialog.clientHeight;
		offset = Math.ceil(Math.max(0, delta / height) * 100);

		animateDialog();
	};

	const animateDialog = () => {
		if (dialog) {
			dialog.animate([{ '--offset': `${offset}%` }], {
				duration: 25,
				fill: 'both',
				easing: 'linear'
			});
		}
	};

	const onDragEnd = (e: Event) => {
		if (!dialog || !dragging) {
			return;
		}

		e.preventDefault();

		const closeHeightReached = offset > 40;
		let animation;
		if (closeHeightReached) {
			animation = dialog.animate([{ '--offset': '110%' }], {
				duration: 125,
				fill: 'both',
				easing: 'ease-in'
			});
		} else {
			animation = dialog.animate([{ '--offset': '0%' }], {
				duration: 200,
				fill: 'both',
				easing: 'ease-out'
			});
		}

		animation.addEventListener('finish', () => {
			if (dialog) {
				if (closeHeightReached) {
					dialog.close();
				}
				dialog.getAnimations().forEach((a) => a.cancel());
				offset = 0;
				dragging = false;
			}

			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseup', onDragEnd);
			document.removeEventListener('mouseleave', onDragEnd);

			document.removeEventListener('touchmove', onTouchMove);
			document.removeEventListener('touchend', onDragEnd);
			document.removeEventListener('touchcancel', onDragEnd);
		});
	};

	const onContextMenu = (e: Event) => {
		e.preventDefault();
	};
</script>

<svelte:document />
<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialog} onclose={onClose} onclick={onDialogClick}>
	<!-- svelte-ignore a11y_autofocus -->
	<button
		onmousedown={onMouseDown}
		ontouchstart={onTouchStart}
		oncontextmenu={onContextMenu}
		type="button"
		autofocus
		data-dragging={dragging ? 'true' : undefined}
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
		translate: 0 var(--offset, 0%);
		will-change: transform;
		backface-visibility: hidden;

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
