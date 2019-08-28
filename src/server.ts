import * as express from "express";
import { promotionsRouter } from "./configuration";
import { notFoundErrorHandler, genericErrorHandler } from "./exceptions/exceptionHandling";

const app = express();

// Routing
app.use(promotionsRouter);

// Exception handling
app.use(notFoundErrorHandler);
app.use(genericErrorHandler);

export default app;
