export default function EventList() {
	const [filter, setFilter] = useState({});
	const [options, setOptions] = useState({});
	const { status, response, list } = useEventFetcher();
	const { status: removeStatus, removeEvent } = useEventUpdater();
	useEffect(() => {
		list({
			filter,
			options,
		});
	}, [filter, options]);
	useEffect(() => {
		if (removeStatus === "done") {
			list({
				filter,
				options,
			});
		}
	}, [removeStatus]);
	const { data: events = [] } = response || {};
	if (status === "pending" || removeStatus === "pending") {
		return <Loader />;
	}
	return (
		<>
			<ScreenHeader new_url='/events/new' title='Арга хэмжээ' />
			{!events[0] ? (
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
									<h2 className='mb-2'>Арга хэмжээ байхгүй байна.</h2>
									<p className='text-muted'>
										Арга хэмжээ нэмэх товчин дээр дарж нэмнэ үү.
									</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			) : (
				<div>
					{events.map((event) => (
						<ListItem key={event.id} event={event} onRemove={(id) => removeEvent({ id })} />
					))}
				</div>
			)}
		</>
	);
}
