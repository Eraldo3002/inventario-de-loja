const readline = require('readline-sync');
const { loadData, saveData, generateId } = require('./inventory');

function atualizarProduto(inventory) {
    const idBusca = parseInt(readline.question("\nDigite o ID do produto que deseja atualizar: "));
    const produto = inventory.find(p => p.id === idBusca);

    if (!produto) {
        console.log(" Erro: Produto com ID " + idBusca + " nao encontrado.");
        return;
    }

    console.log(`\nEditando: [${produto.nome}]`);
    console.log("Pressione ENTER para manter o valor atual.");

    // 1. Atualizar Nome
    const novoNome = readline.question(`Nome (${produto.nome}): `);
    if (novoNome.trim() !== "") {
        produto.nome = novoNome;
    }

    // 2. Atualizar Categoria
    const novaCategoria = readline.question(`Categoria (${produto.categoria}): `);
    if (novaCategoria.trim() !== "") {
        produto.categoria = novaCategoria;
    }

    // 3. Atualizar Quantidade (validacao numerica)
    const novaQtdInput = readline.question(`Quantidade (${produto.quantidade}): `);
    if (novaQtdInput.trim() !== "") {
        const qtd = parseInt(novaQtdInput);
        if (!isNaN(qtd) && qtd >= 0) {
            produto.quantidade = qtd;
        } else {
            console.log(" Quantidade invalida. Mantendo valor original.");
        }
    }

    // 4. Atualizar Preco (validacao numerica)
    const novoPrecoInput = readline.question(`Preco (${produto.preco}): `);
if (novoPrecoInput.trim() !== "") {
        const preco = parseFloat(novoPrecoInput.replace(',', '.'));
    if (!isNaN(preco) && preco >= 0) {
        produto.preco = preco;
    }
}
    // Salvar as alteracoes
    saveData(inventory);
    console.log("\n Produto atualizado com sucesso!");
}

function buscarProduto(inventory) {
    console.log("\n--- BUSCAR PRODUTO ---");
    console.log("1. Buscar por ID");
    console.log("2. Buscar por Nome");
    const subOpcao = readline.question("Escolha uma opcao: ");

    if (subOpcao === '1') {
        const idBusca = parseInt(readline.question("Digite o ID: "));
        const produto = inventory.find(p => p.id === idBusca);
        if (produto) {
            console.table([produto]); // Mostra em formato de tabela
        } else {
            console.log("❌ Produto não encontrado com este ID.");
        }
    } 
    else if (subOpcao === '2') {
        const nomeBusca = readline.question("Digite o nome (ou parte dele): ").toLowerCase();
        const resultados = inventory.filter(p => p.nome.toLowerCase().includes(nomeBusca));
        
        if (resultados.length > 0) {
            console.table(resultados);
        } else {
            console.log(`❌ Nenhum produto encontrado com o nome "${nomeBusca}".`);
        }
    } 
    else {
        console.log("Opção inválida.");
    }
}

function main() {
    let inventory = loadData();

    while (true) {
        console.log("\n--- SISTEMA DE INVENTARIO ---");
        console.log("1. Adicionar Produto");
        console.log("2. Listar Produtos");
        console.log("3. Atualizar Produto");
        console.log("4. Excluir Produto");
        console.log("5. Buscar Produto");
        console.log("0. Sair");

        const choice = readline.question("Escolha uma opcao: ");

        switch (choice) {

             case '1':
    const nome = readline.question("Nome do Produto: ");
    const categoria = readline.question("Categoria: ");
    
    // questionInt garante que seja número inteiro
    const quantidade = readline.questionInt("Quantidade: "); 
    
    // questionFloat permite decimais e valida a entrada
    const preco = readline.questionFloat("Preco: "); 

    const novoProduto = {
        id: generateId(inventory),
        nome,
        categoria,
        quantidade,
        preco
    };
                inventory.push(novoProduto);
                saveData(inventory);
                console.log("Produto adicionado com sucesso!");
                break;

            case '2':
    if (inventory.length === 0) {
        console.log("\nO inventário está vazio.");
    } else {
        let exibir = inventory;

        // Pergunta se quer filtrar (y/n)
        if (readline.keyInYN("\nDeseja filtrar por categoria? ")) {
            const cat = readline.question("Qual categoria? ").toLowerCase();
            exibir = inventory.filter(p => p.categoria.toLowerCase() === cat);
        }

        // Pergunta se quer ordenar (y/n)
        if (exibir.length > 0 && readline.keyInYN("Deseja ordenar a lista? ")) {
            console.log("1. Nome | 2. Qtd | 3. Preco");
            const op = readline.question("Escolha (1-3): ");
            
            // Cria uma cópia para não bagunçar a ordem original do inventário
            exibir = [...exibir].sort((a, b) => {
                if (op === '1') return a.nome.localeCompare(b.nome);
                if (op === '2') return a.quantidade - b.quantidade;
                if (op === '3') return a.preco - b.preco;
                return 0;
            });
        }

        if (exibir.length === 0) {
            console.log("Nenhum produto encontrado.");
        } else {
            console.table(exibir);
        }
    }
    break;

            case '3':
    atualizarProduto(inventory);
    break;

            case '4':
                const idExcluir = parseInt(readline.question("ID do produto a excluir: "));
                const index = inventory.findIndex(p => p.id === idExcluir);
                
                if (index !== -1) {
                    const confirmar = readline.keyInYN(`Deseja excluir ${inventory[index].nome}? `);
                    if (confirmar) {
                        inventory.splice(index, 1);
                        saveData(inventory);
                        console.log("Produto removido!");
                    }
                } else {
                    console.log("ID não encontrado.");
                }
                break;

            case '5':
    buscarProduto(inventory);
    break;
            
            case '0':
                process.exit();
            
            default:
                console.log("Opção inválida.");
        }
    }
}

main();