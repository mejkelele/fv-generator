const path = require('path');
const eksplorator = require('node-file-dialog');
const fs = require('fs/promises');
const Papa = require('papaparse');

async function chooseFile() {
    try{    
        const konfiguracja = { type: 'open-file'};
        const wybranePliki = await eksplorator(konfiguracja);
        const sciezkaDoPliku = wybranePliki[0];
        console.log(sciezkaDoPliku);
        
        return sciezkaDoPliku;
    } catch (error){
        console.log("Anulowano wybór pliku")
        return null;
    }
    }


async function wczytajCSV(path) {
    try{
        const wczytanyCSV = await fs.readFile(path, 'utf-8');
        console.log("Wczytano CSV poprawnie");
        const parsedCSV = Papa.parse(wczytanyCSV,{
            header:true,
            delimiter:';',
            skipEmptyLines: true
        });
        console.log("Plik CSV sparsowany poprawnie.");
        return parsedCSV.data
    }catch (error){
        console.log("Blad podczas czytania CSV ");
        return null;
    }
}

async function wczytajExcel(sciezka) {
    throw new Error("Odczyt Excela jeszcze nie jest zaprogramowany!");
}



if (require.main === module) {
    async function Test() {
        console.log("Czekam na wybór pliku...");
        
        const sciezka = await chooseFile(); 
        
        if (sciezka !== null) {
            console.log("Wybrano ścieżkę:", sciezka);
            
            const dane = await wczytajCSV(sciezka); 
            console.log("Oto Twoje dane:", dane);
        }
    }

    Test();
}




module.exports = {
    chooseFile,
    wczytajCSV
};
