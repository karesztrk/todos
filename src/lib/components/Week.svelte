<script lang="ts">
	import { DAY, isToday, startOfWeek } from './Week.util';

	const dateFormatter = new Intl.DateTimeFormat(navigator.language, {
		month: '2-digit',
		day: '2-digit'
	});

	const dayFormatter = new Intl.DateTimeFormat(navigator.language, {
		weekday: 'short'
	});

	const today = new Date();

	const startDate = startOfWeek(today);

	const days = Array.from({ length: 7 }, (_, i) => new Date(startDate.getTime() + i * DAY)).map(
		(d) => ({
			date: dateFormatter.format(d),
			name: dayFormatter.format(d),
			today: isToday(d)
		})
	);
</script>

<t-week>
	{#each days as { date, name, today }, i}
		<t-day active={today ? '' : undefined} weekend={i === 5 || i === 6 ? '' : undefined}>
			<t-header
				><div>{date}</div>
				{name}</t-header
			>
			<input type="text" />
		</t-day>
	{/each}
	<t-day someday>
		<t-header>Someday</t-header>
		<input type="text" />
	</t-day>
	<t-day someday>
		<t-header>Someday</t-header>
		<input type="text" />
	</t-day>
	<t-day someday>
		<t-header>Someday</t-header>
		<input type="text" />
	</t-day>
</t-week>

<style>
	t-week {
		--min-width: 100px;
		--columns: 6;
		--active-color: hotpink;
		display: grid;
		grid-template-columns: repeat(var(--columns), minmax(min(100%, var(--min-width)), 1fr));
		gap: 2rem;

		t-day {
			min-height: 100px;
			grid-row: span 2;

			&[weekend] {
				grid-row: span 1;
			}

			&[active] {
				color: var(--active-color);
			}
			&[someday] {
				grid-column: span 2;
				grid-row: span 1;
			}
			input {
				width: 100%;
			}

			t-header {
				display: flex;
				justify-content: space-between;
				border-block-end: 1px solid #000;
			}
		}
	}
</style>
