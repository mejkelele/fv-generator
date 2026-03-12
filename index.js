const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const fileManager = require('./fileManager.js');
const HandleBars = require('handlebars');



async function createInvoice(){
    
    const daneDoFaktury = {
        nazwa_nabywcy: "Jan Kowalski Testowy",
        ulica_nabywcy: "ul. Programistów 10, 00-000 Kraków",
        nabywca_nip: "111-222-33-44",
        numer_faktury: "FV-WEB/001/2026",
        data_wystawienia: "12.03.2026"
    };
    pozycje: [
        {
            lp: 1,
            nazwa_produktu: "Stworzenie generatora w Node.js",
            ilosc: 1,
            jm: "szt",
            netto_sztuka: "2500,00",
            netto: "2500,00"
        },
        {
            lp: 2,
            nazwa_produktu: "Konsultacje architektoniczne",
            ilosc: 3,
            jm: "godz",
            netto_sztuka: "200,00",
            netto: "600,00"
        }
    ]
    
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