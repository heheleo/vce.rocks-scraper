# vce.rocks Web Scraper

This is a web scraper for [vce.rocks](https://vce.rocks/), built with `bun 1.1.26`. Currently it only scrapes the exam papers and their solutions.

This scraper is not affiliated with vce.rocks in any way, nor does it store or make copies of the data. It is only to obtain links. It is intended for informational purposes only.

## Types
The JSON file contains an array of `Folder`s.

```typescript
export interface File {
	name: string;
	url: string;
}

export interface Folder {
	name: string;
	url: string;
	children: Array<Folder | File>;
}
```

## Use the data
[https://raw.githubusercontent.com/heheleo/vce.rocks-scraper/main/data/data-15-09-2024.json](https://raw.githubusercontent.com/heheleo/vce.rocks-scraper/main/data/data-15-09-2024.json)
