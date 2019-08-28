import { Request, Response, NextFunction } from "express";
import { NotFoundException } from "./NotFoundException";

export function notFoundErrorHandler(
	error: NotFoundException,
	request: Request,
	response: Response,
	next: NextFunction
) {
	console.error(error);
	response.status(error.status).json({ message: error.message });
}

export function genericErrorHandler(
	error: Error,
	request: Request,
	response: Response,
	next: NextFunction
) {
	console.error(error);
	response.status(500).json({ message: "Internal Error" });
}
