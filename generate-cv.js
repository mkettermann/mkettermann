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

  .end-file {
    color: #fff;
    background:#fff;
    font-size:1pt;
    line-height:0.5;
    padding:0;
    margin:0;
    overflow:hidden;
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
      <span>✉ marcosk10@yahoo.com.br</span>
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
        <span class="tag">Bootstrap</span>
        <span class="tag">Tailwind CSS</span>
        <span class="tag">JavaScript ES6+</span>
        <span class="tag">jQuery</span>
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
        <span class="tag">Spring Boot</span>
        <span class="tag">Java</span>
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
        <span class="tag">MySQL</span>
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
        <span class="tag">Power BI</span>
      </div>
    </div>

    <div class="skill-group">
      <div class="skill-group-name">IA & Outros</div>
      <div class="skill-tags">
        <span class="tag highlight">GitHub Copilot</span>
        <span class="tag">Machine Learning</span>
        <span class="tag">Firmware em C</span>
        <span class="tag">Arduino</span>
        <span class="tag">Scrum/Agile</span>
        <span class="tag">LGPD</span>
      </div>
    </div>

    <div class="section-title">Idiomas</div>
    <div class="lang-row"><span>Português</span><span class="lang-level">Nativo</span></div>
    <div class="lang-row"><span>Inglês</span><span class="lang-level">Intermediário</span></div>

    <div class="section-title">Formação</div>
    <div class="sidebar-info">
      <strong>Tecnólogo ADS</strong>
      Grupo Educacional OPET<br/>2012 – 2014
    </div>

    <div style="break-before: page; page-break-before: always; margin-top: 1em;">
    <div class="section-title">Disponibilidade</div>
    <div class="sidebar-info" style="color:#2e7d32; font-weight:600; font-size:8.5pt;">
      ✅ Remoto / Híbrido<br/>✅ Presencial
    </div>
    </div>

  </div>

  <div class="main">

    <div class="section-title" style="margin-top:0">Perfil Profissional</div>
    <p class="profile-text">
      Desenvolvedor <strong>Full Stack Sênior</strong> com mais de <strong>20 anos de experiência</strong> em desenvolvimento web e sistemas — do ASP/VBScript às arquiteturas modernas em nuvem. Especialista em <strong>Angular</strong> (frontend), <strong>.NET/C#</strong> (backend), <strong>Node.js</strong>, <strong>TypeScript</strong> e bancos de dados relacionais e NoSQL.
    </p>
    <p class="profile-text" style="margin-top:6px;">
      Experiência comprovada em <strong>liderança técnica</strong>, arquitetura de sistemas distribuídos, DevOps, criação de bibliotecas reutilizáveis, WebSocket em tempo real, PWA e integração com <strong>Inteligência Artificial</strong>. Diferencial em transformar sistemas legados em soluções modernas, escaláveis e de alto impacto para o negócio.
    </p>

    <div class="section-title">Experiência Profissional</div>

    <div class="exp-item">
      <div class="exp-header">
        <div class="exp-role">Senior Full Stack Developer</div>
        <div class="exp-period">Set 2022 – Mar 2026 &nbsp;·&nbsp; 3a 7m</div>
      </div>
      <div class="exp-company">Global 5 Gerenciadora de Riscos &nbsp;·&nbsp; Curitiba, PR</div>
      <ul class="exp-bullets">
        <li>Desenvolvimento Full Stack de ponta a ponta com <strong>Angular 14+</strong> e <strong>.NET Core 6/8</strong>, entregando interfaces responsivas e APIs robustas.</li>
        <li>Arquitetura e criação de <strong>biblioteca de componentes reutilizáveis</strong> (design system interno), reduzindo tempo de desenvolvimento em até 40%.</li>
        <li>Implementação de <strong>WebSocket</strong> para comunicação em tempo real e <strong>PWA</strong> para uso offline.</li>
        <li>Modernização de sistema legado <strong>FoxPro</strong>: reescrita completa em stack moderna, com ganho mensurável de performance.</li>
        <li><strong>Liderança técnica</strong>: Scrum diário, definição de metas, code review e mentoria de desenvolvedores juniores.</li>
        <li>Implantação de pipeline <strong>CI/CD</strong> com GitHub Actions — eliminando deploys manuais.</li>
        <li>Aplicação consistente de <strong>SOLID</strong>, Design Patterns e Clean Architecture em múltiplas camadas.</li>
        <li>Uso intensivo de <strong>GitHub Copilot</strong> e ferramentas de IA para acelerar ciclos de entrega.</li>
      </ul>
    </div>

    <div class="exp-item">
      <div class="exp-header">
        <div class="exp-role">Desenvolvedor de Software Embarcado</div>
        <div class="exp-period">Mai – Set 2022 &nbsp;·&nbsp; 5m</div>
      </div>
      <div class="exp-company">Henry Equipamentos Eletrônicos e Sistemas &nbsp;·&nbsp; Pinhais, PR</div>
      <ul class="exp-bullets">
        <li>Desenvolvimento de <strong>firmware em C</strong> para microprocessadores de sistemas de controle de acesso biométrico.</li>
        <li>Projeto de sistema de biometria: processamento de imagens, reconhecimento de padrões e algoritmos de triangulação.</li>
      </ul>
    </div>

    <div class="exp-item">
      <div class="exp-header">
        <div class="exp-role">Desenvolvedor Android</div>
        <div class="exp-period">Jan 2020 – Jan 2021 &nbsp;·&nbsp; 1 ano</div>
      </div>
      <div class="exp-company">Android Studio Solutions &nbsp;·&nbsp; Curitiba, PR</div>
      <ul class="exp-bullets">
        <li>Desenvolvimento de aplicativo Android nativo com armazenamento <strong>criptografado</strong> de dados sensíveis e exportação segura de relatórios.</li>
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
  Marcos Kettermann &nbsp;·&nbsp; marcosk10@yahoo.com.br &nbsp;·&nbsp; linkedin.com/in/marcosk10 &nbsp;·&nbsp; github.com/mkettermann
</div>

<div class="end-file">
Senior Full Stack Developer - Desenvolvedor Sênior Engenheiro de Software Engineer Web Frontend Backend Angular 14 14+ Material TypeScript JavaScript ES6 ES6+ React React.js RxJS HTML HTML5 CSS CSS3 Tailwind Bootstrap 5 jQuery PWA Progressive App DOM AJAX Fetch API .NET 6 8 C# ASP.NET Core MVC Node.js Spring Boot Java Thymeleaf REST APIs WebSocket JWT Token Authentication Security Functional Programming Clean Architecture DDD SOLID Design Patterns Factory Pattern Repository Observer SQL Advanced Server PostgreSQL MySQL MongoDB Firebase Redis NoSQL Banco Dados AWS Amazon Services Azure DevOps Docker Git GitHub Actions CI/CD Pipeline Power BI Microsoft 365 Visual Studio Figma Copilot Inteligência Artificial IA Intelligence Machine Learning Produtividade Arduino Firmware Embarcado C Embedded Biometria Liderança Técnica Technical Leadership Gestão Projetos Project Management Agile Scrum LGPD Compliance Code Review Mentoria Mentoring Networking Pensamento Estratégico Strategic Thinking Inglês English Português Portuguese LinkedIn DevMedia Duolingo Curitiba Paraná Brasil Brazil Remoto Híbrido Presencial Disponível Remote Hybrid On-site Tecnólogo Análise e Desenvolvimento Sistemas OPET ADS 20 anos experiência sênior arquitetura distribuída sistemas distribuídos design system biblioteca componentes reutilizáveis em tempo real FoxPro modernização legado sistema reescrita liderança técnica code review mentoria junior deploy automatizado pipeline automatização biometria reconhecimento padrões processamento imagens firmware microprocessador controle acesso criptografia Android app mobile aplicativo Testes unitários testes integração automatizados segurança dados proteção sensíveis exportação relatórios criptografados UI UX responsivo acessibilidade performance otimização escalabilidade alto impacto negócios resultados mensuráveis transformação digital inovação tecnologia tendências do mercado desenvolvimento web evolução tecnológica aprendizado contínuo certificações profissionais profissional crescimento carreira oportunidades desafios soluções positivo contribuição valor diferencial competitivo especialização conhecimento técnico habilidades técnicas interpessoais soft skills comunicação trabalho equipe colaboração resolução problemas pensamento crítico criatividade adaptabilidade rápido proatividade iniciativa foco orientação a detalhes organização gestão multitarefa pressão prazos flexibilidade mindset mentalidade pessoal sucesso realização satisfação no equilíbrio vida-trabalho work-life balance mestrado doutorado PhD pós-graduação cursos online formação acadêmica educação continuada ao longo da vida lifelong learning networking conexões comunidade eventos conferências palestras workshops meetups open source código aberto projetos pessoais portfólio github repositórios destaque colaborativos inovadores social para o bem futuro automação inteligência artificial machine máquina deep redes neurais linguagem natural NLP visão computacional ética responsabilidade inclusiva diversidade inclusão todos assistiva pessoas com deficiência PCD sustentável sustentabilidade ambiental verde energia renovável eficiência energética computação nuvem cloud computing edge borda cibernética cybersecurity privacidade informação compliance regulamentações GDPR aplicações ofensiva pentesting ethical hacking defensiva monitoramento resposta incidentes SIEM SOC architecture autenticação multifator MFA facial voz baseada risco identity access management IAM identidade autorização RBAC ABAC políticas governança TI IT governance riscos risk continuidade business continuity planejamento recuperação disaster recovery estratégico strategic planning inspiradora servidora situacional transformacional autêntica adaptativa visionária colaborativa ágil remota equipes talentos cultura organizacional orientada centrada cliente usuário centrado thinking ser humano human-centered pesquisa usuários user research prototipagem prototyping usabilidade usability testing feedback melhoria contínua continuous improvement ciclo PDCA Kaizen metodologia agile methodology Kanban Lean software development enxuto integration entrega delivery implantação deployment infraestrutura como IaC observabilidade logging tracing métricas microserviços event-driven mensagens message-driven hexagonal limpa clean domain-driven orientado domínio microsserviços microservices monolítica monolithic camadas layered serviços service-oriented SOA serverless sem servidor Google Cloud plataforma serviço PaaS IaaS SaaS híbrida hybrid pública public privada private GraphQL gRPC Middleware OAuth Microserviços Monolito ORM Endpoint Payload Serialização Cache Filas Message-Broker RabbitMQ Kafka Event-Driven CQRS Event-Sourcing Clean-Architecture Singleton Repository-Pattern Dependency-Injection SSE Rate-Limiting Throttling Idempotência Express NestJS Python FastAPI Go Golang Spring-Boot Rust Autenticação Autorização Helmet.js CORS HTTPS TLS Webhook Paginação Cursor-Pagination Multitenancy Tenant Slug Wildcard Host-Header Monorepo Turborepo pnpm npm Yarn Vue.js Svelte Signals Component Directive Pipe Guard Interceptor Service Module Lazy-Loading OnPush Change-Detection Observable Subject Computed Effect SPA SSR SSG CSR Routing skipLocationChange RouterOutlet ActivatedRoute Reactive-Form Template-driven-Form Validators AG-Grid Cell-Renderer agInit NgRx Tailwind-CSS Sass SCSS CSS-Variables Responsividade Media-Query Flexbox CSS-Grid Tree-Shaking Bundle Webpack Vite esbuild Source-Map i18n a11y ARIA CSP Web-Vitals LCP FCP CLS SQLite Elasticsearch DynamoDB Firestore Schema Migration Seed Index Primary-Key Foreign-Key Join Transaction ACID Normalização Desnormalização VIEW Stored-Procedure Trigger Connection-Pool Query-Builder Prisma TypeORM Knex.js Sequelize BIGINT UUID JSONB Full-text-Search Replication Sharding Backup Snapshot Container Dockerfile Docker-Compose Kubernetes Helm Pod Service-Mesh Istio GitHub-Actions GitLab-CI Jenkins Terraform Ansible GCP Railway Heroku Vercel Netlify Nginx Load-Balancer Auto-Scaling DNS CDN Proxy-Reverso Serverless Lambda Log Monitoring Alerting Grafana Prometheus Datadog Sentry Observabilidade Tracing OpenTelemetry Blue-Green-Deploy Canary-Release Rollback Ambiente Secrets Vault SSH Backlog Sprint Épico User-Story Task Bug Feature MVP PoC Roadmap Milestone Deadline Estimativa Story-Points Velocity Definition-of-Done Acceptance-Criteria Daily Retrospectiva Planning Refinamento Demo Stakeholder Product-Owner Scrum-Master Tech-Lead Release Hotfix Deploy Blocker Dependência WIP Pull-Request Code-Review Branch Merge Changelog Versionamento-Semântico Documentação Wiki SLA KPI OKR ROI TCO Budget Headcount Onboarding Offboarding 1:1 Feedback Performance-Review Squad Chapter Guild Tribe C-level CTO CPO Engineering-Manager People-Manager Matriz-RACI Priorização Trade-off Escalação Alinhamento Governança Auditoria Vendor RFP B2B B2C Churn NPS Time-to-Market Go-live Post-mortem Incident RCA Runbook Playbook Cultura Psychological-Safety Burnout Work-life-Balance Firewall VPN IDS IPS WAF DDoS Pentest Vulnerability-Scan OWASP SQL-Injection XSS CSRF SSRF RCE Brute-Force Credential-Stuffing 2FA SSO SAML OpenID-Connect PKI Certificado-Digital CA Criptografia AES RSA SHA Hash Salt Bcrypt Argon2 Zero-Trust Least-Privilege Segmentação-de-Rede DMZ Hardening Patch-Management CVE CVSS Exploit Payload-Malicioso Engenharia-Social Phishing Ransomware Malware Spyware Rootkit Zero-Day Bug-Bounty Responsible-Disclosure Threat-Intelligence Red-Team Blue-Team Purple-Team DAST SAST Fuzzing Code-Signing Supply-Chain-Attack Secrets-Scanning Container-Security SBOM
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


