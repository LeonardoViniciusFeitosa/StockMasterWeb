# StockMasterWeb

Projeto web de controle de estoque, vendas, clientes, fornecedores e funcionários, desenvolvido para o Projeto Integrador/TCC de Desenvolvimento de Sistemas.

## Estrutura

- `BackEnd/`: API Java com Spring Boot e JPA
- `FrontEnd/`: telas HTML, CSS e JavaScript consumindo a API REST

## Funcionalidades

- Cadastro e listagem de clientes
- Cadastro e listagem de fornecedores
- Cadastro e listagem de produtos
- Cadastro e listagem de funcionários
- Cadastro e listagem de movimentações de estoque
- Cadastro e listagem de vendas
- Dashboard com indicadores básicos

## Tecnologias

- Java 17
- Spring Boot
- Spring Data JPA
- MySQL
- HTML, CSS e JavaScript
- Bootstrap 5

## Como rodar

### 1. Banco de dados

Use um MySQL local.

Configuração padrão atual da API:

- banco: `stockmaster`
- usuário: `root`
- senha: `root`

Se a senha do seu MySQL for diferente, altere em:

- [BackEnd/src/main/resources/application.properties](BackEnd/src/main/resources/application.properties)

A API está configurada com `createDatabaseIfNotExist=true`, então o schema `stockmaster` será criado automaticamente se o usuário tiver permissão.

### 2. Rodar o BackEnd

No terminal, entre em `BackEnd` e execute:

```powershell
.\mvnw.cmd spring-boot:run
```

Se quiser apenas testar:

```powershell
.\mvnw.cmd test
```

### 3. Rodar o FrontEnd

Com a API em execução, abra os arquivos HTML da pasta `FrontEnd`.

Página inicial recomendada:

- `FrontEnd/login.html`

Credenciais iniciais:

- usuário: `admin`
- senha: `admin`

O front consome a API em:

- `http://localhost:8080`

## Observações para avaliação

- O projeto foi organizado para facilitar a execução local pelo avaliador.
- O backend usa Maven Wrapper, então não é necessário instalar Maven manualmente.
- Os testes automatizados do backend usam H2 em memória, sem depender do MySQL.

## Endpoints principais

- `/customer`
- `/supplier`
- `/product`
- `/employer`
- `/stockMovement`
- `/sales`

## Autor

Projeto acadêmico desenvolvido para fins de avaliação no curso de Desenvolvimento de Sistemas.
