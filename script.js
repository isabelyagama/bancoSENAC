//teste - commit
// =====================================================================
// 1. DADOS EM MEMORIA
// =====================================================================
const clientes = [
    { cpf: "111.222.333-44", senha: "123", nome: "Dennis Lopes", saldo: 5000 },
    { cpf: "222.333.444-55", senha: "123", nome: "Nicolas Silva", saldo: 1500 },
    { cpf: "333.444.555-66", senha: "123", nome: "Ana Maria", saldo: 3000 },
    { cpf: "444.555.666-77", senha: "123", nome: "Bruno Costa", saldo: 500 },
    { cpf: "555.666.777-88", senha: "123", nome: "Carla Souza", saldo: 10000 }
];

let usuarioLogado = null;

// =====================================================================
// 2. SELECAO DE ELEMENTOS (DOM)  -> declarados UMA vez so
// =====================================================================
const secaoLogin = document.querySelector('#login-section');
const secaoCadastro = document.querySelector('#cadastro-section');
const secaoSucesso = document.querySelector('#sucesso-section');
const secaoPainel = document.querySelector('#painel-section');

const campoSaldo = document.querySelector('#saldo-valor');
const boasVindas = document.querySelector('#boas-vindas');
const loginErro = document.querySelector('#login-erro');

const formCadastro = document.querySelector('#form-cadastro');
const CHAVE_RASCUNHO = 'senac_rascunho_cadastro';

// =====================================================================
// FUNCOES AUXILIARES DE COOKIES
// =====================================================================
function salvarCookie(nome, valor, dias) {
    const d = new Date();
    d.setTime(d.getTime() + (dias * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + d.toUTCString();
    document.cookie = nome + '=' + encodeURIComponent(valor) + ';' + expires + ';path=/';
}

function lerCookie(nome) {
    const nameEQ = nome + '=';
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) {
            return decodeURIComponent(c.substring(nameEQ.length, c.length));
        }
    }
    return null;
}

function apagarCookie(nome) {
    document.cookie = nome + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
}

function escaparHTML(texto) {
    const div = document.createElement('div');
    div.textContent = texto;
    return div.innerHTML;
}

// =====================================================================
// 3. ALTERNANCIA ENTRE TELAS (Login <-> Cadastro)
// =====================================================================
document.querySelector('#link-ir-cadastro').addEventListener('click', (e) => {
    e.preventDefault();
    secaoLogin.style.display = 'none';
    secaoCadastro.style.display = 'block';
});

document.querySelector('#link-voltar-login').addEventListener('click', (e) => {
    e.preventDefault();
    secaoCadastro.style.display = 'none';
    secaoLogin.style.display = 'block';
});

// =====================================================================
// 4. LOGIN (ja com gravacao de cookies - substitui o login antigo)
// =====================================================================
document.querySelector('#btn-login').addEventListener('click', () => {
    const cpfDigitado = document.querySelector('#input-cpf').value.trim();
    const senhaDigitada = document.querySelector('#input-senha').value.trim();

    const clienteEncontrado = clientes.find(
        c => c.cpf === cpfDigitado && c.senha === senhaDigitada
    );

    if (clienteEncontrado) {
        usuarioLogado = clienteEncontrado;
        loginErro.style.display = 'none';

        const primeiroNome = clienteEncontrado.nome.split(' ')[0];
        const agora = new Date().toLocaleString('pt-BR');

        salvarCookie('senac_cpf', clienteEncontrado.cpf, 30);
        salvarCookie('senac_nome', primeiroNome, 30);
        salvarCookie('senac_ultimo_acesso', agora, 30);

        secaoLogin.style.display = 'none';
        secaoPainel.style.display = 'block';

        campoSaldo.textContent = `R$ ${usuarioLogado.saldo.toFixed(2)}`;
        boasVindas.textContent = `Olá, ${usuarioLogado.nome}`;
    } else {
        loginErro.style.display = 'block';
    }
});

