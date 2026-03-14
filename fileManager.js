const path = require('path');
const eksplorator = require('node-file-dialog');
const fs = require('fs/promises');
const Papa = require('papaparse');
const { error } = require('console');
const XLSX = require("xlsx");

async function chooseFile() {
    try{    
        const konfiguracja = { type: 'open-file'};
        const wybranePliki = await eksplorator(konfiguracja);
        const sciezkaDoPliku = wybranePliki[0];
        return sciezkaDoPliku;
    } catch (error){
        console.log("Anulowano wybór pliku")
        return null;
    }
    }


async function wczytajCSV(sciezka) {
    try{
        const wczytanyCSV = await fs.readFile(sciezka, 'utf-8');
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
    try{
        const wczytanyXlsx = await fs.readFile(sciezka);
        console.log("Wczytano xlsx poprawnie");
        const plikExcel = XLSX.read(wczytanyXlsx);
        const nazwaPierwszegoArkusza = plikExcel.SheetNames[0];
        const arkusz = plikExcel.Sheets[nazwaPierwszegoArkusza];
        const parsedXlsx = XLSX.utils.sheet_to_json(arkusz);
        console.log("Plik xlsx sparsowany poprawnie")
        return parsedXlsx
    }catch (error){
        console.log("Blad podczas czytania xlsx ");
        return null;
    }
}

async function wczytajDane(sciezka) {
    try { 
        const rozszerzenie = path.extname(sciezka).toLowerCase();
        console.log("Sprawdzanie rozszerzenia")
        if (rozszerzenie === ".csv"){
            return await wczytajCSV(sciezka);
        } else if (rozszerzenie === '.xlsx' || rozszerzenie === '.xls'){
            return await wczytajExcel(sciezka);
        } else {
            throw new Error("Błędny typ pliku.")
        }
    } catch(error) {
        console.log('Błąd meadżera.', error.message);
        return null;

    }
    
}

if (require.main === module) {
    async function Test() {
        console.log("Czekam na wybór pliku...");
        
        const sciezka = await chooseFile(); 
        
        if (sciezka !== null) {
            console.log("Wybrano ścieżkę:", sciezka);
            
            const dane = await wczytajDane(sciezka); 
            console.log("Oto Twoje dane:", dane);
        }
    }

    Test();
}




module.exports = {
    chooseFile,
    wczytajDane,
};
