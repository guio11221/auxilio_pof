// Obtendo referências para os elementos HTML
const studentForm = document.getElementById("studentForm");
const studentsBody = document.getElementById("studentsBody");
const totalStudentsElement = document.getElementById("totalStudents");
const searchStudentInput = document.getElementById("searchStudent");
const studentReportDetailsDiv = document.getElementById("studentReportDetails");
// Recuperando a lista de alunos do Local Storage ou inicializando como um array vazio
let students = JSON.parse(localStorage.getItem("students") || "[]");
/**
 * Função para mostrar uma seção específica da página e esconder as outras.
 * @param {string} id - O ID da seção a ser mostrada.
 */
function showSection(id) {
    // Esconde todas as seções da página
    document.querySelectorAll("section").forEach(s => s.classList.add("hidden"));
    // Remove a classe 'hidden' da seção com o ID especificado, tornando-a visível
    document.getElementById(id).classList.remove("hidden");
    // Atualiza a contagem de alunos e exibe todos os relatórios na seção de relatórios quando ela é mostrada
    if (id === 'reportsSection') {
        updateTotalStudents();
        displayAllStudentReports();
    }
}
/**
 * Função para renderizar a tabela de alunos com os dados armazenados.
 */
function renderTable() {
    // Limpa o conteúdo atual do corpo da tabela
    studentsBody.innerHTML = "";
    // Itera sobre cada aluno no array 'students'
    students.forEach((aluno, index) => {
        // Cria uma nova linha de tabela (<tr>) para cada aluno
        const tr = document.createElement("tr");
        // Define o conteúdo HTML da linha da tabela com os dados do aluno e os botões de ação
        tr.innerHTML = `
                    <td>${aluno.nome}</td>
                    <td>${aluno.turma || ''}</td>
                    <td>${aluno.escola || ''}</td>
                    <td>
                        <button class="btn btn-sm btn-warning me-1" onclick="openEditModal(${index})">Editar</button>
                        <button class="btn btn-sm btn-danger" onclick="deleteStudent(${index})">Excluir</button>
                    </td>
                `;
        // Adiciona a linha da tabela ao corpo da tabela
        studentsBody.appendChild(tr);
    });
    // Salva a lista atualizada de alunos no Local Storage
    localStorage.setItem("students", JSON.stringify(students));
    // Atualiza a contagem de alunos (útil se a seção de relatórios estiver visível)
    updateTotalStudents();
}
/**
 * Event listener para o envio do formulário de adicionar aluno.
 * @param {Event} e - O objeto do evento de submit.
 */
studentForm.onsubmit = e => {
    // Previne o comportamento padrão de submit do formulário (recarregar a página)
    e.preventDefault();
    // Obtém os valores dos campos de nome, turma, escola e descrição, removendo espaços em branco extras
    const nome = document.getElementById("studentName").value.trim();
    const turma = document.getElementById("studentClass").value.trim();
    const escola = document.getElementById("studentSchool").value.trim();
    const descricao = document.getElementById("studentDescription").value.trim();
    // Verifica se o campo obrigatório está preenchido
    if (nome) {
        // Adiciona um novo objeto de aluno ao array 'students' com as novas propriedades
        students.push({
            nome,
            turma,
            escola,
            descricao
        });
        // Reseta o formulário para limpar os campos
        studentForm.reset();
        // Renderiza a tabela para exibir o novo aluno
        renderTable();
    } else {
        alert("Nome é um campo obrigatório.");
    }
}
/**
 * Função para remover um aluno da lista.
 * @param {number} index - O índice do aluno a ser removido.
 */
function deleteStudent(index) {
    // Exibe um diálogo de confirmação antes de remover o aluno
    if (confirm("Deseja remover este aluno?")) {
        // Remove o aluno no índice especificado do array 'students'
        students.splice(index, 1);
        // Renderiza a tabela para refletir a remoção
        renderTable();
    }
}
/**
 * Função para abrir o modal de edição com os dados do aluno selecionado.
 * @param {number} index - O índice do aluno a ser editado.
 */
