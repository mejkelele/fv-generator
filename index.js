const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const fileManager = require('./fileManager.js');
const HandleBars = require('handlebars');

async function createInvoice() {
    try {
        const sciezka = await fileManager.chooseFile();
        if (!sciezka){
            console.log("Nie wybrano pliku.");
            return null;
        }
        const suroweDane = await fileManager.wczytajDane(sciezka);
        if(!suroweDane || suroweDane.length == 0){
            console.log("Plik jest pusty. Upewnik się że wybrany plik jest poprawny.");
            return null;
        }
        const pierwszyWiersz = suroweDane[0];
        const numerSzukanejFaktury = pierwszyWiersz.Nr_Faktury;

        const wierszeFaktury = suroweDane.filter(wiersz => wiersz.Nr_Faktury === numerSzukanejFaktury);

        const daneDoFaktury = {
            numer_faktury: wierszeFaktury[0].Nr_Faktury,
            nabywca_nazwa: wierszeFaktury[0].Nabywca_Nazwa,
            nabywca_nip: wierszeFaktury[0].Nabywca_NIP,
            pozycje: []
        };
    }
}

async function acreateInvoice(){
    
    const daneDoFaktury = "abcd ";
    
    fileManager.rozpoznajPlik('faktury.csv');
    console.log("Wczytywanie pliku...");
    console.log("Tworzenie FV");
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    const invoiceHTML = await fs.readFile('./szablon.html', 'utf-8');
    const szablon = HandleBars.compile(invoiceHTML);
    const gotowyHTML = szablon(daneDoFaktury);
    

    await page.setContent(gotowyHTML, { waitUntil:'networkidle0'});

    await page.pdf({    
        path: 'pierwszaFV.pdf',
        format: 'A4',
        printBackground: true,
        margin:{
            top:'20mm',
            bottom:'20mm',
            left:'20mm',
            right:'20mm',
        }
    });

    await browser.close();
    console.log("PDF wygenerowany")}

createInvoice();