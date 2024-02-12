export default function PricingPlans() {
	const [show, setShow] = useState(false);
	const [showMonth, setShowMonth] = useState(false);
	const handleClose = () => setShow(false);
	const handleMonthClose = () => setShowMonth(false);
	const shop_id = getItem("current_merchant");
	const [qrCode, setQrCode] = useState("");
	const [price, setPrice] = useState(66000);
	const [month, setMonth] = useState(12);
	const [planUid, setPlanUid] = useState("basic");
	const [contID, setContId] = useState(0);
	const { status, response, createInvoice } = useBillUpdater();
	const { status: cStatus, response: cResponse, detail } = useBillFetcher();
	const callPaymentService = (amountPMonth) => {
		setShowMonth(false);
		let detailInvoice = {
			merchant_id: shop_id,
			quantity: month,
			plan_uid: planUid,
		};
		setPrice(amountPMonth);
		createInvoice({ detailInvoice });
		setShow(true);
	};
	const choosePlan = (planIndex) => {
		setPrice(tiers[planIndex].price);
		setPlanUid(tiers[planIndex].uid);
		setShowMonth(true);
	};

	const checkInvoicePaid = () => {
		detail(contID);
	};

	useEffect(() => {
		setQrCode(response?.qrcode);
		if (response?.id != null) {
			setContId(response.id);
		}
	}, [response]);

	useEffect(() => {}, [month]);

	useEffect(() => {
		if (cStatus === "done") {
			if (cResponse) {
				if (cResponse?.success) {
					toast.success("Төлбөр амжилттай төлөгдлөө.");
					document.location.href = "/";
				} else {
					toast.error("Төлбөр хараахан төлөгдөөгүй байна.");
				}
			}
		}
	}, [cResponse, cStatus]);

	return (
		<div className='pricing-container mt-4'>
			<Modal show={showMonth} onHide={handleMonthClose}>
				<Modal.Header closeButton>
					<Modal.Title>Төлбөр төлөх</Modal.Title>
				</Modal.Header>
				<div className='d-flex flex-column bg-'>
					<div
						className='d-flex justify-content-between align-items-center my-3 mx-5 px-3 py-3 my-2'
						style={{ background: "#f9fbfd", borderRadius: 16, cursor: "pointer" }}
						onClick={() => setMonth(12)}
					>
						<label
							className=''
							style={{ margin: "0 0 0 12px", fontSize: 20 }}
							htmlFor='month12'
						>
							12 сараар
						</label>
						<input
							type='checkbox'
							id='month12'
							name='month12'
							style={{
								width: "18px",
								height: "18px",
							}}
							checked={month == 12}
						/>
					</div>
					<div className='d-flex justify-content-between align-items-center mx-5 px-3 py-3 my-2'>
						<div>Үндсэн үнэ:</div>
						<div
							style={
								month == 12
									? { textDecoration: "line-through" }
									: { textDecoration: "none" }
							}
						>
							{numeral(month * price).format("0,0")}₮
						</div>
					</div>
					<div className='d-flex justify-content-between align-items-center mx-5 px-3 py-3 my-2'>
						<div>Хямдарсан:</div>
						<div>{month == 12 ? "10%" : "0%"}</div>
					</div>

					<div class='dropdown-divider'></div>
					<div className='d-flex justify-content-between align-items-center mx-5 px-3 py-3 my-2'>
						<div>Нийт үнэ:</div>
						<div>
							{numeral(month == 12 ? month * price * 0.9 : month * price).format("0,0")}₮
						</div>
					</div>
				</div>
				<Modal.Footer>
					<Button className='btn btn-light' variant='secondary' onClick={handleMonthClose}>
						Буцах
					</Button>
					<Button
						type='submit'
						className='btn btn-success'
						variant='primary'
						onClick={() => callPaymentService(price)}
					>
						Үргэлжлүүлэх
					</Button>
				</Modal.Footer>
			</Modal>
			<Modal show={show} onHide={handleClose}>
				<Modal.Header closeButton>
					<Modal.Title>Төлбөр төлөлт</Modal.Title>
				</Modal.Header>
				<div className='row justify-content-center'>
					<div className='d-flex justify-content-center col-12 col-md-6'>
						{status === "done" && (
							<QRCode
								value={`${qrCode}`}
								style={{
									margin: 50,
									height: 150,
									width: 150,
								}}
							/>
						)}
						{status === "pending" && (
							<div style={{ margin: 50 }}>
								<SkeletonTheme>
									<Skeleton height={150} width={150} />
								</SkeletonTheme>
							</div>
						)}
					</div>
					<div
						className='col-12 col-md-6 d-flex justify-content-center'
						style={{ marginTop: 50 }}
					>
						<div className='list-group list-group-flush my-n3'>
							<div className='list-group-item'>
								<small className='text-muted justify-content-center'>Хүлээн авагч</small>
								<h4>
									<p>Зочил технологи ХХК</p>
								</h4>
							</div>
							<div className='list-group-item'>
								<small className='text-muted justify-content-center'>Төлбөр</small>
								<h4>
									<p>
										{numeral(month == 12 ? month * price * 0.9 : month * price).format(
											"0,0",
										)}
										₮
									</p>
								</h4>
							</div>
						</div>
					</div>
				</div>
				<Modal.Footer>
					<Button className='btn btn-light' variant='secondary' onClick={handleClose}>
						Буцах
					</Button>
					<Button
						type='submit'
						className='btn btn-success'
						variant='primary'
						onClick={checkInvoicePaid}
						disabled={cStatus === "pending"}
					>
						{cStatus === "pending" && (
							<span className='spinner-border spinner-border-sm mr-1' />
						)}
						Төлсөн
					</Button>
				</Modal.Footer>
			</Modal>
			<div className='mb-5'>
				<h1 className='header-title'>Үйлчилгээний багцууд</h1>
				<h3 className='header-subtitle'>Таны бизнест зориулсан дэвшилтэт үйлчилгээ.</h3>
			</div>
			<div className='timeline'>
				<div className='timeline-progress' />
				<div className='timeline-item'>
					<div className='timeline-contain'>{`1600 Харилцагчид`}</div>
				</div>
			</div>
			<div className='tiers-grid'>
				{tiers.map((tier) => (
					<div
						key={tier.uid}
						className={classNames("card", {
							"tier-popular": tier.isRecommended,
						})}
					>
						<div className='card-body'>
							<div className='tier-header'>
								<div className='tier-wrapper'>
									<h1 className='tier-title'>{tier.name}</h1>
									{tier.isRecommended && <p className='tier-tag'>Санал болгох</p>}
								</div>
								<p className='tier-price'>
									<span>{tier.priceMonthly}₮</span>
									/сарын
								</p>
								<div className='tier-description'>{tier.description}</div>
								<button onClick={() => choosePlan(tier.uid)} className='tier-button'>
									Сонгох
								</button>
							</div>
							<div>
								<p className='tier-label'>Үйлчилгээ</p>
								<div>
									{tier.features.map((feature, i) => (
										<div key={i} className='tier-feature'>
											<div className='feature-wrapper'>
												<div className='feature-text'>
													<i className='fe fe-check-circle' />
													<p>{feature}</p>
												</div>
											</div>
											{tier.features.length - 1 !== i && <hr />}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
