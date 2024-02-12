export const bannerSchema = yup.object().shape({
	banner_type: yup.string().required().oneOf(["үндсэн", "нэмэлт", "контент"]),
	title: yup.string().required("Баннерын нэрийг оруулна уу."),
	description: yup.string(),
	url: yup.string().url().nullable(),
	button_title: yup.string(),
	image: yup.string().url().required("Баннерын зургаа оруулна уу."),
	video_url: yup.string().when("banner_type", {
		is: "контент",
		then: yup
			.string()
			.required()
			.matches(
				/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/,
				"Youtube линк буруу байна.",
			),
		otherwise: yup.string().nullable().notRequired(),
	}),
});
