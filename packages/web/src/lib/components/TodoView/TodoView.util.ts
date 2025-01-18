export const getFirstDayOfWeek = (): number => {
	const userLocale = 'en';
	let firstDay: number;

	try {
		const locale = new Intl.Locale(userLocale);
		firstDay = locale.weekInfo?.firstDay ?? 1;
	} catch (e) {
		// Fallback to Monday (1) if API not supported
		firstDay = 1;
	}
	return firstDay;
};

export const startOfWeek = (date = new Date()) => {
	const firstDay = getFirstDayOfWeek();
	// Convert Intl firstDay (7=Sunday) to JS getDay() format (0=Sunday)
	const weekStartsOn = firstDay === 7 ? 0 : firstDay;

	const result = new Date(date);
	const day = result.getDay();

	// Calculate the difference to the start of week
	const diff = day - weekStartsOn;

	// Adjust date to start of week
	result.setDate(result.getDate() - (diff >= 0 ? diff : diff + 7));

	// Reset time to start of day
	result.setHours(0, 0, 0, 0);

	return result;
};

export const isToday = (date: Date) => {
	const today = new Date();
	return isSameDay(today, date);
};

export const isSameDay = (left: Date, right: Date) => {
	return (
		left.getDate() === right.getDate() &&
		left.getMonth() === right.getMonth() &&
		left.getFullYear() === right.getFullYear()
	);
};

export const DAY = 24 * 60 * 60 * 1000;

export const weekDays = (start: Date) => Array.from({ length: 7 }, (_, i) => addDays(start, i));

export const addDays = (date: Date, days: number) => new Date(date.getTime() + days * DAY);
