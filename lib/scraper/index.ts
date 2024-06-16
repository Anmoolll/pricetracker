import axios from 'axios';
import * as cheerio from 'cheerio'
import { extractCurrency, extractDescription, extractPrice } from '../utils';

export async function scrapeAmazonProduct(url: string){
    if(!url){
        return;
    }

    // curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_2d3bfced-zone-pricetracker:xu648ummu9ud -k "http://geo.brdtest.com/mygeo.json"

    const username = String(process.env.BRIGHT_DATA_USERNAME);
    const password = String(process.env.BRIGHT_DATA_PASSWORD);
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;

    const options = {
        auth: {
            username: `${username}-session-${session_id}`,
            password,
        },
        host: 'brd.superproxy.io',
        port,
        rejectUnauthorised: false,
    }

    try {
        const response = await axios.get(url, options)
        const $ = cheerio.load(response.data);
        const title = $('#productTitle').text().trim();
        const currentPrice = extractPrice(
            $('.a-section.a-spacing-none.aok-align-center.aok-relative'),
            $('.aok-offscreen'),
            $('.priceToPay span.a-price-whole'),
            $('a.size.base.a-color-price'),
            $('.a-button-selected .a-color-base'),
            $('.a-price.a-text-price'),
            $('.a-price.aok-align-center.reinventPricePriceToPayMargin')
        );

        const originalPrice = extractPrice(
            $('#priceblock_ourprice'),
            $('#listPrice'),
            $('.a-price.a-text-price span.a-offscreen'),
            $('#priceblock_dealprice'),
            $('.a-size-base.a-color-price')
        );

        const outOfStock = $('#availability span').text().trim().toLowerCase() === 'currently unavailable';
        const currency = extractCurrency($('.a-price-symbol'))
        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "");
        const description = extractDescription($);
        const stars = $('.a-size-base .a-color-base').text().trim();
        const review = $('#acrCustomerReviewText').text().trim().replace(/^(\d+)([a-zA-Z]+)$/, '');
        const images = $('#imgBlkFront').attr('data-a-dynamic-image') || $('#landingImage').attr('data-a-dynamic-image') ||
        '{}'
        const imageUrls = Object.keys(JSON.parse(images));

        const data = {
            url,
            title,
            currency: currency || '$',
            image: imageUrls[0],
            currentPrice: Number(currentPrice),
            originalPrice: Number(originalPrice),
            priceHistory: [],
            discountRate: Number(discountRate),
            isOutOfStock: outOfStock,
            stars: stars[0],
            rating: review
        }
        console.log(data);


    } catch (error: any) {
        throw new Error(`Failed to Scrape Product: ${error.message}`);
    }
}