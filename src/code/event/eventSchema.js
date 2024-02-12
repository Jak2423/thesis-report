export const eventSchema = yup.object().shape({
	name: yup.string().required(),
	start_at: yup.string().required(),
	end_at: yup.string().required(),
	address: yup.string().required(),
	youtube_url: yup
		.string()
		.nullable()
		.matches(/^(https?\:\/\/)?((www\.)?youtube\.com|youtu\.be)\/.+$/, {
			message: "Youtube линк буруу байна.",
			excludeEmptyString: true,
		}),
});