// =====================================================================
// 5. VALIDACAO DO CADASTRO COM REGEX
// Ids de senha assumidos: #cad-senha e #cad-confirmar-senha
// =====================================================================
const REGEX_NOME = /^[A-Za-z\u00C0-\u00FF ]{3,}$/;
const REGEX_CPF = /^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/;          // mesmo formato do array clientes
const REGEX_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REGEX_CELULAR = /^\(?[0-9]{2}\)?\s?9[0-9]{4}-?[0-9]{4}$/;       // (11) 91234-5678 ou 11912345678
const REGEX_CEP = /^[0-9]{5}-?[0-9]{3}$/;                              // 01234-567 ou 01234567
const REGEX_ENDERECO = /^.{5,}$/;
const REGEX_CIDADE = /^[A-Za-z\u00C0-\u00FF ]{2,}$/;
const REGEX_ESTADO = /^[A-Za-z]{2}$/;                                  // UF, ex: SP
const REGEX_SENHA = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,}$/;

const camposCadastro = [
    { id: 'cad-nome', regex: REGEX_NOME, msg: 'Informe o nome (apenas letras e espaços).' },
    { id: 'cad-cpf', regex: REGEX_CPF, msg: 'Use o formato 000.000.000-00.' },
    { id: 'cad-email', regex: REGEX_EMAIL, msg: 'Informe um e-mail válido.' },
    { id: 'cad-celular', regex: REGEX_CELULAR, msg: 'Use o formato (11) 91234-5678.' },
    { id: 'cad-cep', regex: REGEX_CEP, msg: 'Use o formato 00000-000.' },
    { id: 'cad-endereco', regex: REGEX_ENDERECO, msg: 'Informe o endereço (mín. 5 caracteres).' },
    { id: 'cad-cidade', regex: REGEX_CIDADE, msg: 'Use apenas letras e espaços.' },
    { id: 'cad-estado', regex: REGEX_ESTADO, msg: 'Informe a UF com 2 letras (ex: SP).' },
    { id: 'cad-senha', regex: REGEX_SENHA, msg: 'Mín. 8 caracteres, 1 maiúscula, 1 minúscula e 1 número.' }
];

function mostrarErro(input, mensagem) {
    let aviso = input.parentElement.querySelector('.erro-campo[data-para="' + input.id + '"]');
    if (!aviso) {
        aviso = document.createElement('small');
        aviso.className = 'erro-campo';
        aviso.dataset.para = input.id;
        aviso.style.color = 'red';
        aviso.style.display = 'block';
        input.insertAdjacentElement('afterend', aviso);
    }
    aviso.textContent = mensagem;
    input.style.borderColor = 'red';
}

function limparErros() {
    formCadastro.querySelectorAll('.erro-campo').forEach(el => el.remove());
    formCadastro.querySelectorAll('input, select').forEach(el => el.style.borderColor = '');
}

function validarCadastro() {
    limparErros();
    let valido = true;

    camposCadastro.forEach(campo => {
        const input = document.getElementById(campo.id);
        if (!input) return;
        const valor = input.value.trim();

        if (valor === '') {
            mostrarErro(input, 'Campo obrigatório.');
            valido = false;
        } else if (!campo.regex.test(valor)) {
            mostrarErro(input, campo.msg);
            valido = false;
        }
    });

    // Confirmacao de senha
    const senha = document.getElementById('cad-senha');
    const confirmar = document.getElementById('cad-confirmar-senha');
    if (senha && confirmar && senha.value !== confirmar.value) {
        mostrarErro(confirmar, 'As senhas não coincidem.');
        valido = false;
    }

    return valido;
}

// Submissao: valida -> limpa rascunho -> reseta -> mostra sucesso
formCadastro.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validarCadastro()) {
        return; // fica na tela com os erros exibidos
    }

    localStorage.removeItem(CHAVE_RASCUNHO);
    formCadastro.reset();

    secaoCadastro.style.display = 'none';
    secaoSucesso.style.display = 'block';
});

