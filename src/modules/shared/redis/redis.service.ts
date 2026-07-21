import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {Redis}from 'ioredis';
@Injectable()
export class RedisService implements OnModuleInit,OnModuleDestroy{
    private client:Redis;
    private readonly logger=new Logger(RedisService.name);
    constructor(private config:ConfigService){}

    onModuleInit() {
        this.client=new Redis({
            host:this.config.get<string>('redis.host'),
            port:this.config.get<number>('redis.port'),
            password:this.config.get<string>('redis.password'),
        });
        this.client.on('connect',()=>this.logger.log('Redis connected'));
        this.client.on('error',(err)=>this.logger.error('Redis error',err));
    }
    onModuleDestroy() {
        this.client.quit();
    }
    async get(key:string):Promise<string|null>{
        return this.client.get(key);
    }
    async set(key:string,value:string,ttlsecond?:number):Promise<void>{
        if(ttlsecond){
            await   this.client.set(key,value,'EX',ttlsecond);
        }
        else{
            await this.client.set(key,value);
        }
    }
    async del(key:string):Promise<void>{
        await this.client.del(key);
    }
    async ttl(key:string):Promise<number>{
        return this.client.ttl(key);
    }
    async publish(channel:string,message:string):Promise<void>{
        await this.client.publish(channel,message);
    }
    getClient():Redis{
        return this.client;
    }
}