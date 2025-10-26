import type { Request, Response, NextFunction } from "express";
export declare function pathErrorTest(req: Request, res: Response, next: NextFunction): void;
export declare function pathErrorNotFound(req: Request, res: Response, next: NextFunction): void;
export declare function pathErrorGlobal(err: Error, req: Request, res: Response, next: NextFunction): void;
