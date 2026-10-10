const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, 'data');
const LEADS_PATH = path.join(DATA_DIR, 'leads.json');

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(LEADS_PATH)) {
  fs.writeFileSync(LEADS_PATH, '[]', 'utf8');
}

const readLeads = () => {
  try {
    const raw = fs.readFileSync(LEADS_PATH, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

const writeLeads = (leads) => {
  fs.writeFileSync(LEADS_PATH, JSON.stringify(leads, null, 2), 'utf8');
};

app.use(express.static(ROOT));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'API funcionando', time: new Date().toISOString() });
});

app.post('/api/lead', (req, res) => {
  const body = req.body || {};
  const maybe = {
    servico: body.servico || '',
    objetivo: body.objetivo || '',
    momento: body.momento || '',
    prazo: body.prazo || '',
    investimento: body.investimento || '',
    nome: body.nome || '',
    empresa: body.empresa || '',
    detalhes: body.detalhes || '',
    createdAt: new Date().toISOString()
  };

  const leads = readLeads();
  leads.push(maybe);
  writeLeads(leads);

  res.status(201).json({
    ok: true,
    message: 'Diagnóstico recebido com sucesso.',
    lead: maybe
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
