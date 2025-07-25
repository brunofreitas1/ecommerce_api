# ecommerce_api
API RESTful para gerenciamento de produtos de e-commerce. Desenvolvido com Spring Boot , Spring Data JPA e Java 17.


-----

# Sistema de Gerenciamento de Produtos de E-commerce

Este é um sistema backend desenvolvido com Spring Boot e Spring Data JPA para gerenciar o catálogo de produtos de um e-commerce.Ele permite realizar operações CRUD (Criar, Ler, Atualizar, Deletar) e consultar produtos de forma eficiente e organizada.

## 1\. Introdução

Este projeto nasceu da necessidade de aprofundar conhecimentos em Programação Orientada a Objetos (POO) e aplicar de forma prática os recursos do Spring Framework, com foco na integração com bancos de dados relacionais utilizando o Spring Data JPA.Desenvolvemos uma API RESTful para a gestão de produtos, simulando um cenário real de desenvolvimento de software backend para e-commerce.A aplicação é capaz de realizar operações essenciais como cadastro, listagem, atualização e remoção de produtos, além de consultas por atributos específicos, demonstrando a robustez do Spring Data JPA no mapeamento Objeto-Relacional (ORM) e na persistência de dados.Esta documentação detalha a arquitetura, os requisitos, a modelagem, as tecnologias empregadas e os principais desafios superados pela equipe.

**Grupo:**

* Bruno Brandão
* Gustavo Prado
* Gabriel Henrique Vieira
* Julia

## 2\. Visão do Produto

O Sistema de Gerenciamento de Produtos é uma API backend que serve como espinha dorsal para um catálogo de produtos de e-commerce.Ele foi concebido para ser uma solução prática e eficiente para a gestão de inventário, oferecendo

* **Persistência de Dados Confiável:** Armazenamento seguro de informações de produtos em um banco de dados relacional.
* **Abstração de Acesso a Dados:** Utilização do Spring Data JPA para simplificar drasticamente as operações de CRUD, reduzindo a necessidade de código SQL explícito.
* **Arquitetura Modular:** Estrutura clara em camadas (Controller, Service, Repository) que promove a manutenibilidade e a escalabilidade do projeto.
* **Comunicação RESTful:** Exposição de endpoints HTTP amigáveis, facilitando a integração com quaisquer aplicações frontend ou outros sistemas.

Este sistema é uma base sólida para desenvolvedores e estudantes que buscam compreender e aplicar conceitos avançados de persistência de dados e desenvolvimento de APIs com o ecossistema Spring.

## 3\. Tecnologias Utilizadas

O projeto foi construído utilizando as seguintes tecnologias e ferramentas principais:

* **Linguagem:** Java 17
* **Framework:** Spring Boot 3.x
* **ORM (Object-Relational Mapping):** Spring Data JPA (com Hibernate como implementação padrão)
* **Banco de Dados:** H2 Database (em memória para desenvolvimento e testes)
* **Ambiente de Desenvolvimento:** IntelliJ IDEA / Eclipse
* **Gerenciamento de Dependências:** Maven
* **Testes de API:** Postman / cURL
* **Controle de Versão:** GitHub

## 4\. Como Rodar o Projeto

Para executar a API de Gerenciamento de Produtos em seu ambiente local, siga os passos abaixo

### Pré-requisitos

Certifique-se de ter os seguintes softwares instalados em sua máquina:

