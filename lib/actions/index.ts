"use server"

import { scrapeAmazonProduct } from "../scraper";

export async function scrapeAndStoreProduct(productURL: string){
    if(!productURL) return;


    try {
        const scrapeProduct = await scrapeAmazonProduct(productURL);

        if(!scrapeProduct) return;
        
    } catch (error: any) {
        throw new Error(`Failed to get/update the product: ${error.message}` )
    }
}