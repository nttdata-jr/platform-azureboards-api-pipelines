const core = require('@actions/core');
const fetch = require('node-fetch');

async function run() {
  try {
    const payload = JSON.parse(core.getInput('payload'));
    const pat = payload.azure_pat;
    const org = payload.org;
    const project = payload.project;
    const title = payload.title;
    const description = payload.description;
    
    const url = `https://dev.azure.com/${org}/${project}/_apis/wit/workitems/$Task?api-version=7.1`;
    const auth = Buffer.from(':' + pat).toString('base64');
    const body = [
      { "op": "add", "path": "/fields/System.Title", "value": title },
      { "op": "add", "path": "/fields/System.Description", "value": description },
      { "op": "add", "path": "/fields/System.AreaPath", "value": "NTT Ingeniería de Plataformas\\Versionador" },
      { "op": "add", "path": "/fields/Microsoft.VSTS.Common.Activity", "value": "Development" },
      { "op": "add", "path": "/fields/Custom.GrupoResponsable", "value": "Arquitectura" },
      { "op": "add", "path": "/fields/Microsoft.VSTS.Scheduling.OriginalEstimate", "value": 0 },
      { "op": "add", "path": "/fields/System.State", "value": "New" },
      { "op": "add", "path": "/fields/System.Tags", "value": "Pendiente Aprobacion" }
    ];

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json-patch+json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(body)
    });

    const respBody = await resp.text();
    core.info(`Status: ${resp.status}`);
    core.info(`Response: ${respBody}`);
    if (!resp.ok) {
      core.setFailed(`Error creating work item: ${resp.status} - ${respBody}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
