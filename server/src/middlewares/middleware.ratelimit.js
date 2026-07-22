import {redis} from "../config/redis.js";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";// this library basically limits the number of requests a user can make to the server in a given time frame, which helps
//  to prevent abuse and protect against DDoS attacks.
//and acts as Express middleware------------- 
// It works by
//  keeping track of the number of requests made by each user (identified by their IP address or user ID) 
// by default it stores in the data in the server's memory, but we  use external stores like 
// Redis to store the rate limit data, which is useful for distributed systems where multiple 
// instances of the server are running.beacause it acts as a global storage unlike servers memory store which is local to each instance of the server.
//so the server couldnt maintain a global count because of that in the end redis is a fast in-memory data store that can be used to store the rate limit data, and it provides a simple API for setting and retrieving data, making it
//  a popular choice for implementing rate limiting in distributed systems.

import RedisStore from "rate-limit-redis";

export const rateLimiter = rateLimit({ // it returns a middleware function that we can use in our routes to apply rate limiting
    windowMs:15 * 60 * 1000,
    max:100,
    standardHeaders:true,
    legacyHeaders:false,
       keyGenerator: (req) =>
        req.user?.orgId ?? ipKeyGenerator(req),//rateLimiter reads req.orgId, and that's only set after authenticate runs, 
    // unauthenticated routes (register/login) will just fall back to req.ip 
    //if we dont add the code below it then by default the data would be stored in the server's memory, which is not ideal 
    // for distributed systems where multiple instances of the server are running. By using Redis as the store, we can ensure
    //  that the rate limit data is shared across all instances of the server, allowing for more accurate rate limiting and better performance.
    store:new RedisStore({
        sendCommand:(...args)=>redis.call(...args)
    }), //this will store the rate limit data in redis(which is a in-memory data store) instead of memory, which is useful for distributed systems

   message:{success:false,message:"Too many requests, please try again later."}
})