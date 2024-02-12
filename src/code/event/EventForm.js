export default function EventForm() {
	const history = useHistory();
	const { id } = useRouterParams();
	const fetcher = useEventFetcher();
	const updater = useEventUpdater();
	const {
		register,
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(eventSchema),
		defaultValues: {
			images: [],
		},
	});
	useEffect(() => {
		if (id) {
			fetcher.detail(id);
		}
	}, [id]);
	useEffect(() => {
		if (fetcher.response?.data) {
			const event = fetcher.response.data;
			for (const field of [
				"name",
				"description",
				"start_at",
				"images",
				"end_at",
				"address",
				"youtube_url",
			]) {
				setValue(field, event[field]);
			}
		}
	}, [fetcher.response]);
	useEffect(() => {
		const error = updater.error;
		if (updater.status === "done") {
			if (!error) {
				history.push("/events");
			} else {
				toast.error(error.err_message || "Алдаа гарлаа. Та дахин оролдоно уу.");
			}
		}
	}, [updater.error, updater.status, updater.response]);
	const onSubmit = (event) => {
		if (id) {
			updater.updateEvent({ id, event });
		} else {
			updater.createEvent({ event });
		}
	};
	if (fetcher.status === "pending") {
		return <Loader />;
	}
	return (
		<>
			<ScreenHeader back_url='/events' title={`Арга хэмжээ ${id ? "засах" : "нэмэх"}`} />
			<Form loading={updater.status === "pending"} onSubmit={handleSubmit(onSubmit)}>
				<FormGroup label='Нэр' error={errors.name?.message}>
					<input
						type='text'
						disabled={updater.status === "pending"}
						placeholder='Арга хэмжээний нэрээ оруулна уу.'
						{...register("name")}
						className={classNames("form-control", {
							"is-invalid": !!errors.name,
						})}
					/>
				</FormGroup>
				<FormGroup label='Танилцуулга' error={errors.description?.message}>
					<textarea
						autoComplete={0}
						autoCorrect={0}
						disabled={updater.status === "pending"}
						spellCheck={false}
						placeholder='Арга хэмжээний танилцуулгаа оруулна уу.'
						{...register("description")}
						className={classNames("form-control pl-2", {
							"is-invalid": !!errors.description,
						})}
					/>
				</FormGroup>
				<div className='row'>
					<div className='col-12 col-md-6'>
						<FormGroup label='Эхлэх огноо' error={errors.start_at?.message}>
							<Controller
								name='start_at'
								control={control}
								render={({ onChange, value, field }) => (
									<DatePicker
										selected={Date.parse(field.value)}
										dateFormat='yyyy/MM/dd hh:mm aa'
										showTimeSelect
										timeFormat='hh:mm'
										timeIntervals={15}
										onChange={(value) => field.onChange(value.toISOString())}
										placeholderText='Арга хэмжээ дуусах огноо'
										className={classNames("form-control", {
											"is-invalid": !!errors.start_at,
										})}
									/>
								)}
							/>
						</FormGroup>
					</div>
					<div className='col-12 col-lg-6'>
						<FormGroup label='Дуусах огноо' error={errors.end_at?.message}>
							<Controller
								name='end_at'
								control={control}
								render={({ onChange, value, field }) => (
									<DatePicker
										selected={Date.parse(field.value)}
										dateFormat='yyyy/MM/dd hh:mm aa'
										showTimeSelect
										timeFormat='hh:mm'
										timeIntervals={15}
										onChange={(value) => field.onChange(value.toISOString())}
										placeholderText='Арга хэмжээ дуусах огноо'
										className={classNames("form-control", {
											"is-invalid": !!errors.end_at,
										})}
									/>
								)}
							/>
						</FormGroup>
					</div>
				</div>
				<FormGroup label='Зураг' error={errors.images?.message}>
					<Controller
						name='images'
						control={control}
						disabled={updater.status === "pending"}
						render={({ field }) => (
							<ImageUploader
								field={field}
								is_valid={errors.images}
								message='Арга хэмжээний зургаа энд дарж эсвэл зөөж оруулна уу.'
							/>
						)}
					/>
				</FormGroup>
				<FormGroup label='Хаяг' error={errors.address?.message}>
					<textarea
						autoComplete={0}
						autoCorrect={0}
						disabled={updater.status === "pending"}
						spellCheck={false}
						placeholder='Арга хэмжээний хаягийг оруулна уу.'
						{...register("address")}
						className={classNames("form-control pl-2", {
							"is-invalid": !!errors.address,
						})}
					/>
				</FormGroup>
				<FormGroup label='Youtube линк' error={errors.youtube_url?.message}>
					<div
						className={classNames("input-group", {
							"is-invalid": !!errors.event_video_url,
						})}
					>
						<input
							type='url'
							disabled={updater.status === "pending"}
							placeholder='Youtube видео линк.'
							className={classNames("form-control", {
								"is-invalid": !!errors.youtube_url,
							})}
							{...register("youtube_url")}
						/>
						<div className='input-group-append'>
							<span className='input-group-text' id='basic-addon2'>
								<i className='fe fe-youtube' />
							</span>
						</div>
					</div>
				</FormGroup>
			</Form>
		</>
	);
}
