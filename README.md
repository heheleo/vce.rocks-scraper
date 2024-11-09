# vce.rocks Web Scraper

This is a web scraper for [vce.rocks](https://vce.rocks/), built with `bun 1.1.34`. Currently it only scrapes the exam papers and their solutions.

This scraper is not affiliated with vce.rocks in any way, nor does it store or make copies of the data. It is only to obtain links. It is intended for informational purposes only.

We fully support the creator of vce.rocks and encourage you to visit their website for the best experience. The amount of effort and time they have put into the library is truly amazing and honestly life-saving.

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

## Installation
⚠️ **Disclaimer:** Please do not scrape too often as it may strain the server.

Prerequisites:
- [bun](https://bun.sh) (^1.1.26)
  
```bash
bun install
bun run scrape
```

# Data: cutoff date 09/11/2024
[https://raw.githubusercontent.com/heheleo/vce.rocks-scraper/main/data/data-09-11-2024.json](https://raw.githubusercontent.com/heheleo/vce.rocks-scraper/main/data/data-09-11-2024.json)