import {
	addDays as addDaysFns,
	isToday as isTodayFns,
	startOfWeek as startOfWeekFns,
	formatISO9075,
	type Day
} from 'date-fns';

export const toDateString = (input: string) =>
	formatISO9075(new Date(input), { representation: 'date' });

export const getFirstDayOfWeek = (): Day => {
	const userLocale = 'hu';
	let firstDay: Day;

	try {
		const locale = new Intl.Locale(userLocale);

		firstDay = locale?.getWeekInfo()?.firstDay ?? 1;
	} catch {
		// Fallback to Monday (1) if API not supported
		firstDay = 1;
	}

	return firstDay;
};

export const startOfWeek = (date = new Date()) =>
	startOfWeekFns(date, { weekStartsOn: getFirstDayOfWeek() });

export const isToday = (date: Date) => isTodayFns(date);

export const weekDays = (start: Date) => Array.from({ length: 7 }, (_, i) => addDays(start, i));

export const addDays = (date: Date, days: number) => addDaysFns(date, days);
