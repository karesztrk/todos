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
			<t-footer></t-footer>
		</t-day>
	{/each}
	<t-day someday>
		<t-header>Someday</t-header>
		<input type="text" />
		<t-footer></t-footer>
	</t-day>
	<t-day someday>
		<t-header></t-header>
		<input type="text" />
		<t-footer></t-footer>
	</t-day>
	<t-day someday>
		<t-header></t-header>
		<input type="text" />
		<t-footer></t-footer>
	</t-day>
</t-week>

<style>
	t-week {
		--min-width: 100px;
		--max-row-height: 30px;
		--min-height: 90vh;
		--columns: 6;
		--active-color: hotpink;
		min-block-size: var(--min-height);
		display: grid;
		grid-template-columns: repeat(var(--columns), minmax(min(100%, var(--min-width)), 1fr));
		/* grid-template-rows: repeat(auto-fill, minmax(100%, var(--max-row-height))); */
		grid-auto-rows: minmax(100%, var(--max-row-height));
		column-gap: 2rem;
		t-day {
			display: grid;
			grid-template-rows: subgrid;
			grid-row: span 6;

			&[weekend] {
				grid-row: span 3;
			}

			&:not([weekend]) {
				t-footer {
					grid-row: span 4;
				}
			}

			&[active] {
				color: var(--active-color);
			}

			&[someday] {
				grid-column: span 2;
			}

			input {
				width: 100%;
				height: auto;
			}

			t-header {
				display: flex;
				justify-content: space-between;
				border-block-end: 1px solid #fff;
			}

			t-footer {
				background: repeating-linear-gradient(
					transparent 0 calc(var(--max-row-height) - 1px),
					rgba(255, 255, 255, 0.25) calc(var(--max-row-height) - 1px) var(--max-row-height)
				);
			}
		}
	}
</style>
