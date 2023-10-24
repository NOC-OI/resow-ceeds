# COG

Although the frontend application does not necessarily require a backend to perform most of its activities, a backend was still implemented in the project. More information about these calculation could be see [here](backend.md). The backend is used for the following activities:

- Server-side calculations for the Digital Twin for Haig Fras project.
- Management and access to the user table, enabling authentication.

A conexao entre o frontend e o backend e' realizada por meio de endpoints e get requests na api. Esta api retorna arquivos JSON com o resultado dos calculos ou informacoes sobre autenticacao.

Os calculos no backend alimentam os seguintes resultados no frontend:
- Biovidersity

- Habitats

- Species of Interest