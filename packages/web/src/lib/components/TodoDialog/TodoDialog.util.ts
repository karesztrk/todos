export const toDateString = (input: string) => {
	const date = new Date(input);
	return `${date.getFullYear()}-${new String(date.getMonth() + 1).padStart(2, '0')}-${date.getDate()}`;
};
