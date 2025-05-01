import {  RequestHandler } from 'express';

export interface IMiddleware {
    execute: RequestHandler;
}
