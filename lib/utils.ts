export function extractPrice(...ele: any){
    for(const element of ele){
        const priceText = element.text().trim();

        if(priceText) return priceText.replace(/[^\d.]/g, '');
    }

    return '';
}

export function extractCurrency(ele: any){
    const currencyText = ele.text().trim().slice(0,1);
    return currencyText? currencyText : '';
}

export function extractDescription(...ele:any){

}