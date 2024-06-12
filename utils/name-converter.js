import slugify from "slugify";

// convert vietnamese name to slug version
// eg: 'Lớn Xinh Như Hoa' -> 'lon-xinh-nhu-hoa'
function convertNameToSlug(name) {
	return slugify(name, {
		replacement: "-",
		lower: true,
		locale: "vi",
		trim: true,
	});
}

export { convertNameToSlug };
