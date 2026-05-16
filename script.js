function copyCode(button) {

    const code =
        button.parentElement
        .querySelector(".code-example")
        .innerText;

    const textarea =
        document.createElement("textarea");

    textarea.value = code;

    document.body.appendChild(textarea);

    textarea.select();

    document.execCommand("copy");

    document.body.removeChild(textarea);

    button.innerText = "✓";

    setTimeout(() => {

        button.innerText = "⧉";

    }, 1000);
}


        let pyodide;
        let editor;

        async function start() {

            pyodide = await loadPyodide();
            await pyodide.runPythonAsync(`
import sys
sys.stdout = sys.__stdout__
`);

            document.getElementById("output").innerText =
                "Python waiting 🚀";

            require.config({
                paths: {
                    vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.44.0/min/vs'
                }
            });

            require(["vs/editor/editor.main"], function () {

                editor = monaco.editor.create(
                    document.getElementById("editor"),
                    {

                        value:
`print("Bem-vindo ao PyLab 🚀")

for i in range(5):
    print("Linha:", i)
`,

                        language: "python",

                        theme: "vs-dark",

                        automaticLayout: true,

                        minimap: {
                            enabled: false
                        },

                        fontSize: 16,

                        roundedSelection: true,

                        scrollBeyondLastLine: false,

                        smoothScrolling: true,

                        tabSize: 4,

                        insertSpaces: true,

                        wordWrap: "on",

                        contextmenu: true,

                        quickSuggestions: true,

                        mouseWheelZoom: true,

                        copyWithSyntaxHighlighting: true,

                        multiCursorModifier: "ctrlCmd"

                    }
                );

            });

        }

        start();

        function toggleDictionary() {

            document
                .getElementById("sidebar")
                .classList
                .toggle("open");
        }

        function toggleExamples() {

            document
                .getElementById("examplesSidebar")
                .classList
                .toggle("open");
        }

        function clearEditor() {

            editor.setValue("");

            document.getElementById("output").innerText =
                "Terminal limpo.";
        }

async function runPython() {

    const code = editor.getValue();
    const output = document.getElementById("output");

    output.innerText = "Executando...";

    try {
        await pyodide.runPythonAsync(`
import sys
from io import StringIO

_output = StringIO()
_sys_stdout_original = sys.stdout
sys.stdout = _output
        `);

        await pyodide.runPythonAsync(code);

        const result = await pyodide.runPythonAsync(`
sys.stdout.getvalue()
        `);

        await pyodide.runPythonAsync(`
sys.stdout = _sys_stdout_original
        `);

        output.innerText = result || "Código executado sem saída.";

    } catch (err) {
        output.innerText = err;

        // garante reset mesmo em erro
        try {
            await pyodide.runPythonAsync("sys.stdout = sys.__stdout__");
        } catch (e) {}
    }
}

