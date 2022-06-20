interface Veiculo {
    nome: string
    placa: string
    entrada: Date | string
}

(function () {
    const $ = (query: string): HTMLInputElement | null => document.querySelector(query)

    function calctempo(millis: number) {
        const min = Math.floor(millis / 60000)
        const seg = Math.floor((millis % 60000) / 1000)

        return `${min}m e ${seg}s`
    }

    const cadastrar: HTMLInputElement = $("#cadastrar")!

    function patio() {
        function ler(): Veiculo[] {
            return localStorage.patio ? JSON.parse(localStorage.patio) : []
        }

        function salvar(veiculos: Veiculo[]) {
            localStorage.setItem("patio", JSON.stringify(veiculos))
        }

        function adicionar(veiculo: Veiculo, salva: boolean) {
            const row: HTMLTableRowElement = document.createElement("tr")
            row.innerHTML = `
            <td>${veiculo.nome}</td>
            <td>${veiculo.placa}</td>
            <td>${veiculo.entrada}</td>
            <td><button class="delete" data-placa="${veiculo.placa}">Remover</button></td>
            `

            row.querySelector(".delete")?.addEventListener("click", function () {
                remover(this.dataset.placa as string)
            })

            $("#patio")?.appendChild(row)

            if (salva) {
                salvar([...ler(), veiculo])
            }
        }

        function remover(placa: string) {
            const { entrada, nome } = ler().find(veiculo => veiculo.placa === placa)
            const tempo = calctempo(new Date().getTime() - new Date(entrada).getTime())

            if (confirm(`O veículo ${nome} permaneceu no estacionamento por ${tempo}. Deseja retirá-lo?`)) {
                salvar(ler().filter((veiculo) => veiculo.placa !== placa))
                render()
            }
            return
        }

        function render() {
            $("#patio")!.innerHTML = ""
            const patio = ler()
            if (patio.length) {
                patio.forEach(veiculo => adicionar(veiculo, false));
            }
        }
        return { ler, salvar, adicionar, remover, render }
    }

    console.log(patio().ler())
    patio().render()

    cadastrar.addEventListener("click", () => {
        const nome = $("#nome")?.value
        const placa = $("#placa")?.value

        if (!nome || !placa) {
            alert("Nome e placa são obrigatórios")
        } else {
            patio().adicionar({ nome: nome, placa: placa, entrada: new Date(Date.now()).toISOString() }, true)
        }
    })
})()