function openEditModal(index) {
    // Obtém o objeto do aluno com o índice especificado
    const aluno = students[index];
    // Define o valor do campo oculto 'editIndex' com o índice do aluno
    document.getElementById("editIndex").value = index;
    // Define os valores dos campos do modal com os dados do aluno
    document.getElementById("editName").value = aluno.nome;
    document.getElementById("editClass").value = aluno.turma || '';
    document.getElementById("editSchool").value = aluno.escola || '';
    document.getElementById("editDescription").value = aluno.descricao || '';
    // Cria e exibe uma instância do modal de edição
    new bootstrap.Modal(document.getElementById("editModal")).show();
}
/**
 * Event listener para o envio do formulário de edição no modal.
 */
document.getElementById("editForm").onsubmit = function (e) {
    // Previne o comportamento padrão de submit do formulário
    e.preventDefault();
    // Obtém o índice do aluno a ser editado do campo oculto
    const index = document.getElementById("editIndex").value;
    // Obtém os novos valores dos campos do modal
    const nome = document.getElementById("editName").value;
    const turma = document.getElementById("editClass").value;
    const escola = document.getElementById("editSchool").value;
    const descricao = document.getElementById("editDescription").value;
    // Atualiza os dados do aluno no array 'students'
    students[index] = {
        nome,
        turma,
        escola,
        descricao
    };
    // Renderiza a tabela para exibir as alterações
    renderTable();
    // Esconde o modal de edição
    bootstrap.Modal.getInstance(document.getElementById("editModal")).hide();
}
/**
 * Função para atualizar o número total de alunos exibido na seção de relatórios.
 */
function updateTotalStudents() {
    totalStudentsElement.textContent = students.length;
}
/**
 * Função para exibir o relatório de todos os alunos.
 */
function displayAllStudentReports() {
    studentReportDetailsDiv.innerHTML = ''; // Limpa os resultados anteriores
    students.forEach(student => {
        const reportCard = document.createElement('div');
        reportCard.classList.add('card', 'mb-2');
        reportCard.innerHTML = `
                    <div class="card-body">
                        <h6 class="card-title">${student.nome}</h6>
                        <p class="card-text">
                            <strong>Turma:</strong> ${student.turma || 'Não informada'}<br>
                            <strong>Escola:</strong> ${student.escola || 'Não informada'}<br>
                            <strong>Descrição:</strong> ${student.descricao || 'Nenhuma descrição'}
                        </p>
                    </div>
                `;
        studentReportDetailsDiv.appendChild(reportCard);
    });
}
/**
 * Event listener para a pesquisa de alunos no relatório.
 */
searchStudentInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase();
    studentReportDetailsDiv.innerHTML = ''; // Limpa os resultados anteriores
    if (searchTerm) {
        const foundStudents = students.filter(student =>
            student.nome.toLowerCase().includes(searchTerm)
        );
        if (foundStudents.length > 0) {
            foundStudents.forEach(student => {
                const reportCard = document.createElement('div');
                reportCard.classList.add('card', 'mb-2');
                reportCard.innerHTML = `
                            <div class="card-body">
                                <h6 class="card-title">${student.nome}</h6>
                                <p class="card-text">
                                    <strong>Turma:</strong> ${student.turma || 'Não informada'}<br>
                                    <strong>Escola:</strong> ${student.escola || 'Não informada'}<br>
                                    <strong>Descrição:</strong> ${student.descricao || 'Nenhuma descrição'}
                                </p>
                            </div>
                        `;
                studentReportDetailsDiv.appendChild(reportCard);
            });
        } else {
            studentReportDetailsDiv.innerHTML = '<p>Nenhum aluno encontrado com esse nome.</p>';
        }
    } else {
        displayAllStudentReports(); // Exibe todos se o campo de pesquisa estiver vazio
    }
});
// Renderiza a tabela de alunos inicialmente quando a página é carregada
renderTable();