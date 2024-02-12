export default function BannerList() {
	const [filter, setFilter] = useState({});
	const [options, setOptions] = useState({});
	const { status, response, list } = useBannerFetcher();
	const { status: removeStatus, removeBanner } = useBannerUpdater();

	useEffect(() => {
		list({
			filter,
			options,
		});
	}, [filter]);

	useEffect(() => {
		if (removeStatus === "done") {
			list({
				filter,
				options,
			});
		}
	}, [removeStatus]);

	const { data: banners = [] } = response || {};

	if (status === "pending" || removeStatus === "pending") {
		return <Loader />;
	}

	return (
		<>
			<ScreenHeader new_url='/banners/new' title='Баннер' />
			{!banners[0] ? (
				<div className='list row mb-5 justify-content-center'>
					<div className='card mt-5 justify-content-center'>
						<div className='card-body pt-5 text-center'>
							<div className='row justify-content-center pt-5'>
								<div className='col-12 col-xl-12'>
									<img
										src='/img/illustrations/faq.svg'
										alt='...'
										className='img-fluid mt-n5 mb-4'
										style={{ height: "50vh" }}
									/>
									<h2 className='mb-2'>Баннер байхгүй байна.</h2>
									<p className='text-muted'>Баннер нэмэх товчин дээр дарж нэмнэ үү.</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div>
					{banners.map((banner) => (
						<ListItem
							key={banner.id}
							banner={banner}
							onRemove={(id) => removeBanner({ id })}
						/>
					))}
				</div>
			)}
		</>
	);
}
