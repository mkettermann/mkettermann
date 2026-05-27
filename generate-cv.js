const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');

const imgBase64 = (() => {
  const imgPath = path.join(__dirname, 'img', '24-10-MarcosCV.png');
  if (fs.existsSync(imgPath)) {
    const data = fs.readFileSync(imgPath);
    return `data:image/png;base64,${data.toString('base64')}`;
  }
  return null;
})();

const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Marcos Kettermann — Currículo</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
    font-size: 9.5pt;
    line-height: 1.55;
    color: #1a1a2e;
    background: #fff;
  }

  .header {
    background: linear-gradient(135deg, #0f3460 0%, #16213e 60%, #1a1a2e 100%);
    color: #fff;
    padding: 28px 36px 22px;
    display: flex;
    align-items: center;
    gap: 24px;
  }
  .header-photo {
    width: 88px; height: 88px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.35);
    object-fit: cover;
    flex-shrink: 0;
  }
  .header-photo-placeholder {
    width: 80px; height: 80px;
    border-radius: 50%;
    border: 3px solid rgba(255,255,255,0.35);
    background: rgba(255,255,255,0.1);
    display: flex; align-items: center; justify-content: center;
    font-size: 28pt; flex-shrink: 0;
  }
  .header-info { flex: 1; }
  .header-name {
    font-size: 22pt;
    font-weight: 700;
    letter-spacing: -0.3px;
    line-height: 1.1;
    margin-bottom: 4px;
  }
  .header-title {
    font-size: 10.5pt;
    font-weight: 400;
    color: #a8d8ea;
    margin-bottom: 10px;
    letter-spacing: 0.2px;
  }
  .header-contacts {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 18px;
    font-size: 8.5pt;
    color: rgba(255,255,255,0.85);
  }
  .header-contacts span { white-space: nowrap; }

  .body { display: flex; }
  .sidebar {
    width: 198px;
    min-width: 198px;
    background: #f4f6fb;
    padding: 22px 16px;
    border-right: 2px solid #e2e8f4;
  }
  .main { flex: 1; padding: 22px 28px; }

  .section-title {
    font-size: 8.5pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    color: #0f3460;
    border-bottom: 2px solid #0f3460;
    padding-bottom: 4px;
    margin-bottom: 10px;
    margin-top: 18px;
  }
  .section-title:first-child { margin-top: 0; }

  .skill-group { margin-bottom: 14px; }
  .skill-group-name {
    font-size: 8pt;
    font-weight: 600;
    color: #0f3460;
    margin-bottom: 5px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .skill-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .tag {
    background: #dde6f5;
    color: #1a3a6b;
    font-size: 7.5pt;
    font-weight: 500;
    padding: 2px 7px;
    border-radius: 20px;
    white-space: nowrap;
  }
  .tag.highlight {
    background: #0f3460;
    color: #fff;
  }

  .sidebar-info { font-size: 8.5pt; color: #444; margin-bottom: 6px; }
  .sidebar-info strong { color: #0f3460; display: block; margin-bottom: 1px; font-size: 8pt; text-transform: uppercase; letter-spacing: 0.4px; }

  .lang-row { display: flex; justify-content: space-between; font-size: 8.5pt; margin-bottom: 4px; color: #333; }
  .lang-level { color: #0f3460; font-weight: 600; }

  .profile-text { font-size: 9pt; color: #333; line-height: 1.6; margin-bottom: 4px; }

  .available-badge {
    display: inline-block;
    background: #e8f5e9;
    color: #2e7d32;
    font-size: 8pt;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 20px;
    margin-top: 8px;
    border: 1px solid #a5d6a7;
  }

  .exp-item { margin-bottom: 14px; page-break-inside: avoid; }
  .exp-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2px; }
  .exp-role { font-size: 10pt; font-weight: 700; color: #0f3460; }
  .exp-period { font-size: 8pt; color: #666; white-space: nowrap; margin-left: 10px; flex-shrink: 0; }
  .exp-company { font-size: 8.5pt; color: #444; font-weight: 500; margin-bottom: 5px; }
  .exp-bullets { padding-left: 14px; }
  .exp-bullets li { font-size: 8.5pt; color: #333; margin-bottom: 3px; line-height: 1.45; }
  .exp-bullets li strong { color: #0f3460; }

  .cert-group { margin-bottom: 10px; }
  .cert-group-title { font-size: 8.5pt; font-weight: 700; color: #0f3460; margin-bottom: 4px; }
  .cert-list { padding-left: 14px; }
  .cert-list li { font-size: 8pt; color: #444; margin-bottom: 2px; line-height: 1.4; }

  .edu-degree { font-size: 9.5pt; font-weight: 700; color: #0f3460; }
  .edu-school { font-size: 8.5pt; color: #555; }

  .footer {
    text-align: center;
    font-size: 7.5pt;
    color: #aaa;
    padding: 12px 36px;
    border-top: 1px solid #e8ecf4;
    margin-top: 10px;
  }

  @media print {
    body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  }
</style>
</head>
<body>

<div class="header">
  ${imgBase64
    ? `<img class="header-photo" src="${imgBase64}" alt="Marcos Kettermann"/>`
    : `<div class="header-photo-placeholder">👤</div>`
  }
  <div class="header-info">
    <div class="header-name">Marcos Kettermann</div>
    <div class="header-title">Senior Full Stack Developer &nbsp;·&nbsp; Angular · .NET · Node.js · TypeScript · SQL/NoSQL</div>
    <div class="header-contacts">
      <span>📍 Curitiba, PR</span>
      <span>📞 (41) 92002-1535</span>
      <span>✉ ultramk10@gmail.com</span>
      <span>🔗 linkedin.com/in/marcosk10</span>
      <span>💻 github.com/mkettermann</span>
    </div>
  </div>
</div>

<div class="body">

  <div class="sidebar">

    <div class="section-title">Competências</div>

    <div class="skill-group">
      <div class="skill-group-name">Frontend</div>
      <div class="skill-tags">
        <span class="tag highlight">Angular</span>
        <span class="tag highlight">TypeScript</span>
        <span class="tag">React</span>
        <span class="tag">RxJS</span>
        <span class="tag">Angular Material</span>
        <span class="tag">PWA</span>
        <span class="tag">HTML5</span>
        <span class="tag">CSS3</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag">JavaScript ES6+</span>
      </div>
    </div>

    <div class="skill-group">
      <div class="skill-group-name">Backend</div>
      <div class="skill-tags">
        <span class="tag highlight">.NET 6/8</span>
        <span class="tag highlight">C#</span>
        <span class="tag">ASP.NET Core</span>
        <span class="tag highlight">Node.js</span>
        <span class="tag">REST APIs</span>
        <span class="tag">WebSocket</span>
        <span class="tag">SOLID</span>
        <span class="tag">Design Patterns</span>
      </div>
    </div>

    <div class="skill-group">
      <div class="skill-group-name">Banco de Dados</div>
      <div class="skill-tags">
        <span class="tag highlight">PostgreSQL</span>
        <span class="tag">MongoDB</span>
        <span class="tag">SQL Server</span>
        <span class="tag">Firebase</span>
        <span class="tag">Advanced SQL</span>
        <span class="tag">Redis</span>
      </div>
    </div>

    <div class="skill-group">
      <div class="skill-group-name">DevOps & Cloud</div>
      <div class="skill-tags">
        <span class="tag">Git</span>
        <span class="tag">GitHub Actions</span>
        <span class="tag highlight">CI/CD</span>
        <span class="tag">Docker</span>
        <span class="tag">AWS</span>
        <span class="tag">Azure DevOps</span>
      </div>
    </div>

    <div class="skill-group">
      <div class="skill-group-name">IA & Outros</div>
      <div class="skill-tags">
        <span class="tag highlight">GitHub Copilot</span>
        <span class="tag">Machine Learning</span>
        <span class="tag">Scrum/Agile</span>
        <span class="tag">LGPD</span>
      </div>
    </div>

    <div class="section-title">Formação</div>
    <div class="sidebar-info">
      <strong>MBA em Engenharia de Software com IA</strong>
      FullCycle Education<br/>2026 - 2027 (Cursando)
    </div>
    <div class="sidebar-info">
      <strong>Análise e Desenvolvimento de Sistemas</strong>
      Grupo Educacional OPET<br/>2012 – 2014
    </div>

    <div style="break-before: page; page-break-before: always; margin-top: 1em;">
    <div class="section-title">Disponibilidade</div>
    <div class="sidebar-info" style="color:#2e7d32; font-weight:600; font-size:8.5pt;">
      ✅ Remoto / Híbrido<br/>✅ Presencial (Curitiba)
    </div>
    </div>

    <div class="section-title">Idiomas</div>
    <div class="lang-row"><span>Português</span><span class="lang-level">Nativo</span></div>
    <div class="lang-row"><span>Inglês</span><span class="lang-level">Intermediário</span></div>

  </div>

  <div class="main">

    <div class="section-title" style="margin-top:0">Perfil Profissional</div>
    <p class="profile-text">
      Desenvolvedor <strong>Full Stack Sênior</strong> com mais de <strong>20 anos de experiência</strong> liderando projetos web de alta complexidade — de arquiteturas distribuídas em nuvem à modernização de plataformas legadas críticas. Especialista em <strong>Angular</strong>, <strong>.NET/C#</strong> e <strong>Node.js</strong>, com histórico comprovado de entrega mensurável: design system que reduziu <strong>40% do ciclo de desenvolvimento</strong>, eliminação de <strong>100% dos deploys manuais</strong> via CI/CD e reescrita integral de sistema legado FoxPro com ganhos expressivos de performance.
    </p>
    <p class="profile-text" style="margin-top:6px;">
      Expertise em <strong>liderança técnica</strong> de equipes (2–5 devs), arquitetura de microsserviços, pipelines CI/CD e integração de IA (<strong>GitHub Copilot</strong>). Histórico consistente de traduzir requisitos de negócio em soluções robustas e escaláveis — com foco em qualidade de código, entrega contínua e crescimento do time.
    </p>

    <div class="section-title">Experiência Profissional</div>

    <div class="exp-item">
      <div class="exp-header">
        <div class="exp-role">Senior Full Stack Developer</div>
        <div class="exp-period">Set 2022 – Mar 2026 &nbsp;·&nbsp; 3a 7m</div>
      </div>
      <div class="exp-company">Global 5 Gerenciadora de Riscos &nbsp;·&nbsp; Curitiba, PR</div>
      <ul class="exp-bullets">
        <li>Atuação Full Stack end-to-end com <strong>Angular 14+</strong> e <strong>.NET Core 6/8</strong> em plataforma de gestão de riscos de alto tráfego, entregando interfaces responsivas e APIs REST de alta disponibilidade.</li>
        <li>Arquitetura de <strong>design system Angular</strong> com mais de <strong>30 componentes reutilizáveis</strong>, reduzindo em <strong>40%</strong> o tempo de desenvolvimento de novas features.</li>
        <li>Implementação de comunicação em tempo real via <strong>WebSocket</strong> e aplicação <strong>PWA</strong> com suporte offline, ampliando disponibilidade para equipes de campo.</li>
        <li><strong>Liderou reescrita completa</strong> de sistema crítico legado (<strong>FoxPro</strong>, +15 anos de débito técnico) para Angular 14+ / .NET 6, entregando performance superior e manutenabilidade de longo prazo.</li>
        <li><strong>Liderança técnica</strong> de equipe de 2–5 desenvolvedores: condução do Scrum, definição de arquitetura, code review contínuo e mentoria de juniores.</li>
        <li>Implantação de pipeline <strong>CI/CD</strong> com GitHub Actions, eliminando <strong>100% dos deploys manuais</strong> e reduzindo o tempo de release em ~60%.</li>
        <li>Aplicação sistemática de <strong>SOLID</strong>, Design Patterns e Clean Architecture em todas as camadas — reduzindo retrabalho e acelerando onboarding.</li>
        <li>Adoção de <strong>GitHub Copilot</strong> e IA generativa para acelerar ciclos de entrega e elevar a qualidade de código do time.</li>
      </ul>
    </div>

    <div class="exp-item">
      <div class="exp-header">
        <div class="exp-role">Desenvolvedor de Software Embarcado</div>
        <div class="exp-period">Mai – Set 2022 &nbsp;·&nbsp; 5m</div>
      </div>
      <div class="exp-company">Henry Equipamentos Eletrônicos e Sistemas &nbsp;·&nbsp; Pinhais, PR</div>
      <ul class="exp-bullets">
        <li>Desenvolvimento de <strong>firmware embarcado em C</strong> para microprocessadores em sistema de controle de acesso biométrico de alta segurança.</li>
        <li>Implementação de algoritmos de processamento de imagens e reconhecimento de padrões para identificação biométrica, com lógica de triangulação para precisão de leitura.</li>
      </ul>
    </div>

    <div class="exp-item">
      <div class="exp-header">
        <div class="exp-role">Desenvolvedor Desktop (Freelancer)</div>
        <div class="exp-period">Jan 2015 – Jan 2016 &nbsp;·&nbsp; 1 ano</div>
      </div>
      <div class="exp-company">Negócio Próprio &nbsp;·&nbsp; Curitiba, PR</div>
      <ul class="exp-bullets">
        <li>Desenvolvimento de aplicativo desktop em <strong>C# / Windows Forms</strong> para automação de processos administrativos.</li>
      </ul>
    </div>

    <div class="exp-item">
      <div class="exp-header">
        <div class="exp-role">Desenvolvedor Web</div>
        <div class="exp-period">2004 – 2008 &nbsp;·&nbsp; 4 anos</div>
      </div>
      <div class="exp-company">CK Agrícola &nbsp;·&nbsp; Itapoá, SC</div>
      <ul class="exp-bullets">
        <li>Desenvolvimento de sistemas web completos (ASP, HTML, CSS, JavaScript, MySQL) para gestão agrícola e imobiliária.</li>
      </ul>
    </div>

    <div class="section-title" style="break-before: page; page-break-before: always;margin-top: 1em;">Certificações Destacadas (90+)</div>

    <div style="display: flex; gap: 16px; flex-wrap: wrap;">
      <div class="cert-group" style="flex:1; min-width: 180px;">
        <div class="cert-group-title">🤖 IA & Produtividade</div>
        <ul class="cert-list">
          <li>Programação em Pares com GitHub Copilot (2025)</li>
          <li>Fundamentos de IA: Aprendizado de Máquina (2023)</li>
          <li>Hacks de IA para Produtividade (2024)</li>
        </ul>
      </div>
      <div class="cert-group" style="flex:1; min-width: 180px;">
        <div class="cert-group-title">⚡ Angular & Frontend</div>
        <ul class="cert-list">
          <li>Reactive App with Angular and Spring Boot 2 (2025)</li>
          <li>Learning RxJS (2025)</li>
          <li>JavaScript: PWA (2024)</li>
        </ul>
      </div>
      <div class="cert-group" style="flex:1; min-width: 180px;">
        <div class="cert-group-title">⚙️ .NET & ASP.NET Core</div>
        <ul class="cert-list">
          <li>Advanced C#: Functional Programming (2022)</li>
          <li>Advanced Web APIs with ASP.NET Core .NET 6 (2022)</li>
          <li>ASP.NET Core: Token-Based Authentication (2022)</li>
        </ul>
      </div>
      <div class="cert-group" style="flex:1; min-width: 180px;">
        <div class="cert-group-title">☁️ DevOps & Cloud</div>
        <ul class="cert-list">
          <li>Fundamentos de DevOps (2023)</li>
          <li>Introdução à AWS: Principais Serviços (2022)</li>
          <li>Git e GitHub: Formação Básica (2022)</li>
        </ul>
      </div>
    </div>

  </div>
</div>

<!-- FOOTER -->
<div class="footer">
  Marcos Kettermann &nbsp;·&nbsp; ultramk10@gmail.com &nbsp;·&nbsp; linkedin.com/in/marcosk10 &nbsp;·&nbsp; github.com/mkettermann
</div>

</body>
</html>`;

async function generatePDF(nomeArquivo = 'arquivo-pdf.pdf') {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const outputPath = path.join(__dirname, 'pdf', nomeArquivo);

  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' }
  });

  await browser.close();
  console.log(`PDF gerado com sucesso: ${outputPath}`);

  // Comprime após gerar
  const compressedPath = outputPath.replace('.pdf', '-small.pdf');
  await compressPDF(outputPath, compressedPath);
  console.log(`PDF comprimido: ${compressedPath}`);
}

async function compressPDF(inputPath, outputPath) {
  const pdfBytes = fs.readFileSync(inputPath);
  const pdfDoc = await PDFDocument.load(pdfBytes, { ignoreEncryption: true });

  // Reembute o PDF com compressão de objetos
  const compressedBytes = await pdfDoc.save({
    useObjectStreams: true,   // compacta objetos internos
    addDefaultPage: false,
  });

  fs.writeFileSync(outputPath, compressedBytes);
  console.log(`Original: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
  console.log(`Comprimido: ${(compressedBytes.length / 1024).toFixed(1)} KB`);
}

generatePDF('2026-05-PT-Marcos-Kettermann.pdf').catch(err => {
  console.error('Erro ao gerar PDF:', err);
  process.exit(1);
});


