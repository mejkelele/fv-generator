const puppeteer = require('puppeteer');

async function createInvoice(){
    console.log("Tworzenie FV")
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const invoiceHTML = 
        
    

await page.setContent(invoiceHTML, { waitUntil:'networkidle0'});

await page.pdf({
    path: 'pierwszaFV.pdf',
    format: 'A4',
    printBackground: true
});

await browser.close();
console.log("PDF wygenerowany")}

createInvoice();