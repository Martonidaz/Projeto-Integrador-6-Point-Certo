# Point Certo - App de Recomendação de Locais Acessíveis

## 📋 Sobre o Projeto

O **Point Certo** é um aplicativo mobile desenvolvido em Flutter que conecta pessoas a locais próximos de sua localização, priorizando lugares com acessibilidade. O objetivo é facilitar a descoberta de estabelecimentos que oferecem estrutura adequada para pessoas com necessidades especiais.

## 🎯 Objetivo

**Objetivo Geral:**  
Desenvolver um aplicativo mobile que conecte pessoas a locais próximos de sua localização, priorizando lugares com acessibilidade.

**Objetivos Específicos:**  
- Criar uma interface intuitiva e responsiva utilizando Flutter e Dart
- Implementar filtros de busca por tipo de local e raio de distância
- Garantir a apresentação de informações completas e acessíveis sobre cada local
- Incluir funcionalidades de login, perfil e configurações
- Permitir o gerenciamento de dados por meio de um painel admin

## 🛠️ Tecnologias Utilizadas

### Frontend/Mobile
- **Flutter** - Framework para desenvolvimento mobile
- **Dart** - Linguagem de programação
- **Multiplataforma**: Android, iOS, Web, Linux, macOS, Windows

### Backend/Server
- **Node.js** - Ambiente de execução JavaScript
- **SQLite** - Banco de dados
- **REST API** - Para comunicação entre app e servidor

## 📁 Estrutura do Projeto

```
Point-Certo-PI6/
├── app_recomendacao/          # Aplicação Flutter
│   ├── android/               # Configurações Android
│   ├── ios/                   # Configurações iOS
│   ├── lib/                   # Código fonte Dart
│   ├── linux/                 # Configurações Linux
│   ├── macos/                 # Configurações macOS
│   ├── web/                   # Configurações Web
│   ├── windows/               # Configurações Windows
│   ├── test/                  # Testes unitários
│   ├── pubspec.yaml           # Dependências do Flutter
│   └── analysis_options.yaml  # Configurações de análise
├── server/                    # Backend Node.js
│   ├── node_modules/          # Dependências Node.js
│   ├── banco_dados.sqlite     # Banco de dados
│   ├── index.js               # Servidor principal
│   ├── package.json           # Dependências do servidor
│   └── chave.api              # Chaves de API
└── README.md                  # Documentação
```

## 🚀 Funcionalidades

### Principais
- 📍 **Localização em tempo real** - Encontre locais próximos
- ♿ **Filtros de acessibilidade** - Busque por estabelecimentos adaptados
- 🔍 **Busca categorizada** - Filtre por tipo (Cafés, Padarias, Restaurantes)
- 📱 **Interface acessível** - Design inclusivo para todos os usuários
- 👤 **Sistema de perfil** - Login e personalização

### Indicadores de Acessibilidade
- Acesso facilitado
- Vaga PCD
- Atendimento por Libras
- Cardápio Braile
- Estabelecimento adaptado

## 📋 Metodologia

### Etapas do Desenvolvimento

1. **Planejamento e Levantamento de Requisitos**
   - Definição de funcionalidades e estrutura do app

2. **Desenvolvimento do Backend e Frontend**
   - Linguagens: Dart (backend) e Flutter (frontend)

3. **Design da Interface**
   - Aplicação das heurísticas de Nielsen para usabilidade

4. **Integração com APIs e Banco de Dados**
   - Extração e exibição de dados de locais (nome, descrição, endereço, contato)

5. **Testes e Validação**
   - Testes de acessibilidade, desempenho e experiência do usuário

## 🏃‍♂️ Como Executar

### Pré-requisitos
- Flutter SDK
- Node.js
- Git

### Executando o App
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Entre na pasta do app
cd Point-Certo-PI6/app_recomendacao

# Instale as dependências
flutter pub get

# Execute o app
flutter run
```

### Executando o Servidor
```bash
# Entre na pasta do servidor
cd Point-Certo-PI6/server

# Instale as dependências
npm install

# Execute o servidor
node index.js
```

## 👥 Contribuição

Contribuições são sempre bem-vindas! Para contribuir:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob licença. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

Para mais informações sobre o projeto, entre em contato através do repositório.

---

**Desenvolvido com ❤️ para promover a acessibilidade e inclusão**
