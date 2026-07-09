const readline = require('readline-sync');
const { initDB, loadData, addProduct, deleteProduct } = require('./inventory');

async function main() {
    console.log("Conectando ao banco de dados...");
    await initDB(); // Garante que o banco e a tabela existem antes de continuar
    
    console.log("=== SISTEMA DE INVENTÁRIO ===");
    
    while (true) {
        console.log("\n1. Listar Produtos");
        console.log("2. Adicionar Produto");
        console.log("3. Deletar Produto");
        console.log("4. Sair");
        
        const opcao = readline.question("Escolha uma opcao: ");
        
        if (opcao === '1') {
            const produtos = await loadData();
            if (produtos.length === 0) {
                console.log("\nNenhum produto cadastrado.");
            } else {
                console.log("\n--- Produtos em Estoque ---");
                produtos.forEach(p => {
                    console.log(`ID: ${p.id} | Nome: ${p.name} | Qtd: ${p.quantity} | Preço: R$ ${parseFloat(p.price).toFixed(2)}`);
                });
            }
        } 
        else if (opcao === '2') {
            const nome = readline.question("Nome do produto: ");
            const quantidade = readline.questionInt("Quantidade: ");
            const preco = readline.questionFloat("Preco: "); 

            const sucesso = await addProduct(nome, quantidade, preco);
            if (sucesso) {
                console.log("\nProduto adicionado com sucesso!");
            } else {
                console.log("\nErro ao adicionar produto.");
            }
        } 
        else if (opcao === '3') {
            const id = readline.questionInt("Digite o ID do produto que deseja deletar: ");
            const sucesso = await deleteProduct(id);
            
            if (sucesso) {
                console.log("\nProduto deletado com sucesso!");
            } else {
                console.log("\nProduto não encontrado ou erro ao deletar.");
            }
        } 
        else if (opcao === '4') {
            console.log("\nSaindo do sistema...");
            process.exit(0);
        } 
        else {
            console.log("\nOpção inválida!");
        }
    }
}

main();