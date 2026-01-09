const fs = require('fs');
const path = require('path');

// Isso garante que o caminho seja sempre relativo à pasta do projeto,
// não importa de onde você execute o terminal.
const filePath = path.join(__dirname, '..', 'data', 'inventory.json');

function loadData() {
    try {
        // Se a pasta 'data' não existir, cria ela
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        // Se o arquivo não existir, cria um arquivo com um array vazio []
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, '[]', 'utf8');
            return [];
        }

        const data = fs.readFileSync(filePath, 'utf8');

        // Se o arquivo estiver vazio (length 0), trata como array vazio
        if (!data.trim()) {
            return [];
        }

        return JSON.parse(data);
    } catch (error) {
        // Se o JSON estiver corrompido, retorna lista vazia para o app não crashar
        return [];
    }
}

function saveData(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

function generateId(products) {
    const lastId = products.length > 0 ? products[products.length - 1].id : 0;
    return lastId + 1;
}

module.exports = { loadData, saveData, generateId };