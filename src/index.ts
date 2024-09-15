/**
 * A web scraper that fetches all of the links from a given URL.
 * @author Leo
 */

import { fetch } from "bun";
import { resolve } from "path";
import yoctoSpinner from "yocto-spinner";
import type { File, Folder } from "./types";
import { getContentWithinPage } from "./parser";

/**
 * Right now the scraper only scrapes the exams folder
 * from the VCE curriculum, this could be changed but
 * it may not work.
 */
const BASE_URL = "https://atar.rocks/files/vce/exams/";
/**
 * If this contains any items, the scraper will exclude
 * folders or files that contain any of the items
 * Make sure that the file extension is provided if any
 */
const EXCLUDE: string[] = [
	"UMAT/UCAT", // This is irrelevant to VCE
	"neap-samples.pdf",
	"other" // Students are encouraged to check this folder in their own time
];
/**
 * The output directory to save the data to
 */
const OUTPUT_DIR = "data";
/**
 * The output file to save the data to. Output
 * is always a JSON file. Dates can be templated.
 */
const OUTPUT_FILE = "data-DD-MM-YYYY.json";

let filesScraped = 0;
let foldersScraped = 0;

const getScrapeSpinnerMessage = () => {
	return `Scraped ${foldersScraped} folders and ${filesScraped} files\n`;
};

const now = performance.now();
const scrapeSpinner = yoctoSpinner({
	text: getScrapeSpinnerMessage(),
}).start();

const data = await scrape(BASE_URL);

/**
 * Starts the scraper.
 * @param url the URL to scrape
 */
export async function scrape(url: string) {
	const html = await visitURL(url);
	const content = getContentWithinPage(html);
	const data: Array<Folder | File> = [];

	for (const item of content) {
		// Exclude the item if it is in the EXCLUDE array
		if (EXCLUDE && EXCLUDE.includes(item.name)) continue;

		if (item.type === "folder") {
			// Recursively scrape the folder
			const children = await scrape(`${url}${item.name}/`);
			const folder: Folder = {
				name: item.name,
				url: `${url}${item.name}`,
				children,
			};
			data.push(folder);
			foldersScraped++;
			scrapeSpinner.text = getScrapeSpinnerMessage();
		} else if (item.type === "file") {
			data.push({
				name: item.name,
				url: `${url}${item.name}`,
			} as File);

			++filesScraped;
			scrapeSpinner.text = getScrapeSpinnerMessage();
		}
	}

	return data;
}

/**
 * Visit an URL and return the html content.
 * @param url the URL to visit
 */
export async function visitURL(url: string) {
	const request = await fetch(url);
	if (!request.ok) {
		throw new Error(`Failed to visit URL: ${url}`);
	}

	return await request.text();
}

scrapeSpinner.success(
	`${filesScraped} files, ${foldersScraped} folders scraped in ${(
		(performance.now() - now) /
		1000
	).toFixed(2)}s`
);

// Save the data into a JSON file
const saveDataSpinner = yoctoSpinner({
	text: "Saving data to file...",
}).start();

const fileName = OUTPUT_FILE.replace(
	/DD-MM-YYYY/,
	new Date().toLocaleDateString("en-GB").replaceAll("/", "-")
);

await Bun.write(resolve(__dirname, "..", OUTPUT_DIR, fileName), JSON.stringify(data));

saveDataSpinner.success(`Data saved to ${OUTPUT_DIR}/${OUTPUT_FILE}`);
