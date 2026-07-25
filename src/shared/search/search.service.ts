import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MeiliSearch } from 'meilisearch';
@Injectable()
export class SearchService{
    private client: MeiliSearch;
    constructor(private config:ConfigService){
        this.client=new MeiliSearch({
            host:this.config.get<string>('meilisearch.host')??'http://localhost:7700',
            apiKey:this.config.get<string>('meilisearch.apiKey')??'',
        });
    }
    async index(indexName:string,document:any[]){
        await this.client.index(indexName).addDocuments(document);
    }
    async search(indexName:string,query:string){
        return this.client.index(indexName).search(query);
    }
    async delete(indexName:string,id:string){
        await this.client.index(indexName).deleteDocument(id);
    }
}