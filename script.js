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

const exerciseBank = {
    easy: [
        `Crie um programa que:\n\n1. Faça um loop de 1 até 10\n2. Mostre apenas números pares`,
        `Crie uma função chamada soma()\n\nEla deve:\n1. Receber 2 números\n2. Retornar a soma deles`,
        `Crie uma lista com 5 frutas\ne mostre cada fruta usando for`,
        `Crie um programa que:\n\n1. Receba um número\n2. Verifique se é par ou ímpar`,
        `Crie um programa que:\n\n1. Conte de 10 até 1\n2. Mostre "BOOM"`,
        `Crie um dicionário com:\n\nnome\nidade\ncidade\n\nDepois mostre os valores.`,
        `Crie uma tabuada do número 7 usando for`,
        `Crie um programa que:\n\n1. Mostre todos os números pares de 1 até 50`,
        `Crie uma função que:\n\n1. Receba uma palavra\n2. Retorne ela invertida`,
        `Crie um programa que:\n\n1. Verifique se uma palavra é palíndromo`,
        `Crie um programa que:\n\n1. Leia uma frase\n2. Mostre quantas palavras ela possui`
    ],
    medium: [
        `Crie uma classe Pessoa com:\n\n- nome\n- idade\n- método apresentar()`,
        `Crie um programa que:\n\n1. Some todos os números de 1 até 100\n2. Mostre o resultado`,
        `Crie uma lista de números\n\nDepois:\n1. Mostre o maior número\n2. Mostre o menor número`,
        `Crie um programa que:\n\n1. Peça uma senha\n2. Continue pedindo até acertar`,
        `Crie um programa que:\n\n1. Conte quantas vogais existem em uma palavra`,
        `Crie uma função que:\n\n1. Receba Celsius\n2. Converta para Fahrenheit`,
        `Crie um programa que:\n\n1. Gere um número aleatório\n2. Faça o usuário tentar adivinhar`,
        `Crie um programa que:\n\n1. Some apenas números ímpares de uma lista`,
        `Crie um sistema simples de banco com:\n\n- saldo\n- sacar\n- depositar`,
        `Crie um programa que:\n\n1. Converta texto para MAIÚSCULO`
    ],
    hard: [
        `Crie uma classe Animal\n\nDepois:\n1. Crie Cachorro herdando Animal\n2. Faça um método falar()`,
        `Crie um programa que:\n\n1. Ordene uma lista usando Bubble Sort`,
        `Crie um programa que:\n\n1. Conte quantas vezes cada letra aparece em uma palavra`,
        `Crie uma função recursiva para calcular fatorial`,
        `Crie um programa que:\n\n1. Verifique se um número é primo`,
        `Crie um programa que:\n\n1. Remova números duplicados de uma lista`,
        `Crie um programa que:\n\n1. Leia nomes\n2. Armazene em lista\n3. Mostre em ordem alfabética`,
        `Crie uma calculadora simples com:\n\n+\n-\n*\n/`,
        `Crie um programa que:\n\n1. Leia uma lista de nomes\n2. Mostre apenas os nomes que começam com a letra A`
    ]
};

