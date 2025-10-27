import type { Request, Response } from "express";
export declare function redirect(path: string): (req: Request, res: Response) => void;