function gerarExercicio() {

    const exercicios = [

`Crie um programa que:

1. Faça um loop de 1 até 10
2. Mostre apenas números pares`,

`Crie uma função chamada soma()

Ela deve:
1. Receber 2 números
2. Retornar a soma deles`,

`Crie uma lista com 5 frutas
e mostre cada fruta usando for`,

`Crie um programa que:

1. Receba um número
2. Verifique se é par ou ímpar`,

`Crie uma classe Pessoa com:

- nome
- idade
- método apresentar()`,

`Crie um programa que:

1. Conte de 10 até 1
2. Mostre "BOOM"`,

`Crie um dicionário com:

nome
idade
cidade

Depois mostre os valores.`,

`Crie um programa que:

1. Some todos os números de 1 até 100
2. Mostre o resultado`,

`Crie uma função que:

1. Receba uma palavra
2. Retorne ela invertida`,

`Crie um programa que:

1. Verifique se uma palavra é palíndromo`,

`Crie uma lista de números

Depois:
1. Mostre o maior número
2. Mostre o menor número`,

`Crie um programa que:

1. Peça uma senha
2. Continue pedindo até acertar`,

`Crie uma tabuada do número 7 usando for`,

`Crie um programa que:

1. Conte quantas vogais existem em uma palavra`,

`Crie uma função que:

1. Receba Celsius
2. Converta para Fahrenheit`,

`Crie um programa que:

1. Gere os 10 primeiros números Fibonacci`,

`Crie um programa que:

1. Verifique se um número é primo`,

`Crie um programa que:

1. Remova números duplicados de uma lista`,

`Crie uma classe Animal

Depois:
1. Crie Cachorro herdando Animal
2. Faça um método falar()`,

`Crie um programa que:

1. Ordene uma lista usando Bubble Sort`,

`Crie um programa que:

1. Conte quantas vezes cada letra aparece em uma palavra`,

`Crie um programa que:

1. Leia uma frase
2. Mostre quantas palavras ela possui`,

`Crie uma calculadora simples com:

+
-
*
/`,

`Crie um programa que:

1. Gere um número aleatório
2. Faça o usuário tentar adivinhar`,

`Crie um programa que:

1. Mostre todos os números pares de 1 até 50`,

`Crie uma função recursiva para calcular fatorial`,

`Crie um programa que:

1. Some apenas números ímpares de uma lista`,

`Crie um sistema simples de banco com:

- saldo
- sacar
- depositar`,

`Crie um programa que:

1. Converta texto para MAIÚSCULO`,

`Crie um programa que:

1. Leia nomes
2. Armazene em lista
3. Mostre em ordem alfabética`

    ];

    const aleatorio = Math.floor(
        Math.random() * exercicios.length
    );

    document.getElementById("resultado").innerText =
        exercicios[aleatorio];
}

window.runPython = runPython;
window.clearEditor = clearEditor;
window.toggleDictionary = toggleDictionary;
window.toggleExamples = toggleExamples;
window.copyCode = copyCode;
window.gerarExercicio = gerarExercicio;

window.addEventListener("load", () => {

    const aiWindow = document.getElementById("aiWindow");
    const aiHeader = document.getElementById("aiHeader");

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;

    aiHeader.addEventListener("mousedown", (e) => {

        dragging = true;

        offsetX = e.clientX - aiWindow.offsetLeft;
        offsetY = e.clientY - aiWindow.offsetTop;

    });

    document.addEventListener("mousemove", (e) => {

        if (!dragging) return;

        aiWindow.style.left =
            (e.clientX - offsetX) + "px";

        aiWindow.style.top =
            (e.clientY - offsetY) + "px";

        aiWindow.style.bottom = "auto";

    });

    document.addEventListener("mouseup", () => {

        dragging = false;

    });

});

function toggleAI() {

    const ai =
        document.getElementById("aiWindow");

    if (ai.style.display === "block") {

        ai.style.display = "none";

    } else {

        ai.style.display = "block";

    }
}

window.toggleAI = toggleAI;

document.addEventListener("click", (e) => {

    const sidebar =
        document.getElementById("sidebar");

    const examplesSidebar =
        document.getElementById("examplesSidebar");

    const pyDocsButton =
        document.querySelector('[onclick="toggleDictionary()"]');

    const examplesButton =
        document.querySelector('[onclick="toggleExamples()"]');

    // PYDOCS
    if (
        sidebar.classList.contains("open") &&
        !sidebar.contains(e.target) &&
        !pyDocsButton.contains(e.target)
    ) {

        sidebar.classList.remove("open");
    }

    // CODE EXAMPLES
    if (
        examplesSidebar.classList.contains("open") &&
        !examplesSidebar.contains(e.target) &&
        !examplesButton.contains(e.target)
    ) {

        examplesSidebar.classList.remove("open");
    }

});


async function corrigirCodigo(codigo, erro) {

    const resposta = await fetch(
        "https://pylab-api.onrender.com/ai",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                codigo,
                erro
            })
        }
    );

    const dados = await resposta.json();

    return dados.resposta;
}

    const dados = await resposta.json();

    return dados.resposta;
}
