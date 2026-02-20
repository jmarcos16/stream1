---
applyTo: '**'
---

# Padrões de Código

## Nomenclatura e Idioma

- **Use termos em inglês** - Variáveis, funções, classes, constantes e identificadores devem ser nomeados em inglês.
- **Exceção**: Comentários e documentação podem estar em português, mas nomes no código sempre em inglês.

## Comentários

- **Proibido adicionar comentários no código** - O código deve ser auto-explicativo através de nomes descritivos de variáveis, funções e componentes.
- Excluir comentários inline que expliquem a lógica - Se o código precisa de explicação, refatore-o para ser mais claro.
- PHPDoc/JSDoc (docstrings) é permitido para funções públicas e componentes complexos, mas mantenha-o conciso.

## React - Boas Práticas

### Types/TypeScript

- **Sempre use types** - Todo componente React e hook deve ter tipos TypeScript explícitos para props, estados e retornos.
- **Organize types em arquivos dedicados** - Types devem estar sempre em `resources/js/types/` em arquivos com nomes que façam sentido e reflitam seu domínio (ex: `auth.ts`, `ui.ts`, `navigation.ts`).
- **Importe tipos dos arquivos organizados** - Não defina tipos inline; sempre importe de `resources/js/types/`.

### Componentes

- **Use componentes funcionais com hooks** - Evite class components. Sempre use functional components.
- **Use composição sobre herança** - Componentes devem ser compostos a partir de componentes menores, não estendidos.
- **Memoize componentes quando apropriado** - Use `React.memo` para evitar re-renders desnecessários em componentes puros.
- **Use Fragments** - Prefira `<>...</>` ou `<React.Fragment>` para evitar elementos DOM desnecessários.
- **Props com validação** - Use PropTypes para validar as props de cada componente.

### Hooks

- **Extraia lógica reutilizável em custom hooks** - Não repita lógica em múltiplos componentes.
- **Use hooks do React corretamente** - Sempre declare hooks no topo do componente, nunca dentro de loops ou condições.
- **Nomes descritivos para custom hooks** - Comece com `use` (ex: `useUserData`, `useFetchData`).

### Listas e Chaves

- **Sempre use keys em listas** - Nunca use o índice da array como key.
- **Keys devem ser únicas e estáveis** - Use IDs ou identificadores únicos dos dados.

### Performance

- **Evite renders desnecessários** - Use useCallback e useMemo quando apropriado.
- **Lazy load componentes** - Use React.lazy e Suspense para componentes pesados.
- **Otimize seletores de estado** - No Redux ou Context, crie seletores para evitar re-renders em mudanças desnecessárias.

### Estrutura de Componentes

- **Separação de responsabilidades** - Componentes de container e apresentação devem estar separados quando apropriado.
- **Props simples e diretas** - Evite passar muitos props; use composição ou contexto quando necessário.
- **Nomes descritivos** - Nomes de componentes e funções devem descrever claramente sua função (ex: `UserCard`, `handleSubmit`, `isAuthenticated`).

### Estado e Efeitos

- **Mantenha estado no menor escopo possível** - Levante estado apenas quando necessário.
- **Efeitos focados** - Cada `useEffect` deve ter uma única responsabilidade.
- **Limpeza de efeitos** - Sempre limpe subscriptions, timeouts e listeners em `useEffect` return.
- **Dependências corretas** - Array de dependências do `useEffect` deve incluir todas as variáveis externas usadas.

## PHP - Boas Práticas

### PHPDoc / PHPStan

- **Siga as regras de docblock do PHPStan** - Sempre mantenha docblocks alinhados com as regras de análise estática do PHPStan.
- Docblocks devem incluir tipos de parâmetros, tipos de retorno e exceções lançadas quando apropriado.
- Comentários em docblocks devem estar em inglês.
- Mantenha a documentação concisa e sem comentários redundantes inline no código.