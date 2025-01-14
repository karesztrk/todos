<script>
	import { getFileName } from './Icon.util';

	const baseClass = 'icon';
	const {
		viewBox = '0 0 24 24',
		width = '1em',
		height = '1em',
		class: className,
		role = 'presentation',
		src,
		reference,
		inline,
		title,
		children,
		...rest
	} = $props();

	const href = `${src}#${reference || getFileName(src)}`;
</script>

<svg
	class:list={[baseClass, { [`${baseClass}-inline`]: inline }, className]}
	{viewBox}
	{width}
	{height}
	{role}
	{...rest}
>
	<use {href}></use>
	{@render children?.()}
	{#if reference}
		<title>{title}</title>
	{/if}
</svg>
