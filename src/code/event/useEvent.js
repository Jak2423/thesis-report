export function useEventFetcher() {
	const { status, error, response, fetcher } = useFetcher();
	return {
		status,
		error,
		response,
		list: ({ filter, options }) =>
			fetcher({
				filter,
				options,
				method: "get",
				url: `/admin/events`,
			}),
		detail: (id) =>
			fetcher({
				method: "get",
				url: `/admin/events/${id}`,
			}),
	};
}

export function useEventUpdater() {
	const { status, error, response, fetcher } = useFetcher();
	const defaults = {};
	return {
		status,
		error,
		createEvent: ({ event }) =>
			fetcher({
				method: "post",
				url: `/admin/events`,
				body: { ...event, ...defaults },
			}),
		updateEvent: ({ id, event }) =>
			fetcher({
				method: "put",
				url: `/admin/events/${id}`,
				body: { ...event, ...defaults },
			}),
		removeEvent: ({ id }) =>
			fetcher({
				method: "delete",
				url: `/admin/events/${id}`,
			}),
	};
}
