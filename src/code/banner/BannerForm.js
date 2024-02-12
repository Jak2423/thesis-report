export default function BannerForm() {
	const history = useHistory();
	const { id } = useRouterParams();
	const fetcher = useBannerFetcher();
	const updater = useBannerUpdater();
	const shopId = getItem("current_merchant");

	const [filter, setFilter] = useState({});
	const [options, setOptions] = useState({});
	const [hasContentBanner, setHasContentBanner] = useState(false);

	const {
		register,
		control,
		handleSubmit,
		setValue,
		unregister,
		watch,
		formState: { errors },
	} = useForm({
		resolver: yupResolver(bannerSchema),
		defaultValues: {
			banner_type: BannerType.MAIN,
		},
	});

	const watchBannerType = watch("banner_type");

	useEffect(() => {
		if (id) {
			fetcher.detail(id);
		} else {
			fetcher.list({
				filter,
				options,
			});
		}
	}, [id, filter]);

	useEffect(() => {
		if (fetcher.response?.data) {
			if (id) {
				const banner = fetcher.response.data;
				if (banner.content_banner) {
					setValue("banner_type", BannerType.CONTENT);
				} else if (banner.is_additional) {
					setValue("banner_type", BannerType.ADDITIONAL);
				} else {
					setValue("banner_type", BannerType.MAIN);
				}
				for (const field of [
					"title",
					"description",
					"image",
					"url",
					"button_title",
					"video_url",
				]) {
					setValue(field, banner[field]);
				}
			} else {
				const banners = fetcher.response.data;
				banners.map((b) => {
					if (b.content_banner) {
						setHasContentBanner(true);
					}
				});
			}
		}
	}, [fetcher.response]);

	useEffect(() => {
		const status = updater.status;
		const error = updater.error;
		if (updater.status === "done") {
			if (!error) {
				history.push("/banners");
				toast.success("Амжилттай шинэчлэгдлээ!");
			} else {
				toast.error(error.err_message || "Алдаа гарлаа. Та дахин оролдоно уу.");
			}
		}
	}, [updater.error, updater.status, updater.response]);

	const onSubmit = (banner) => {
		if (id) {
			updater.updateBanner({ id, banner });
			analytics.track("UPDATE_BANNER", {
				merchant_id: Number(shopId) || {}.id,
			});
		} else {
			if (watchBannerType === BannerType.ADDITIONAL) {
				updater.createBannerAdditional({ banner });
			} else if (watchBannerType === BannerType.CONTENT) {
				updater.createBannerContent({ banner });
			} else {
				updater.createBanner({ banner });
			}

			analytics.track("CREATE_BANNER", {
				merchant_id: Number(shopId) || {}.id,
			});
		}
	};

	if (fetcher.status === "pending") {
		return <Loader />;
	}

	return (
		<>
			<ScreenHeader back_url='/banners' title={`Баннер ${id ? "засах" : "нэмэх"}`} />
			<Form loading={updater.status === "pending"} onSubmit={handleSubmit(onSubmit)}>
				<FormGroup label='Баннерын төрөл'>
					<select
						defaultValue={watchBannerType}
						onChange={(e) => setValue("banner_type", e.target.value)}
						className='custom-select'
						disabled={updater.status === "pending" || id}
						data-toggle='select'
						{...register("banner_type")}
					>
						<option value={BannerType.MAIN}>Үндсэн баннер</option>
						<option value={BannerType.ADDITIONAL}>Нэмэлт баннер</option>
						<option value={BannerType.CONTENT} disabled={hasContentBanner}>
							Контент баннер
						</option>
					</select>
				</FormGroup>
				{watchBannerType === BannerType.CONTENT && (
					<p className='invalid text-justify mx-1'>
						Нэгээс илүү контент баннер нэмэх боломжгүй.
					</p>
				)}
				<FormGroup label='Баннерын нэр' error={errors.title?.message}>
					<input
						type='text'
						disabled={updater.status === "pending"}
						placeholder='Баннерын гарчигаа оруулна уу'
						{...register("title")}
						className={classNames("form-control", {
							"is-invalid": !!errors.title,
						})}
					/>
				</FormGroup>
				<FormGroup label='Баннер зураг' error={errors.image?.message}>
					<Controller
						name='image'
						control={control}
						disabled={updater.status === "pending"}
						render={({ field }) => (
							<ImageUploader
								field={field}
								is_valid={errors.image}
								message='Баннерын зургаа энд дарж эсвэл зөөж оруулна уу.'
							/>
						)}
					/>
				</FormGroup>
				{!(watchBannerType === BannerType.CONTENT) ? (
					<>
						<FormGroup label='Баннерын текст' error={errors.description?.message}>
							<input
								type='text'
								defaultValue={""}
								disabled={updater.status === "pending"}
								placeholder='Баннерын гарчигаа оруулна уу'
								{...register("description")}
								className={classNames("form-control", {
									"is-invalid": !!errors.description,
								})}
							/>
						</FormGroup>

						<p className='text-muted mb-4 text-justify mx-1'>
							Та 4:1 харьцаатай зураг оруулна уу. / 1200x300px /
						</p>
						<FormGroup label='Баннерын линк' error={errors.url?.message}>
							<input
								type='text'
								disabled={updater.status === "pending"}
								placeholder='Баннерын линкээ оруулна уу'
								className={classNames("form-control", {
									"is-invalid": !!errors.url,
								})}
								{...register("url")}
							/>
						</FormGroup>
						<FormGroup label='Товчийн текст' error={errors.button_title?.message}>
							<input
								type='text'
								disabled={updater.status === "pending"}
								placeholder='Товчын текстээ оруулна уу'
								className={classNames("form-control", {
									"is-invalid": !!errors.button_title,
								})}
								{...register("button_title")}
							/>
						</FormGroup>
					</>
				) : (
					<>
						<FormGroup label='Youtube линк' error={errors.video_url?.message}>
							<input
								type='text'
								disabled={updater.status === "pending"}
								placeholder='Youtube URL оруулна уу.'
								{...register("video_url")}
								className={classNames("form-control", {
									"is-invalid": !!errors.video_url,
								})}
							/>
						</FormGroup>
					</>
				)}
			</Form>
		</>
	);
}
