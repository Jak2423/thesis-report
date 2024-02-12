export default function MasterCategoryItem({
	category,
	checkedCategories,
	categoryAdd,
	categoryRemove,
}) {
	const [categItem, setCategItem] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	useEffect(() => {
		const isCategoryChecked = checkedCategories.some((categ) => categ.id === category.id);
		setCategItem(isCategoryChecked);
	}, [checkedCategories, category.id]);

	function categoryStatus() {
		if (!categItem) {
			setCategItem(true);
			categoryAdd(category.id, category.name);
		} else {
			setCategItem(false);
			categoryRemove(category.id);
		}
	}

	const nestedCategory = (category.children || []).map((childCategory) => {
		return (
			<MasterCategoryItem
				key={childCategory.id}
				category={childCategory}
				checkedCategories={checkedCategories}
				categoryAdd={categoryAdd}
				categoryRemove={categoryRemove}
			/>
		);
	});

	return (
		<div className='mb-2'>
			<div className={`master-select-item`} style={{ marginLeft: `0.5 * ${category.level}rem` }}>
				<div className='master-item-name' onClick={() => setIsOpen(!isOpen)}>
					{category.children && (
						<i
							className={classNames("fe fe-chevron-right dropdown-arrow", {
								"rotate-90 ": !!isOpen,
							})}
						/>
					)}
					<div type='button' className='master-item-title'>
						{category.name}
					</div>
				</div>
				<input className='mr-4' type='checkbox' checked={categItem} onChange={categoryStatus} />
			</div>
			<Collapse isOpen={isOpen}>{nestedCategory}</Collapse>
		</div>
	);
}