// =====================================================================
// RASCUNHO COM LOCALSTORAGE (senhas NAO sao salvas)
// =====================================================================
formCadastro.addEventListener('input', () => {
    const dadosRascunho = {
        dados: {
            nome: document.querySelector('#cad-nome').value,
            cpf: document.querySelector('#cad-cpf').value,
            email: document.querySelector('#cad-email').value,
            celular: document.querySelector('#cad-celular').value,
            cep: document.querySelector('#cad-cep').value,
            endereco: document.querySelector('#cad-endereco').value,
            cidade: document.querySelector('#cad-cidade').value,
            estado: document.querySelector('#cad-estado').value
        },
        timestamp: new Date().getTime()
    };
    localStorage.setItem(CHAVE_RASCUNHO, JSON.stringify(dadosRascunho));
});

document.addEventListener('DOMContentLoaded', () => {
    const rascunhoSalvo = localStorage.getItem(CHAVE_RASCUNHO);
    if (!rascunhoSalvo) return;

    try {
        const d = JSON.parse(rascunhoSalvo).dados || {};
        document.querySelector('#cad-nome').value = d.nome || '';
        document.querySelector('#cad-cpf').value = d.cpf || '';
        document.querySelector('#cad-email').value = d.email || '';
        document.querySelector('#cad-celular').value = d.celular || '';
        document.querySelector('#cad-cep').value = d.cep || '';
        document.querySelector('#cad-endereco').value = d.endereco || '';
        document.querySelector('#cad-cidade').value = d.cidade || '';
        document.querySelector('#cad-estado').value = d.estado || '';
        console.log('Rascunho de cadastro recuperado com sucesso!');
    } catch (erro) {
        console.warn('Rascunho inválido, descartando.', erro);
        localStorage.removeItem(CHAVE_RASCUNHO);
    }
});

const btnLimparRascunho = document.querySelector('#link-limpar-rascunho');
if (btnLimparRascunho) {
    btnLimparRascunho.addEventListener('click', (e) => {
        e.preventDefault();
        if (confirm('Deseja realmente descartar o rascunho do cadastro?')) {
            localStorage.removeItem(CHAVE_RASCUNHO);
            formCadastro.reset();
            limparErros();
        }
    });
}

// =====================================================================
// RECONHECIMENTO DO CLIENTE (cookies) NA INICIALIZACAO
// =====================================================================
function verificarReconhecimento() {
    const cpfSalvo = lerCookie('senac_cpf');
    const nomeSalvo = lerCookie('senac_nome');
    const ultimoAcesso = lerCookie('senac_ultimo_acesso');
    const subtitulo = document.querySelector('#login-section .subtitle');

    if (cpfSalvo && nomeSalvo) {
        document.querySelector('#input-cpf').value = cpfSalvo;

        subtitulo.innerHTML = `Que bom ter você de volta, <strong>${escaparHTML(nomeSalvo)}</strong>!<br>
            <small style="color: #6c757d;">Último acesso: ${escaparHTML(ultimoAcesso || '')}</small><br>
            <a href="#" id="link-trocar-usuario" style="font-size: 0.75rem; color: #0056b3; font-weight: bold;">
                Não é você? Trocar de conta
            </a>`;

        document.querySelector('#input-senha').focus();

        document.querySelector('#link-trocar-usuario').addEventListener('click', (e) => {
            e.preventDefault();
            apagarCookie('senac_cpf');
            apagarCookie('senac_nome');
            apagarCookie('senac_ultimo_acesso');

            document.querySelector('#input-cpf').value = '';
            document.querySelector('#input-senha').value = '';
            subtitulo.textContent = 'Portal do Cliente';
            document.querySelector('#input-cpf').focus();
        });
    }
}

window.addEventListener('DOMContentLoaded', () => {
    verificarReconhecimento();
});

// =====================================================================
// 6. VOLTAR AO INICIO A PARTIR DA TELA DE SUCESSO
// =====================================================================
document.querySelector('#btn-voltar-inicio').addEventListener('click', () => {
    location.reload();
});

// =====================================================================
// 7. OPERACOES BANCARIAS (reservado para as proximas aulas / API)
// =====================================================================
document.querySelector('#btn-depositar').addEventListener('click', () => { });
document.querySelector('#btn-sacar').addEventListener('click', () => { });
document.querySelector('#btn-transferir').addEventListener('click', () => { });

document.querySelector('#btn-sair').addEventListener('click', () => {
    location.reload();
});