* Java Development Kit (JDK) 17 ou superior
* Apache Maven 3.6.0 ou superior
* (https://www.google.com/search?q=Opcional) Git para clonar o repositório

### 4.1. Clonar o Repositório

Abra o terminal ou prompt de comando e clone o projeto do GitHub:

```bash
git clone https://github.com/brunofreitas1/ecommerce_api.git
```

### 4.2. Navegar até o Diretório do Projeto

Entre na pasta do projeto clonado:

```bash
cd ecommerce_api
```

### 4.3. Compilar o Projeto

Compile o projeto usando o Maven para baixar as dependências e construir o JAR:

```bash
mvn clean install
```

### 4.4. Rodar a Aplicação

Execute a aplicação Spring Boot:

```bash
mvn spring-boot:run
```

A aplicação será iniciada e estará acessível em http://localhost:8080.

### 4.5. Acessar o H2 Console (https://www.google.com/search?q=Opcional)

Se desejar visualizar o banco de dados H2 em memória e as tabelas criadas:

1.  Abra seu navegador e acesse: http://localhost:8080/h2-console
2.  Use as seguintes credenciais (definidas em src/main/resources/application.properties):
    * **JDBC URL:** `jdbc:h2:mem:produtosdb`
    * **User Name:** `sa`
    * **Password:** (deixe em branco)
3.  Clique em "Connect". Você verá a tabela PRODUTOS.

## 5\. Guia do Usuário (API REST)

A API de Gerenciamento de Produtos expõe os seguintes endpoints REST para interação. Todos os endpoints utilizam a base /api/produtos.

### Endpoints Disponíveis

| Método HTTP | Endpoint | Descrição |
| :--- | :--- | :--- |
| POST | /api/produtos | Cadastrar um novo produto. |
| GET | /api/produtos | Listar todos os produtos cadastrados. |
| GET | /api/produtos/{id} | Consultar um produto específico pelo seu ID. |
| PUT | /api/produtos/{id} | Atualizar informações de um produto existente pelo seu ID. |
| DELETE | /api/produtos/{id} | Remover um produto específico pelo seu ID. |
| GET | /api/produtos/nome?nome={nome} | Buscar produtos por um nome que contenha a string (ignorando maiúsculas/minúsculas). |



### Detalhamento dos Endpoints

#### 5.1. POST /api/produtos - Cadastrar Produto

Cadastra um novo produto no catálogo.

* **Método:** `POST`
* **URL:** `http://localhost:8080/api/produtos`
* **Content-Type:** `application/json`
* **Requisição (Request Body):**
  ```json
  {
      "nome": "Smartphone XYZ",
      "descricao": "Smartphone Android com câmera de 108MP",
      "preco": 1899.99,
      "quantidadeEstoque": 50
  }
  ```

* **Resposta de Sucesso (Status: 201 Created):**
  ```json
  {
      "id": 1,
      "nome": "Smartphone XYZ",
      "descricao": "Smartphone Android com câmera de 108MP",
      "preco": 1899.99,
      "quantidadeEstoque": 50
  }
  ```

* **Exemplo curl:**
  ```bash
  curl -X POST \
    http://localhost:8080/api/produtos \
    -H 'Content-Type: application/json' \
    -d '{
      "nome": "Smartphone XYZ",
      "descricao": "Smartphone Android com câmera de 108MP",
      "preco": 1899.99,
      "quantidadeEstoque": 50
    }'
  ```


#### 5.2. GET /api/produtos - Listar Todos os Produtos

Retorna uma lista contendo todos os produtos cadastrados no catálogo.

* **Método:** `GET`
* **URL:** `http://localhost:8080/api/produtos`
* **Resposta de Sucesso (Status: 200 OK):**
  ```json
  [
      {
          "id": 1,
          "nome": "Smartphone XYZ",
          "descricao": "Smartphone Android com câmera de 108MP",
          "preco": 1899.99,
          "quantidadeEstoque": 50
      },
      {
          "id": 2,
          "nome": "Teclado Mecânico RGB",
          "descricao": "Teclado para gamers com switches azuis e iluminação RGB",
          "preco": 350.00,
          "quantidadeEstoque": 120
      }
  ]
  ```

* **Exemplo curl:**
  ```bash
  curl http://localhost:8080/api/produtos
  ```


#### 5.3. GET /api/produtos/{id} - Consultar Produto por ID

Busca e retorna um produto específico utilizando seu ID único

* **Método:** `GET`
* **URL:** `http://localhost:8080/api/produtos/{id}` (substitua {id} pelo ID do produto)
* **Resposta de Sucesso (Status: 200 OK):**
  ```json
  {
      "id": 1,
      "nome": "Smartphone XYZ",
      "descricao": "Smartphone Android com câmera de 108MP",
      "preco": 1899.99,
      "quantidadeEstoque": 50
  }
  ```

* **Exemplo curl:**
  ```bash
  # Para um produto existente (ID 1)
  curl http://localhost:8080/api/produtos/1
  # Para um produto inexistente (ID 999)
  curl http://localhost:8080/api/produtos/999
  ```


#### 5.4. PUT /api/produtos/{id} - Atualizar Produto

Atualiza as informações de um produto existente, identificado pelo seu ID

* **Método:** `PUT`
* **URL:** `http://localhost:8080/api/produtos/{id}` (substitua {id} pelo ID do produto a ser atualizado)
* **Content-Type:** `application/json`
* **Requisição (Request Body):**
  ```json
  {
      "nome": "Smartphone XYZ Pro",
      "descricao": "Smartphone Android avançado com câmera de 200MP",
      "preco": 2199.99,
      "quantidadeEstoque": 45
  }
  ```

* **Resposta de Sucesso (Status: 200 OK):**
  ```json
  {
      "id": 1,
      "nome": "Smartphone XYZ Pro",
      "descricao": "Smartphone Android avançado com câmera de 200MP",
      "preco": 2199.99,
      "quantidadeEstoque": 45
  }
  ```

* **Exemplo curl:**
  ```bash
  curl -X PUT \
    http://localhost:8080/api/produtos/1 \
    -H 'Content-Type: application/json' \
    -d '{
      "nome": "Smartphone XYZ Pro",
      "descricao": "Smartphone Android avançado com câmera de 200MP",
      "preco": 2199.99,
      "quantidadeEstoque": 45
    }'
  ```


#### 5.5. DELETE /api/produtos/{id} - Remover Produto

Remove um produto do catálogo utilizando seu ID único

* **Método:** `DELETE`
* **URL:** `http://localhost:8080/api/produtos/{id}` (substitua {id} pelo ID do produto a ser removido)
* **Resposta de Sucesso (Status: 204 No Content):** (Nenhum corpo de resposta. Indica sucesso na remoção.)
* **Exemplo curl:**
  ```bash
  curl -X DELETE http://localhost:8080/api/produtos/1
  ```


#### 5.6. GET /api/produtos/nome?nome={nome} - Buscar Produtos por Nome

Busca e retorna uma lista de produtos cujo nome contém a string fornecida (busca case-insensitive)

* **Método:** `GET`
* **URL:** `http://localhost:8080/api/produtos/nome?nome={nome}` (substitua {nome} pela parte do nome do produto)
* **Exemplo curl:**
  ```bash
  curl http://localhost:8080/api/produtos/nome?nome=smart
  ```


## 6\. Esquema do Banco de Dados

O banco de dados H2 utilizado em memória para este projeto gerencia a tabela PRODUTOS, que armazena todas as informações dos produtos do e-commerce.

**Tabela: PRODUTOS**

| Coluna | Tipo de Dados (H2) | Descrição | Restrições |
| :--- | :--- | :--- | :--- |
| ID | BIGINT | Chave primária única do produto. | "PRIMARY KEY, AUTO\_INCREMENT" |
| NOME | VARCHAR(100) | Nome do produto. | NOT NULL |
| DESCRICAO | VARCHAR(255) | Descrição detalhada do produto. | NULLABLE |
| PRECO | DOUBLE | Preço de venda do produto. | NOT NULL |
| QUANTIDADE\_ESTOQUE | INTEGER | Quantidade atual do produto disponível em estoque. | NOT NULL |



## 7\. Modelagem de Classe

A entidade Produto é o core do sistema, mapeada diretamente para a tabela PRODUTOS no banco de dados. As classes de Repositório, Serviço e Controlador orquestram as operações sobre esta entidade.

## 8\. Diagramas

### 8.1. Diagrama de Casos de Uso

Este diagrama ilustra as interações entre o usuário e o Sistema de Gerenciamento de Produtos, representando as principais funcionalidades oferecidas pela API.

**Descrição dos Casos de Uso:**

* **Cadastrar Produto:** O usuário insere os dados de um novo produto para que seja adicionado ao catálogo.
* **Listar Produtos:** O usuário solicita a exibição de todos os produtos armazenados no catálogo.
* **Atualizar Produto:** O usuário modifica as informações de um produto existente, identificado por seu ID.
* **Remover Produto:** O usuário remove um produto específico do catálogo, fornecendo seu ID.
* **Consultar Produto por Atributo:** O usuário realiza uma consulta para encontrar produtos baseados em um atributo específico (ex: nome do produto).

### 8.2. Diagrama de Atividades

O diagrama de atividades detalha o fluxo de execução para uma operação típica dentro do Sistema de Gerenciamento de Produtos, desde o início da aplicação até o retorno de uma resposta.

## 9\. Requisitos

### 9.1. Requisitos Funcionais

| ID | Prioridade | Título | Descrição | Critério de Aceitação |
| :--- | :--- | :--- | :--- | :--- |
| RF01 | Alta | Cadastrar Produto | "Como usuário, quero cadastrar um novo produto no catálogo." | "Os dados do produto (nome, descrição, preço, estoque) devem ser salvos corretamente no banco de dados." |
| RF02 | Alta | Listar Produtos | "Como usuário, quero visualizar todos os produtos cadastrados." | Retornar todos os produtos salvos por meio de um endpoint REST. |
| RF03 | Alta | Atualizar Produto | "Como usuário, quero atualizar informações de um produto existente." | Os dados do produto devem ser atualizados corretamente a partir do ID. |
| RF04 | Alta | Remover Produto | "Como usuário, quero remover produtos específicos do catálogo." | O produto correspondente ao ID deve ser removido do banco. |
| RF05 | Média | Buscar Produto por Atributo | "Como usuário, quero consultar produtos por um atributo específico." | Consultas por nome (parcial e ignorando caixa) devem retornar os produtos corretos. |



### 9.2. Requisitos Não Funcionais

* **Desempenho:** Operações CRUD otimizadas utilizando o Spring Data JPA para garantir respostas rápidas no gerenciamento do catálogo de produtos.
* **Confiabilidade:** Validação de dados de entrada com Bean Validation, minimizando erros e garantindo a integridade dos dados dos produtos (ex: nome não vazio, preço e estoque positivos).
* **Manutenibilidade:** Estrutura modular baseada em camadas (Controller, Service, Repository), facilitando a manutenção e futuras expansões do sistema de catálogo.
* **Escalabilidade:** Código adaptável, permitindo a fácil inclusão de novas entidades (ex: Categoria, Fornecedor) e relacionamentos complexos no futuro.
* **Portabilidade:** Funcionamento multiplataforma assegurado pela Java Virtual Machine (JVM), permitindo a execução em diferentes ambientes de servidor.
## 10\. Problemas e Soluções

Durante o desenvolvimento deste projeto, enfrentamos e superamos alguns desafios importantes, que fortaleceram nosso entendimento e a qualidade da solução:

* **Configuração do JPA e Mapeamento Objeto-Relacional:**

    * **Desafio:** Garantir a correta inicialização do ambiente JPA e o mapeamento preciso da entidade Produto para a tabela PRODUTOS no banco de dados.
    * **Solução:** Utilizamos as anotações do JPA (@Entity, @Id, @GeneratedValue, @Column, @Table) na classe Produto para definir o mapeamento de forma declarativa. O arquivo application.properties foi cuidadosamente configurado para a conexão com o banco de dados H2 e para permitir que o Hibernate (implementação padrão do JPA no Spring Boot) gerenciasse automaticamente o schema do banco (spring.jpa.hibernate.ddl-auto=update), simplificando a fase de desenvolvimento.

* **Validação de Dados de Entrada da API:**

    * **Desafio:** Prevenir que dados incorretos, incompletos ou mal formatados fossem persistidos no banco de dados, o que poderia levar a inconsistências.
    * **Solução:** Implementamos o Bean Validation adicionando anotações como @NotBlank (para campos não nulos e não vazios), @NotNull (para campos não nulos) e @Min (para valores mínimos, como preço e quantidade em estoque) nos atributos da entidade Produto. Além disso, o uso da anotação @Valid nos métodos do ProdutoController que recebem o Produto no corpo da requisição garantiu que as validações fossem disparadas automaticamente antes da execução da lógica de negócios, retornando respostas HTTP 400 Bad Request (com detalhes dos erros) para o cliente em caso de falha.

* **Organização e Separação de Responsabilidades:**

    * **Desafio:** Manter uma clara divisão de tarefas entre a manipulação de requisições HTTP, a lógica de negócios e a interação com o banco de dados.
    * **Solução:** Adotamos rigorosamente a arquitetura em camadas baseada no padrão MVC (Model-View-Controller). O ProdutoController é responsável exclusivamente por receber e responder às requisições HTTP. O ProdutoService encapsula toda a lógica de negócios e orquestra as chamadas ao repositório. Por fim, o ProdutoRepository (uma interface do Spring Data JPA) cuida da comunicação direta com o banco de dados, mantendo o código limpo, coeso e fácil de manter e expandir.

## 11\. Conclusão

Este projeto proporcionou uma experiência completa e aprofundada no desenvolvimento de um Sistema de Gerenciamento de Produtos de E-commerce utilizando o Spring Framework e Spring Data JPA. Conseguimos aplicar e consolidar conhecimentos em arquitetura de software, persistência de dados e construção de APIs RESTful. A estrutura modular e a adoção de boas práticas resultaram em uma solução robusta e manutenível, que pode ser estendida para lidar com mais entidades e relacionamentos complexos, como Categoria, Fornecedor ou Pedido, construindo um sistema de e-commerce mais abrangente.

Como próximas etapas e melhorias futuras, vislumbramos a implementação de:

* **Autenticação e Autorização:** Adicionar mecanismos de segurança como JWT (JSON Web Tokens) para proteger os endpoints da API, controlando o acesso a operações específicas (ex: apenas administradores podem adicionar produtos).
* **Testes Automatizados:** Desenvolver testes unitários (com JUnit e Mockito) e de integração para garantir a qualidade do código, a cobertura das funcionalidades e a estabilidade da aplicação em futuras modificações.
* **Integração com Banco de Dados em Nuvem:** Migrar o banco de dados H2 em memória para uma solução persistente e escalável em nuvem, como PostgreSQL ou MySQL, para um ambiente de produção.

## 12\. Cronograma Geral

| Período | Atividades |
| :--- | :--- |
| Semana 1 | Planejamento do projeto, configuração do ambiente de desenvolvimento, criação do `backlog` inicial (foco em funcionalidades de gerenciamento de produtos). |
| Semana 2 e Início da Semana 3 | Desenvolvimento e integração das funcionalidades principais (CRUD e consultas básicas para produtos). |
| Final da Semana 3 | Elaboração da documentação final e preparação para a apresentação do projeto. |