const mysql = require('mysql2/promise');

// Conecta inicialmente sem banco de dados para garantir que ele exista
const config = {
    host: 'localhost',
    user: 'root',      
    password: '342170', // Coloque sua senha aqui se tiver
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;

async function initDB() {
    try {
        // 1. Conecta ao servidor MySQL
        const connection = await mysql.createConnection(config);
        
        // 2. Cria o banco de dados se não existir
        await connection.query(`CREATE DATABASE IF NOT EXISTS inventory_db`);
        await connection.end();

        // 3. Inicializa o Pool agora apontando para o banco correto
        pool = mysql.createPool({ ...config, database: 'inventory_db' });

        // 4. Cria a tabela
        await pool.query(`
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10, 2) NOT NULL
            )
        `);
    } catch (error) {
        console.error("Erro ao inicializar o banco de dados:", error.message);
    }
}


async function loadData() {
    try {
        if (!pool) return [];
        const [rows] = await pool.query('SELECT * FROM products');
        return rows;
    } catch (error) {
        console.error('Erro ao carregar dados do MySQL:', error.message);
        return [];
    }
}

async function addProduct(name, quantity, price) {
    try {
        if (!pool) return false;
        await pool.query(
            'INSERT INTO products (name, quantity, price) VALUES (?, ?, ?)',
            [name, quantity, parseFloat(price)]
        );
        return true;
    } catch (error) {
        console.error('Erro ao salvar produto no MySQL:', error.message);
        return false;
    }
}

function generateId() {
    return null; 
}

module.exports = { initDB, loadData, addProduct, generateId };