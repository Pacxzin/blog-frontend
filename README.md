Blog Frontend

Frontend do sistema de blog desenvolvido como case técnico para o processo seletivo da Mind Group.

📌 Sobre o projeto

A aplicação consiste em um sistema de blog com autenticação de usuários, permitindo:

Cadastro e login
Visualização de artigos
Criação de novos artigos
Edição de artigos
Exclusão de artigos
Upload de imagem banner

O projeto foi desenvolvido utilizando React + Typescript seguindo o layout disponibilizado no Figma, com algumas melhorias focadas em usabilidade e experiência do usuário.

🚀 Tecnologias utilizadas
ReactJS
Typescript
Vite
React Router DOM
Axios
Context API
CSS / Styled Components / Tailwind (ajuste conforme usou)
JWT Authentication
📂 Estrutura do projeto
src/
 ├── assets/
 ├── components/
 ├── pages/
 ├── services/
 ├── contexts/
 ├── hooks/
 ├── routes/
 ├── styles/
 └── utils/
⚙️ Como rodar o projeto
1. Clone o repositório
git clone https://github.com/Pacxzin/blog-frontend.git
2. Entre na pasta
cd blog-frontend
3. Instale as dependências
npm install
4. Configure as variáveis de ambiente

Crie um arquivo .env na raiz do projeto:

VITE_API_URL=http://localhost:3000
5. Rode o projeto
npm run dev

O projeto estará disponível em:

http://localhost:5173
🔐 Funcionalidades
Usuário
Cadastro
Login autenticado
Logout
Artigos
Listagem de artigos
Visualização detalhada
Criação de artigo
Edição de artigo
Exclusão de artigo
Upload de imagem banner
🎨 Interface

O layout foi baseado no protótipo disponibilizado no Figma durante o processo seletivo.

Algumas melhorias de UI/UX foram adicionadas visando:

melhor responsividade
melhor organização visual
melhor experiência de navegação
📱 Responsividade

A aplicação foi desenvolvida com foco em responsividade para:

Desktop
Tablet
Mobile
👨‍💻 Autor

Desenvolvido por Leonardo Pacífico de Medeiros
