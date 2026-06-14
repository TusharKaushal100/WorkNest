import {redis} from "../config/redis.js";
import ratelimit from "express-rate-limit";;
import RedisStore from "rate-limit-redis";

export const rateLimiter = rateLimit({
    WindowMs:15 * 60 * 1000,
    max:100,
    standardHEaders:true,
    legacyHeaders:false,
    store:new RedisStore({
        sendCommand:(...args)=>redis.call(...args)
    }) //this will store the rate limit data in redis(which is a in-memory data store) instead of memory, which is useful for distributed systems

    
})