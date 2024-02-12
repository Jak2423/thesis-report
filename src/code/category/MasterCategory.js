export default function MasterCategory() {
	const {
		status: masterStatus,
		response: masterResponse,
		list: masterList,
		listAll: masterListAll,
	} = useMasterCategoryFetcher();

	const [showMasterCateg, setShowMasterCateg] = useState(false);
	const [checkedMasterCateg, setCheckedMasterCateg] = useState([]);
	const masterCategRef = useRef();

	useEffect(() => {
		const masterCategHandler = (e) => {
			if (masterCategRef.current && !masterCategRef.current.contains(e.target)) {
				setShowMasterCateg(false);
			}
		};

		document.addEventListener("mousedown", masterCategHandler);
		return () => {
			document.removeEventListener("mousedown", masterCategHandler);
		};
	}, []);

	function masterCategoryAdd(id, name) {
		setCheckedMasterCateg((checkedMasterCateg) => [...checkedMasterCateg, { id, name }]);
	}

	function masterCategoryRemove(id) {
		for (const master of checkedMasterCateg) {
			if (id === master.id) {
				checkedMasterCateg.splice(checkedMasterCateg.indexOf(master), 1);
				break;
			}
		}
		setCheckedMasterCateg([...checkedMasterCateg]);
	}

	useEffect(() => {
		masterListAll({});
	}, []);

	const { data: masterCategories = [] } = masterResponse || {};

	useEffect(() => {
		if (fetcher.response?.data) {
			setCheckedcategories(fetcher.response?.data?.categories || []);
		}
	}, [fetcher.response]);

	useEffect(() => {
		setValue("main_category_ids", checkedMasterCateg);
	}, [checkedMasterCateg]);

	return (
		<>
			<Col sm={4}>
				<div className='card'>
					<div className='card-header'>
						<h5 className='header-title'>МАСТЕР АНГИЛАЛ</h5>
					</div>
					<div className='card-body'>
						<div className='row justify-content-center'>
							{checkedMasterCateg.map((masterCateg) => (
								<div className='checked-master-list' key={masterCateg.id}>
									<span className=''>{masterCateg.name}</span>
									<a
										type='button'
										className='text-sm text-danger'
										onClick={() => masterCategoryRemove(masterCateg.id)}
									>
										<i className='fe fe-trash' />
									</a>
								</div>
							))}
							<button
								type='button'
								className='btn btn-secondary btn-xl w-100'
								onClick={() => setShowMasterCateg(!showMasterCateg)}
							>
								<i className='fe fe-plus text-white font-weight-bold mr-2' />
							</button>
						</div>
					</div>
				</div>
			</Col>
			<div
				ref={masterCategRef}
				className={classNames("right-slide", {
					"show-right-slide": showMasterCateg,
					"hide-right-slide": !showMasterCateg,
				})}
			>
				<div className='right-slide-header'>
					<button
						className='btn btn-secondary btn-sm'
						onClick={() => setShowMasterCateg(false)}
					>
						<i className='fe fe-x' />
					</button>
				</div>
				<div className='right-slide-body'>
					<p className='text-muted'>Мастер ангилал сонгох:</p>
					{masterCategories.map((masterCategory) => (
						<MasterCategoryItem
							key={masterCategory.id}
							category={masterCategory}
							checkedCategories={checkedMasterCateg}
							categoryAdd={masterCategoryAdd}
							categoryRemove={masterCategoryRemove}
						/>
					))}
				</div>
			</div>
		</>
	);
}
