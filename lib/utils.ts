export function extractPrice(...ele: any){
    for(const element of ele){
        const priceText = element.text().trim();

        if(priceText) return priceText.replace(/\D/g, '');
    }

    return '';
}