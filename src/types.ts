export interface File {
	/**
	 * The name of the file
	 */
	name: string;
	/**
	 * The full link to the file
	 */
	url: string;
}

export interface Folder {
	/**
	 * The name of the folder
	 */
	name: string;
	/**
	 * The full link to the file
	 */
	url: string;
	/**
	 * The children of the folder, either a file or another folder
	 */
	children: Array<Folder | File>;
}