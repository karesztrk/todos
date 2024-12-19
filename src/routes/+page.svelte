<script lang="ts">
	import TodoView from '$lib/components/TodoView';
	import { addDays, startOfWeek } from '$lib/components/TodoView/TodoView.util';
	import { useAccount, useCoState } from '$lib/repository/jazz';
	import { ListOfTodos, Todo, TodoProject } from '$lib/repository/schema';
	import { Group, type ID } from 'jazz-tools';

	const now = new Date();

	const start = startOfWeek(now);
	const range = $state({ start, end: addDays(start, 6) });
	const projectId = $state<ID<TodoProject> | undefined>();

	let todos = $derived(useCoState(TodoProject, projectId));

	const { me } = useAccount({
		root: { projects: [{}] }
	});

	$effect(() => {
		// const unsubscribe = ListOfTodos.subscribe(allTodos(range))(() => {
		// 	const result = db.getQuery(allTodos(range));
		// 	todos = Promise.resolve(result);
		// });
		// const unsubscribe = ListOfTodos.subscribe(undefined, me, [], (updatedIssue) => {
		// 	console.log(updatedIssue);
		// });
		// return () => {
		// 	unsubscribe();
		// };
	});

	const next = () => {
		range.start = addDays(range.start, 7);
		range.end = addDays(range.end, 7);
		// 	todos = db.loadQuery(allTodos(range));
	};

	const previous = () => {
		range.start = addDays(range.start, -7);
		range.end = addDays(range.end, -7);
		// todos = db.loadQuery(allTodos(range));
	};

	const create = () => {
		if (!me) return;

		// To create a new todo project, we first create a `Group`,
		// which is a scope for defining access rights (reader/writer/admin)
		// of its members, which will apply to all CoValues owned by that group.
		const projectGroup = Group.create({ owner: me });

		// Then we create an empty todo project within that group
		const project = TodoProject.create(
			{
				title: 'Demo',
				todos: ListOfTodos.create([], { owner: projectGroup })
			},
			{ owner: projectGroup }
		);

		me.root?.projects?.push(project);

		console.log(project.id);
	};
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Todos" />
</svelte:head>

<section>
	<hrgroup>
		<h1>Todos ({range.start.toLocaleDateString('en', { month: 'long' })})</h1>
		<div>
			<button onclick={previous}>Prev</button>
			<button onclick={next}>Next</button>
		</div>
	</hrgroup>

	<article>
		<button onclick={create}>Create</button>
		{#if todos.current}
			<TodoView todos={todos.current} />
		{/if}
	</article>
</section>

<style>
	section {
		hrgroup {
			margin-block-start: 20px;
			margin-block-end: 2rem;

			display: flex;
			flex-flow: row wrap;
			justify-content: space-between;
			align-items: center;
			gap: 1rem;
		}
	}
</style>
