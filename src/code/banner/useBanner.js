export function useBannerFetcher() {
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
				url: `/admin/banners/list`,
			}),
		detail: (id) =>
			fetcher({
				method: "get",
				url: `/admin/banners/detail/${id}`,
				params: { id },
			}),
	};
}

export function useBannerUpdater() {
	const { status, error, response, fetcher } = useFetcher();
	const defaults = { status: "enabled", type: "slider", position: "home_top" };
	return {
		status,
		error,
		createBanner: ({ banner }) =>
			fetcher({
				method: "post",
				body: {
					content_banner: false,
					is_additional: false,
					...banner,
					...defaults,
				},
				url: `/admin/banners/create`,
			}),
		createBannerAdditional: ({ banner }) =>
			fetcher({
				method: "post",
				body: {
					content_banner: false,
					is_additional: true,
					...banner,
					...defaults,
				},
				url: `/admin/banners/create`,
			}),
		createBannerContent: ({ banner }) =>
			fetcher({
				method: "post",
				body: {
					content_banner: true,
					is_additional: false,
					...banner,
					...defaults,
				},
				url: `/admin/banners/create`,
			}),
		updateBanner: ({ id, banner }) =>
			fetcher({
				method: "post",
				url: `/admin/banners/update`,
				body: { id, ...banner, ...defaults },
			}),
		removeBanner: ({ id }) =>
			fetcher({
				method: "post",
				url: `/admin/banners/remove`,
				body: { id },
			}),
	};
}
