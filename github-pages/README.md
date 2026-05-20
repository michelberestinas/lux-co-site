# Lux & Co. Consulting — site

Site institucional da Lux & Co. Consulting, navy + dourado, bilíngue PT/EN, pronto para GitHub Pages.

## Como publicar no GitHub Pages (passo a passo)

1. **Crie o repositório**
   - Vá em [github.com/new](https://github.com/new)
   - Nome sugerido: `lux-co-site` (ou, se quiser que o site apareça em `seu-usuario.github.io`, use exatamente esse nome)
   - Marque como **Public**
   - Marque **Add a README file**
   - Clique em **Create repository**

2. **Suba os arquivos desta pasta**
   - No repositório recém-criado, clique em **Add file → Upload files**
   - Arraste **todo o conteúdo** desta pasta (`index.html`, `site-content.js`, `site-app.jsx`, as pastas `brand/` e `downloads/`)
   - Escreva uma mensagem qualquer ("primeiro upload") e clique em **Commit changes**

3. **Ative o GitHub Pages**
   - No repositório, clique em **Settings** (no topo, à direita)
   - Menu lateral: **Pages**
   - Em **Build and deployment → Source**, selecione **Deploy from a branch**
   - Em **Branch**, escolha `main` e pasta `/ (root)`
   - Clique em **Save**

4. **Pronto**
   - Em ~1 minuto seu site estará em `https://<seu-usuario>.github.io/<nome-do-repo>/`
   - Se nomeou o repo como `seu-usuario.github.io`, fica em `https://<seu-usuario>.github.io/`

## Como editar texto depois

- **Conteúdo (textos, contatos, módulos)**: edite `site-content.js`. O arquivo separa PT e EN em duas seções (`pt:` e `en:`).
- **Layout/visual**: edite `site-app.jsx`.
- **Logo / foto do mentor**: substitua os arquivos em `brand/` mantendo os mesmos nomes (`logo.png`, `founder.png`).
- **Caderno para download**: arquivo em `downloads/Caderno-30-Dias.html`.

Para editar pela interface web do GitHub: abra o arquivo no repositório, clique no lápis ✏️, edite, commit. O site atualiza sozinho em ~1 minuto.

## Domínio próprio (opcional)

Quando quiser usar um domínio tipo `luxcoconsulting.com.br`:
1. Compre o domínio (Registro.br, Namecheap, GoDaddy)
2. No painel do domínio, crie um registro **CNAME** apontando para `<seu-usuario>.github.io`
3. No GitHub: **Settings → Pages → Custom domain** → digite seu domínio → Save
4. Marque **Enforce HTTPS** depois que aparecer a opção

---

**Contato:** contact.luxco.consulting@gmail.com
