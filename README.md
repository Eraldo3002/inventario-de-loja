# Mapeamento: ID do elemento específico -> Clique
# IDs baseados no seu exemplo: "q15395336:6_answertrue"
respostas_radio = [
    "q15395336:6_answertrue",
    "q15395336:7_answerfalse",
    # Adicione os IDs das opções corretas
]

def responder_radio():
    for id_alvo in respostas_radio:
        try:
            botao = driver.find_element(By.ID, id_alvo)
            botao.click()
            print(f"Selecionado: {id_alvo}")
        except:
            print(f"ID {id_alvo} não encontrado nesta página.")

responder_radio()