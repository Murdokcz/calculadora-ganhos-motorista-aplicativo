(() => {
    // Namespace to avoid polluting global scope
    window.EarningsCalc = {
        historico: JSON.parse(localStorage.getItem('historico')) || [],

        mostrarCalculadora() {
            document.getElementById('calculadora').classList.remove('hidden');
            document.getElementById('historico').classList.add('hidden');
            document.getElementById('custoKM').classList.add('hidden');
            document.getElementById('estimativas').classList.add('hidden');
        },

        mostrarHistorico() {
            document.getElementById('calculadora').classList.add('hidden');
            document.getElementById('historico').classList.remove('hidden');
            document.getElementById('custoKM').classList.add('hidden');
            document.getElementById('estimativas').classList.add('hidden');
            this.atualizarHistorico();
        },

        mostrarCustoKM() {
            document.getElementById('calculadora').classList.add('hidden');
            document.getElementById('historico').classList.add('hidden');
            document.getElementById('custoKM').classList.remove('hidden');
            document.getElementById('estimativas').classList.add('hidden');
        },

        mostrarEstimativas() {
            document.getElementById('calculadora').classList.add('hidden');
            document.getElementById('historico').classList.add('hidden');
            document.getElementById('custoKM').classList.add('hidden');
            document.getElementById('estimativas').classList.remove('hidden');
        },

        calcularCustoKM() {
            const aluguelCarro = parseFloat(document.getElementById('aluguelCarroCusto').value) || 0;
            const prestacaoCarro = parseFloat(document.getElementById('prestacaoCarro').value) || 0;
            const despesasMedia = parseFloat(document.getElementById('despesasMedia').value) || 0;
            const consumoCarro = parseFloat(document.getElementById('consumoCarroCusto').value);
            const valorCombustivel = parseFloat(document.getElementById('valorCombustivelCusto').value);
            const despesasDiarias = parseFloat(document.getElementById('despesasDiarias').value) || 0;
            const kmRodado = parseFloat(document.getElementById('kmRodadoCusto').value);

            if (consumoCarro <= 0 || valorCombustivel <= 0 || kmRodado <= 0) {
                alert('Consumo do carro, valor do combustível e KM rodado devem ser maiores que zero.');
                return;
            }

            const litrosGastos = kmRodado / consumoCarro;
            const custoCombustivel = litrosGastos * valorCombustivel;
            const custoTotal = aluguelCarro + prestacaoCarro + despesasMedia + custoCombustivel + despesasDiarias;
            const custoPorKM = custoTotal / kmRodado;
            const valorLiquido = (2 * kmRodado) - custoTotal;

            document.getElementById('custoKMTexto').innerHTML = `<strong>Custo por KM:</strong> R$ ${custoPorKM.toFixed(2)}`;
            document.getElementById('despesasDiariasTexto').innerHTML = `<strong>Valor das Despesas Diárias:</strong> R$ ${custoTotal.toFixed(2)}`;
            document.getElementById('valorLiquidoTexto').innerHTML = `<strong>Valor Líquido Aceitando Corridas a R$ 2,00/KM:</strong> R$ ${valorLiquido.toFixed(2)}`;
            document.getElementById('resultadoCustoKM').classList.remove('hidden');
        },

        validarEntradas() {
            const horaInicio = document.getElementById('horaInicio').value;
            const horaFim = document.getElementById('horaFim').value;
            const valorGanho = document.getElementById('valorGanho').value;

            if (parseFloat(valorGanho) <= 0) {
                alert('O valor ganho deve ser maior que zero.');
                return false;
            }

            const inicio = new Date(`1970-01-01T${horaInicio}`);
            const fim = new Date(`1970-01-01T${horaFim}`);
            if (fim <= inicio) {
                alert('O horário de fim deve ser maior que o horário de início.');
                return false;
            }

            return true;
        },

        validarPeriodoTrabalho(horaInicio, horaFim) {
            const inicio = new Date(`1970-01-01T${horaInicio}:00`);
            const fim = new Date(`1970-01-01T${horaFim}:00`);
            const diff = (fim - inicio) / (1000 * 60 * 60);
            return diff <= 24;
        },

        calcularGanhos() {
            const valorGanho = parseFloat(document.getElementById('valorGanho').value).toFixed(2);
            const horaInicio = document.getElementById('horaInicio').value;
            const horaFim = document.getElementById('horaFim').value;
            const kmRodado = parseFloat(document.getElementById('kmRodado').value);
            const consumoCarro = parseFloat(document.getElementById('consumoCarro').value);
            const aluguelCarro = parseFloat(document.getElementById('aluguelCarro').value);
            const valorCombustivel = parseFloat(document.getElementById('valorCombustivel').value);

            // Calcular horas trabalhadas
            const inicio = new Date(`1970-01-01T${horaInicio}`);
            const fim = new Date(`1970-01-01T${horaFim}`);
            const horasTrabalhadas = (fim - inicio) / (1000 * 60 * 60);

            // Calcular valor ganho por hora e por km
            const valorPorHora = valorGanho / horasTrabalhadas;
            const valorPorKm = valorGanho / kmRodado;

            if (!this.validarPeriodoTrabalho(horaInicio, horaFim)) {
                alert('O período de trabalho não pode exceder 24 horas.');
                return;
            }

            // Calcular custos
            const litrosGastos = kmRodado / consumoCarro;
            const custoCombustivel = litrosGastos * valorCombustivel;
            const custoTotal = parseFloat(custoCombustivel) + parseFloat(aluguelCarro);
            const lucroLiquido = parseFloat(valorGanho) - custoTotal;

            document.getElementById('salvarBtn').disabled = false;

            const resultadoTexto = `
                <strong>Data:</strong> ${document.getElementById('data').value}<br>
                <strong>Valor Ganho:</strong> R$ ${valorGanho}<br>
                <strong>Horário de Início:</strong> ${horaInicio}<br>
                <strong>Horário de Fim:</strong> ${horaFim}<br>
                <strong>KM Rodado:</strong> ${kmRodado.toFixed(1)} km<br>
                <strong>Valor Ganho por Hora:</strong> R$ ${valorPorHora.toFixed(2)}<br>
                <strong>Valor Ganho por KM:</strong> R$ ${valorPorKm.toFixed(2)}<br>
                <strong>Consumo do Carro:</strong> ${consumoCarro.toFixed(1)} km/l<br>
                <strong>Aluguel do Carro:</strong> R$ ${aluguelCarro.toFixed(2)}<br>
                <strong>Valor do Combustível:</strong> R$ ${valorCombustivel.toFixed(2)} por litro<br>
                <strong>Custos do Dia:</strong><br>
                - Combustível: R$ ${custoCombustivel.toFixed(2)}<br>
                - Aluguel: R$ ${aluguelCarro.toFixed(2)}<br>
                <strong>Custo Total:</strong> R$ ${custoTotal.toFixed(2)}<br>
                <strong>Lucro Líquido:</strong> R$ ${lucroLiquido.toFixed(2)}
            `;

            const estimativaSemanal = (lucroLiquido * 6).toFixed(2);
            const estimativaTexto = `
                <strong>Estimativa Semanal (Lucro Líquido):</strong> R$ ${estimativaSemanal} (trabalhando 6 dias por semana)
            `;

            document.getElementById('resultadoTexto').innerHTML = resultadoTexto;
            document.getElementById('estimativaTexto').innerHTML = estimativaTexto;
            document.getElementById('resultadoCalculo').classList.remove('hidden');
        },

        salvarDados() {
            try {
                const data = document.getElementById('data').value;
                const valorGanho = parseFloat(document.getElementById('valorGanho').value);
                const horaInicio = document.getElementById('horaInicio').value;
                const horaFim = document.getElementById('horaFim').value;
                const kmRodado = parseFloat(document.getElementById('kmRodado').value);
                const consumoCarro = parseFloat(document.getElementById('consumoCarro').value);
                const aluguelCarro = parseFloat(document.getElementById('aluguelCarro').value);
                const valorCombustivel = parseFloat(document.getElementById('valorCombustivel').value);

                const litrosGastos = kmRodado / consumoCarro;
                const custoCombustivel = litrosGastos * valorCombustivel;
                const custoTotal = custoCombustivel + aluguelCarro;
                const lucroLiquido = valorGanho - custoTotal;
                const estimativaSemanal = lucroLiquido * 6;

                const novoRegistro = {
                    data,
                    valorGanho: valorGanho.toFixed(2),
                    horaInicio,
                    horaFim,
                    kmRodado: kmRodado.toFixed(1),
                    consumoCarro: consumoCarro.toFixed(1),
                    aluguelCarro: aluguelCarro.toFixed(2),
                    valorCombustivel: valorCombustivel.toFixed(2),
                    custoCombustivel: custoCombustivel.toFixed(2),
                    custoTotal: custoTotal.toFixed(2),
                    lucroLiquido: lucroLiquido.toFixed(2),
                    estimativaSemanal: estimativaSemanal.toFixed(2),
                    timestamp: new Date(data).getTime()
                };

                if (this.historico.some(registro => registro.timestamp === novoRegistro.timestamp)) {
                    alert('Registro para esta data já existe.');
                    return;
                }

                this.historico.push(novoRegistro);
                this.historico.sort((a, b) => b.timestamp - a.timestamp);

                localStorage.setItem('historico', JSON.stringify(this.historico));

                this.limparFormulario();

                document.getElementById('salvarBtn').disabled = true;
                this.atualizarHistorico();
            } catch (error) {
                console.error('Erro ao salvar dados:', error);
                alert('Erro ao salvar os dados. Por favor, tente novamente.');
            }
        },

        limparFormulario() {
            document.getElementById('data').value = '';
            document.getElementById('valorGanho').value = '';
            document.getElementById('horaInicio').value = '';
            document.getElementById('horaFim').value = '';
            document.getElementById('kmRodado').value = '';
            document.getElementById('consumoCarro').value = '';
            document.getElementById('aluguelCarro').value = '';
            document.getElementById('valorCombustivel').value = '';

            document.getElementById('resultadoCalculo').classList.add('hidden');
        },

        calcularHorasTrabalhadas(horaInicio, horaFim) {
            const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
            const [fimHoras, fimMinutos] = horaFim.split(':').map(Number);

            let diferencaHoras = fimHoras - inicioHoras;
            let diferencaMinutos = fimMinutos - inicioMinutos;

            if (diferencaMinutos < 0) {
                diferencaHoras--;
                diferencaMinutos += 60;
            }

            if (diferencaHoras < 0) {
                diferencaHoras += 24;
            }

            return diferencaHoras + diferencaMinutos / 60;
        },

        atualizarTabelaHistorico(dados) {
            const historicoCorpo = document.getElementById('historicoCorpo');
            historicoCorpo.innerHTML = '';

            dados.forEach((registro, index) => {
                const horasTrabalhadas = this.calcularHorasTrabalhadas(registro.horaInicio, registro.horaFim);
                const ganhoPorKm = (parseFloat(registro.valorGanho) / parseFloat(registro.kmRodado)).toFixed(2);
                const ganhoPorHora = (parseFloat(registro.valorGanho) / horasTrabalhadas).toFixed(2);

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="py-2 px-4 border-b">${registro.data}</td>
                    <td class="py-2 px-4 border-b">${registro.valorGanho}</td>
                    <td class="py-2 px-4 border-b">${registro.horaInicio}</td>
                    <td class="py-2 px-4 border-b">${registro.horaFim}</td>
                    <td class="py-2 px-4 border-b">${registro.kmRodado}</td>
                    <td class="py-2 px-4 border-b">R$ ${ganhoPorKm}</td>
                    <td class="py-2 px-4 border-b">R$ ${ganhoPorHora}</td>
                    <td class="py-2 px-4 border-b">${registro.consumoCarro}</td>
                    <td class="py-2 px-4 border-b">${registro.aluguelCarro}</td>
                    <td class="py-2 px-4 border-b">${registro.valorCombustivel}</td>
                    <td class="py-2 px-4 border-b">
                        <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="window.EarningsCalc.apagarRegistro(${index})">Apagar</button>
                    </td>
                `;
                historicoCorpo.appendChild(row);
            });
        },

        atualizarHistorico(dadosFiltrados = null) {
            const dadosParaExibir = dadosFiltrados || this.historico;
            this.atualizarTabelaHistorico(dadosParaExibir);

            const totais = dadosParaExibir.reduce((acc, registro) => {
                const horasTrabalhadas = this.calcularHorasTrabalhadas(registro.horaInicio, registro.horaFim);
                return {
                    valorTotal: acc.valorTotal + parseFloat(registro.valorGanho),
                    kmTotal: acc.kmTotal + parseFloat(registro.kmRodado),
                    lucroTotal: acc.lucroTotal + parseFloat(registro.lucroLiquido),
                    aluguelTotal: acc.aluguelTotal + parseFloat(registro.aluguelCarro),
                    horasTotal: acc.horasTotal + horasTrabalhadas,
                    combustivelGastoReais: acc.combustivelGastoReais + parseFloat(registro.custoCombustivel),
                    combustivelGastoLitros: acc.combustivelGastoLitros + (parseFloat(registro.kmRodado) / parseFloat(registro.consumoCarro)),
                    dias: acc.dias + 1
                };
            }, { valorTotal: 0, kmTotal: 0, lucroTotal: 0, aluguelTotal: 0, horasTotal: 0, combustivelGastoReais: 0, combustivelGastoLitros: 0, dias: 0 });

            const mediaHTML = `
                <div class="mt-4 p-4 bg-gray-100 rounded">
                    <h3 class="font-bold mb-2">Estatísticas ${dadosFiltrados ? 'do Período Filtrado' : 'Gerais'}</h3>
                    <p>Total de Dias: ${totais.dias}</p>
                    <p>Media Ganho por KM: R$ ${(totais.valorTotal / totais.kmTotal).toFixed(2)}</p>
                    <p>Media Ganho por HORA: R$ ${(totais.valorTotal / totais.horasTotal).toFixed(2)}</p>
                    <p>Total Aluguel do Carro: R$ ${totais.aluguelTotal.toFixed(2)}</p>
                    <p>Total de Horas Trabalhadas: ${totais.horasTotal.toFixed(1)} horas</p>
                    <p>Total de KM Rodado: ${totais.kmTotal.toFixed(1)} km</p>
                    <p>Total de Combustível gasto: R$ ${totais.combustivelGastoReais.toFixed(2)} (${totais.combustivelGastoLitros.toFixed(1)} litros)</p>
                    <p>Lucro: R$ ${totais.lucroTotal.toFixed(2)}</p>
                </div>
            `;

            const estatisticasDiv = document.querySelector('#historico .mt-4');
            if (estatisticasDiv) {
                estatisticasDiv.remove();
            }
            document.querySelector('#historico').insertAdjacentHTML('beforeend', mediaHTML);
        },

        filtrarHistorico() {
            const inicio = new Date(document.getElementById('filtroInicio').value);
            const fim = new Date(document.getElementById('filtroFim').value);

            if (isNaN(inicio.getTime()) || isNaN(fim.getTime())) {
                alert('Por favor, selecione datas válidas para o filtro.');
                return;
            }

            const historicoFiltrado = this.historico.filter(registro => {
                const data = new Date(registro.data);
                return data >= inicio && data <= fim;
            });

            this.atualizarHistorico(historicoFiltrado);
        },

        limparFiltro() {
            document.getElementById('filtroInicio').value = '';
            document.getElementById('filtroFim').value = '';
            this.atualizarHistorico();
        },

        apagarRegistro(index) {
            if (confirm('Tem certeza que deseja apagar este registro?')) {
                this.historico.splice(index, 1);
                localStorage.setItem('historico', JSON.stringify(this.historico));
                this.atualizarHistorico();
            }
        },

        calcularEstimativas() {
            const lucroDesejado = parseFloat(document.getElementById('lucroDesejado').value);
            const aluguel = parseFloat(document.getElementById('aluguelDiario').value) || 0;
            const prestacao = parseFloat(document.getElementById('prestacaoDiaria').value) || 0;
            const despesasMedias = parseFloat(document.getElementById('despesasMedias').value) || 0;
            const despesasDiarias = parseFloat(document.getElementById('despesasDiariasEstimativas').value) || 0;
            const consumo = parseFloat(document.getElementById('consumoCarroEstimativas').value);
            const combustivel = parseFloat(document.getElementById('valorCombustivelEstimativas').value);
            const horas = parseFloat(document.getElementById('horasTrabalho').value);
            const km = parseFloat(document.getElementById('kmDia').value);
            const diasSemana = parseInt(document.getElementById('diasSemana').value);

            if (consumo <= 0 || combustivel <= 0 || horas <= 0 || km <= 0 || diasSemana < 1 || diasSemana > 7) {
                alert('Por favor, preencha todos os campos obrigatórios com valores válidos.');
                return;
            }

            const litrosNecessarios = km / consumo;
            const custoCombustivel = litrosNecessarios * combustivel;
            const totalDespesas = aluguel + prestacao + despesasMedias + despesasDiarias + custoCombustivel;
            const valorBruto = lucroDesejado + totalDespesas;
            const valorPorKm = valorBruto / km;
            const valorPorHora = valorBruto / horas;
            const lucroSemanal = lucroDesejado * diasSemana;

            document.getElementById('valorKm').textContent = `R$ ${valorPorKm.toFixed(2)}`;
            document.getElementById('valorHora').textContent = `R$ ${valorPorHora.toFixed(2)}`;
            document.getElementById('totalDespesas').textContent = `R$ ${totalDespesas.toFixed(2)}`;
            document.getElementById('valorBruto').textContent = `R$ ${valorBruto.toFixed(2)}`;
            document.getElementById('lucroLiquido').textContent = `R$ ${lucroDesejado.toFixed(2)}`;
            document.getElementById('lucroSemanal').textContent = `R$ ${lucroSemanal.toFixed(2)} (${diasSemana} dias)`;

            document.getElementById('resultadoEstimativas').classList.remove('hidden');
        }
    };

    // Expose functions to global scope for inline onclick handlers
    window.mostrarCalculadora = () => window.EarningsCalc.mostrarCalculadora();
    window.mostrarHistorico = () => window.EarningsCalc.mostrarHistorico();
    window.mostrarCustoKM = () => window.EarningsCalc.mostrarCustoKM();
    window.mostrarEstimativas = () => window.EarningsCalc.mostrarEstimativas();
    window.calcularCustoKM = () => window.EarningsCalc.calcularCustoKM();
    window.validarEntradas = () => window.EarningsCalc.validarEntradas();
    window.calcularGanhos = () => window.EarningsCalc.calcularGanhos();
    window.salvarDados = () => window.EarningsCalc.salvarDados();
    window.limparFiltro = () => window.EarningsCalc.limparFiltro();
    window.filtrarHistorico = () => window.EarningsCalc.filtrarHistorico();
    window.apagarRegistro = (index) => window.EarningsCalc.apagarRegistro(index);
    window.calcularEstimativas = () => window.EarningsCalc.calcularEstimativas();

    // Initialize historico display on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        window.EarningsCalc.atualizarHistorico();
    });
})();
