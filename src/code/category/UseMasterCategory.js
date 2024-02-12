export function useMasterCategoryFetcher() {
	const shopId = getItem("current_merchant");
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
				url: `/admin/product-main-categories/list`,
			}),
		listAll: () =>
			fetcher({
				method: "get",
				url: `/admin/product-main-categories/list-all`,
			}),
		searchName: ({ name }) =>
			fetcher({
				method: "get",
				url: `/admin/product-main-categories/search?name=${name}`,
			}),
	};
}