function getRandomItem(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function setAIOutput(text) {
    document.getElementById("resultado").innerText = text;
}

function generateExercise() {
    const level = document.getElementById("aiLevel").value;
    const pool = exerciseBank[level] || exerciseBank.easy;
    const label = level === "easy" ? "Fácil" : level === "medium" ? "Médio" : "Difícil";
    setAIOutput(`Exercício (${label}):\n\n${getRandomItem(pool)}`);
}

function analyzeCode() {
    const code = editor.getValue();
    setAIOutput(analyzePython(code));
}

function analyzePython(code) {
    if (!code.trim()) {
        return "Cole seu código no editor para receber uma análise da IA.";
    }

    const normalized = code.replace(/\r\n/g, "\n");
    const lines = normalized.split("\n");
    const tips = [];

    const checks = {
        hasPrint: /\bprint\s*\(/.test(code),
        hasDef: /^\s*def\s+\w+\s*\(/m.test(code),
        hasClass: /^\s*class\s+\w+/m.test(code),
        hasIf: /^\s*if\s+.+:/m.test(code),
        hasLoop: /^\s*(for|while)\s+.+:/m.test(code),
        hasInput: /\binput\s*\(/.test(code),
        hasComparison: /==|!=|<=|>=|<|>/.test(code),
        hasMath: /\b\d+\s*[-+*/%]/.test(code) || /[-+*/%]\s*\d+/.test(code),
        hasList: /\[.*\]/.test(code),
        hasDict: /\{.*\}/.test(code),
        hasRecursion: /\bdef\s+(\w+)\s*\(.*\):[\s\S]*\breturn\s+\1\s*\(/m.test(code),
        whileTrue: /^\s*while\s+True\s*:/m.test(code)
    };

    let score = 0;
    if (checks.hasPrint) score += 1;
    if (checks.hasDef) score += 1;
    if (checks.hasClass) score += 2;
    if (checks.hasLoop) score += 1;
    if (checks.hasIf) score += 1;
    if (checks.hasList || checks.hasDict) score += 1;
    if (checks.hasRecursion) score += 2;

    if (!checks.hasPrint) tips.push("Use `print()` para ver o resultado do seu código durante os testes.");
    if (!checks.hasDef) tips.push("Agrupe código repetido em funções usando `def`.");
    if (!checks.hasClass) tips.push("Se for um projeto maior, classes podem ajudar na organização.");
    if (!checks.hasLoop && checks.hasIf) tips.push("Um laço `for` ou `while` pode ajudar em tarefas de repetição.");
    if (!checks.hasInput) tips.push("Use `input()` para tornar seu programa interativo com o usuário.");
    if (checks.whileTrue) tips.push("Tenha certeza de que `while True:` tem uma condição de saída para evitar loop infinito.");
    if (checks.hasInput && /\binput\s*\([^)]*\)/.test(code) && !/\b(int|float)\s*\(/.test(code)) {
        tips.push("Quando usar `input()`, lembre-se que ele sempre retorna texto. Converta para `int()` ou `float()` se precisar de números.");
    }
    if (checks.hasRecursion) tips.push("Recursão precisa de uma condição base clara para parar a chamada recursiva.");

    const indentProblems = lines.some(line => {
        const leading = line.match(/^\s+/);
        return leading && leading[0].length % 4 !== 0;
    });
    if (indentProblems) {
        tips.push("Verifique a indentação: no Python, o padrão recomendado é 4 espaços por nível.");
    }

    if (!checks.hasComparison && !checks.hasIf && !checks.hasLoop && !checks.hasDef && !checks.hasClass) {
        tips.push("Tente usar `if`, `for`, `while` ou `def` para explorar conceitos diferentes.");
    }

    const level = score <= 2 ? "Iniciante" : score <= 5 ? "Intermediário" : "Avançado";
    const summary = [`Avaliação rápida: ${level}`];

    if (tips.length) {
        summary.push("\nDicas:");
        tips.slice(0, 6).forEach((tip, index) => {
            summary.push(`${index + 1}. ${tip}`);
        });
    } else {
        summary.push("\nSeu código parece bem organizado! Experimente adicionar comentários e testar casos extras.");
    }

    if (checks.hasLoop && checks.hasIf && checks.hasDef) {
        summary.push("\nBoa! Você já usa estruturas importantes como funções, loops e condições.");
    }

    return summary.join("\n");
}

function gerarExercicio() {
    generateExercise();
}

window.runPython = runPython;
window.clearEditor = clearEditor;
window.toggleDictionary = toggleDictionary;
window.toggleExamples = toggleExamples;
window.copyCode = copyCode;
window.gerarExercicio = gerarExercicio;
window.analyzeCode = analyzeCode;
window.generateExercise = generateExercise;

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
