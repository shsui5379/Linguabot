import { Request } from 'express';
import { OpenidRequest } from 'express-openid-connect';
declare module 'express' {
    interface Request {
        openId?: OpenidRequest
    }
}