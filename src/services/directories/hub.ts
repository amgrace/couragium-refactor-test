import { Promotion } from "../../exerciseFunctions/types";

export class Hub {
	private static instance: Hub;
	private directories: Map<string, (data: Promotion) => Promise<any>>; 

	private constructor() {
		this.directories = new Map<string, (data: Promotion) => Promise<any>>(); 
	}

	public hasSubmitFunction(directory: string) {
		return this.directories.has(directory);
	}

	public getSubmitFunction(directory: string) {
		if (this.directories.has(directory)) {
			return this.directories.get(directory);
		} else {
			return undefined;
		}
	}

	public addSubmitFunction(directory: string, submitFunction: (data: Promotion) => Promise<any>) {
		this.directories.set(directory, submitFunction);
		return this;
	}

	public static getInstance() {
		if (!Hub.instance) {
			Hub.instance = new Hub();
		}
		return Hub.instance;
	}
}
