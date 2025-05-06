(() => {
    window.EarningsCalc = {
        historico: JSON.parse(localStorage.getItem('historico')) || [],

        mostrarCalculadora() {
            document.getElementById('calculadora').classList.remove('hidden');
            document.getElementById('historico').classList.add('hidden');
            document.getElementById('custoKM').classList.add('hidden');
            document.getElementById('estimativas').classList.add('hidden');
            document.getElementById('custoDiario').classList.add('hidden');
        },

        mostrarHistorico() {
            document.getElementById('calculadora').classList.add('hidden');
            document.getElementById('historico').classList.remove('hidden');
            document.getElementById('custoKM').classList.add('hidden');
            document.getElementById('estimativas').classList.add('hidden');
            document.getElementById('custoDiario').classList.add('hidden');
            this.atualizarHistorico();
        },

        mostrarCustoKM() {
            document.getElementById('calculadora').classList.add('hidden');
            document.getElementById('historico').classList.add('hidden');
            document.getElementById('custoKM').classList.remove('hidden');
            document.getElementById('estimativas').classList.add('hidden');
            document.getElementById('custoDiario').classList.add('hidden');
        },

        mostrarEstimativas() {
            document.getElementById('calculadora').classList.add('hidden');
            document.getElementById('historico').classList.add('hidden');
            document.getElementById('custoKM').classList.add('hidden');
            document.getElementById('estimativas').classList.remove('hidden');
            document.getElementById('custoDiario').classList.add('hidden');
        },

        mostrarCustoDiario() {
            document.getElementById('calculadora').classList.add('hidden');
            document.getElementById('historico').classList.add('hidden');
            document.getElementById('custoKM').classList.add('hidden');
            document.getElementById('estimativas').classList.add('hidden');
            document.getElementById('custoDiario').classList.remove('hidden');
        },

        calcularCustoDiario() {
            const aluguelMensal = parseFloat(document.getElementById('aluguelMensal').value) || 0;
            const parcelaFinanciamento = parseFloat(document.getElementById('parcelaFinanciamento').value) || 0;
            const manutencaoMensal = parseFloat(document.getElementById('manutencaoMensal').value) || 0;
            const despesasMensais = parseFloat(document.getElementById('despesasMensais').value) || 0;
            const aluguelSemanal = parseFloat(document.getElementById('aluguelSemanal').value) || 0;

            if (aluguelMensal > 0 && aluguelSemanal > 0) {
                alert('Por favor, preencha apenas um dos campos: Aluguel Mensal ou Aluguel Semanal.');
                return;
            }

            let aluguelConvertidoMensal = aluguelMensal;
            if (aluguelSemanal > 0) {
                aluguelConvertidoMensal = (aluguelSemanal / 7) * 30;
            }

            const totalMensal = aluguelConvertidoMensal + parcelaFinanciamento + manutencaoMensal + despesasMensais;
            const custoDiario = totalMensal / 30;

            document.getElementById('resultadoCustoDiarioMensal').textContent = `R$ ${totalMensal.toFixed(2)}`;
            document.getElementById('resultadoCustoDiarioDiario').textContent = `R$ ${custoDiario.toFixed(2)}`;

            document.getElementById('resultadoCustoDiario').classList.remove('hidden');
        },

        // ... (restante do código EarningsCalc permanece inalterado)
    };

    // Expose functions to global scope for inline onclick handlers
    window.mostrarCalculadora = () => window.EarningsCalc.mostrarCalculadora();
    window.mostrarHistorico = () => window.EarningsCalc.mostrarHistorico();
    window.mostrarCustoKM = () => window.EarningsCalc.mostrarCustoKM();
    window.mostrarEstimativas = () => window.EarningsCalc.mostrarEstimativas();
    window.mostrarCustoDiario = () => window.EarningsCalc.mostrarCustoDiario();
    window.calcularCustoDiario = () => window.EarningsCalc.calcularCustoDiario();

    // Initialize historico display on DOMContentLoaded
    document.addEventListener('DOMContentLoaded', () => {
        window.EarningsCalc.atualizarTabelaHistorico();
    });
})();
