import * as cheerio from "cheerio";

interface PageContentRow {
	name: string;
	type: "folder" | "file";
}

/**
 * Returns an array of links that are found within the HTML page.
 * @param page the HTML page to parse
 */
export function getContentWithinPage(page: string): PageContentRow[] {
	const $ = cheerio.load(page);

	// Get all of the links on the page
	const links = $(".link > a");

	const content: Array<PageContentRow> = [];
	
	links.each(function () {
		// Verify that the name and URL are present
		const name = $(this).text();
		const url = $(this).attr("href");

		if (!name || !url) {
			console.warn("Name or URL is missing for link", name);
			return;
		}

		// Reject ../, the parent directory link
		if (url === "../") {
			return;
		}

		// If the icon is a folder, the href ends with /
		// If the icon is a file, the href does not end with a /
		if (url.endsWith("/")) {
			const folder: PageContentRow = {
				name: name.replace("/", ""),
				type: "folder",
			};
			content.push(folder);
		} else {
			const file: PageContentRow = {
				name,
				type: "file",
			};
			content.push(file);
		}
	});

	return content;
}
