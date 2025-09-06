




# ConsciusCMS

## 1. Overview

**ConsciusCMS** is a serverless, open-source CMS designed as much for *ethics and quality* as for speed and scale. It helps teams publish with purpose: truth-first checks, composable content models, and a zero-maintenance backend fully defined as Infrastructure as Code (IaC) on AWS.

### Why it exists
The web is flooded with content; signal is fragile. ConsciusCMS pairs a modern headless CMS with an ethical guardrail so creators (human or AI) pause, reflect, and elevate what they publish—instead of adding noise.

### What you get (at a glance)
- **Serverless CMS in minutes** — One CloudFormation stack stands up auth, API, storage, DB and CDN.
- **Headless by default** — Clean APIs for any frontend (React, Vue, mobile, SSG).
- **Ethical publishing** — Optional “conscience tokens” and AI checks to promote truthful, non-destructive content.
- **CI/CD ready** — GitHub Actions-friendly, predictable environments (QA/Prod).
- **Open by design** — Code under Apache-2.0; docs/content under CC BY 4.0.

---

## What the stack creates

### Parameters (inputs)
- `AccountName` *(String)*
- `Environment` *(qa | prod; default: qa)*
- `Region` *(us-east-1 | eu-west-3 | eu-south-2; default: eu-west-3)*
- `Domain` *(String)*
- `License` *(Entry | Advance | Enterprise; default: Entry)*
- `DomainPrefix` *(String; Hosted UI prefix for Cognito)*

### Identity & Auth
- **Cognito User Pool** with optional MFA  
  - Groups: **Admin**, **Editor**  
  - Hosted UI domain from `DomainPrefix`  
- **Custom Lambda Authorizer** (JWT)

### Data (DynamoDB)
- `PagesTable` (PK Page) — pages & templates  
- `SchemaTable` (PK page, SK component) — content models  
- `SettingsTable` / `SettingsSecTable` — config (public / sensitive)  
- `LoginsTable` — access audit  
- `ConscienceTokensTable` (PK Token, TTL ExpiresAt) — ethical tokens

### Compute (Lambda)
- `DDBAccessPages`, `DDBAccessSchema`, `DDBAccessSettings`, `DDBAccessSettingsSec`  
- `RecordLogin`, `GetLastLogin`, `CognitoTokenAuthorizer`  
- **Lambda@Edge** (Node.js) to serve `/index.html` when URI has no extension  
- **Layer**: `aws-jwt-verifier`

### API (API Gateway REST)
Resources & methods (selected):
- `/pages` — GET (public), POST/PUT/DELETE (auth)
- `/pages/{page}` — GET (public)
- `/schema` — GET (public), POST/PUT/DELETE (auth)
- `/schema/{page}` — GET (public)
- `/settings` — POST (auth); `/settings/{area}` — GET (public)
- `/settingsSec` — POST (auth); `/settingsSec/{area}` — GET (auth)
- `/file/{folder}/{file}` — PUT (auth), GET (public)
- `/lastlogin` — GET (auth)
- `/ethics/token` — POST (auth)

### Storage & CDN
- **S3 buckets**  
  - `WebsiteS3Bucket` (public web)  
  - `CMS3Bucket` (admin/UI with WebsiteConfiguration)  
  - `ContentS3Bucket` (media)  
- **Bucket policies** with CloudFront Origin Access Control (OAC)
- **CloudFront Distribution**  
  - Origins: Website, CMS, Content, API Gateway  
  - Default → Website (+ Lambda@Edge)  
  - Behaviors: `/admin/*` → CMS, `/content/*` → Content, `/prod/*` → API

### IAM
- Users for GitHub actions (scoped S3 access): `GitHubCMActionsAcct`, `GitHubWebActionsAcct`  
- Roles: `S3ContentAccessRole`, `MicroserviceExecutionRole`, `CognitoAuthLambdaExecutionRole`  
- Policies incl. `ConscienceTokensTablePolicy`

### Ops & Account bootstrap (StackSets)
- S3 **OPS** bucket `ap-<AccountName>-ops-<Region>-<Environment>`  
- SSM Parameters:
  - `/consciuscms/ops`, `/consciuscms/region`, `/consciuscms/license`,  
    `/consciuscms/account-name`, `/consciuscms/environment`,  
    `/consciuscms/lambda-edge`, `/consciuscms/webdomain`




## 📁 Proyect estructure

```
infrastructurasAWS/
├── README.md
├── new.yml   
├── frontend/                        # React app: frontend Code 
├── cminterface/                     # Ract app: content management       
├── new.yml                          # Template adicional
└── Infrastructures/
    ├── mainTemplate.yml             # Template principal del CMS
    └── accountFactory.yml           # Factory para múltiples cuentas
```

## 🚀 Despliegue

### Prerrequisitos

1. **AWS CLI** configurado con credenciales apropiadas
2. **CloudFormation** permisos de administrador
3. **Parámetros requeridos**:
   - Dominio web
   - Región de despliegue
   - Configuraciones de entorno

## 📝 Deployment Instructions

### 0. **Clone the repository**
   ```bash
   git clone https://github.com/<your-org>/ConsciusCMS.git
   cd ConsciusCMS/infrastructuresAWS
### 1. Run Account Factory (region: us-east-1)
Execute the accountFactory.yml script with the following parameters:

AccountName

Domain

Environment

License (Entry)

Region


aws cloudformation deploy \
  --template-file Infrastructures/accountFactory.yml \
  --stack-name conscius-accounts \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    AccountName=myproject \
    Domain=mydomain.com \
    Environment=qa \
    License=Entry \
    Region=us-east-1

### 2. Upload dependency layer
Upload the file aws-jwt-verifier.zip to the newly created OPS bucket.

### 3. Run Main Template
Execute the mainTemplate.yml in the region selected in step 1.

aws cloudformation deploy \
  --template-file Infrastructures/maintemplate.yml \
  --stack-name conscius-inf \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides \
    AccountName=myproject \
    Domain=www.mydomain.com \
    Environment=qa \
    License=Entry \
    Region=AWSRegion


### 4. Configure DNS
Point your domain DNS to the CloudFront distribution url created.



### 5. Complete domain validation to prove ownership.
Create the cname required to validate your certificate. Go certificate manager and follow DNS validatin instructions
Once validated, proceed to the next step.

### 6.  Add Alternate Domain in CloudFront
In the CloudFront distribution, add your custom domain as an Alternate Domain Name (CNAME).

### 8. Update API Gateway
Add the same custom domain in API Gateway.

### 9. Create GitHub Remote
Link your local code to a remote repository in GitHub.

### 9. Set up GitHub IAM Users

In IAM, create Access Keys for the two GitHub users created:

GitHubCMActionsAcct

GitHubWebActionsAcct

### 10.Add these keys as Secrets and Variables in your GitHub Actions workflows.

Update environment files
Modify the .env files in CMS Interface and Frontend with your system values.

Commit and push the repository

bash
Copy code
git add .
git commit -m "Initial setup"
git push origin main
Create your first Admin user in Cognito

Go to the Cognito User Pool created.

11. ### Create a new user and add them to the Admin group.

✅ Your system is now ready to run!





## 🤝 Contributing

We welcome contributions from developers, designers, and writers who share our mission of improving the quality of information on the internet.  
Ways you can contribute:  

1. **Fork** the project  
2. **Create a feature branch** (`git checkout -b feature/AmazingFeature`)  
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)  
4. **Push** to your branch (`git push origin feature/AmazingFeature`)  
5. **Open a Pull Request**  

You can also contribute by:  
- Proposing new templates and schemas  
- Improving documentation  
- Discussing ideas in GitHub Issues  

Adopting ConsciusCMS is not just technical — it is a commitment to truth and sustainability in digital publishing.  

---

## 📜 License

**ConsciusCMS License (Adapted from Apache 2.0 + CC BY 4.0)**  

ConsciusCMS is licensed under the Apache 2.0 and CC BY 4.0 licenses. This means that anyone is free to use, modify, and redistribute the code, provided the following conditions are met:

1. **Preservation of notices**  
   The original copyright and license notices must be preserved in any modified or redistributed version (Apache 2.0).  

2. **Attribution**  
   Credit must be given to the original project, ConsciusCMS, by clearly mentioning its origin (CC BY 4.0).  

3. **Integrity of purpose**  
   Any modification that removes or disables features, documentation or comment that promote the sustainability of information (truth, quality, and ethical publishing) must also remove the reference to ConsciusCMS. Such modified versions may not be presented or branded as ConsciusCMS.  

By adopting this licensing approach, we ensure that ConsciusCMS remains free, open, and accessible to all. This model encourages innovation and collaboration while protecting both the recognition and the ethical integrity of the project.  

---




## 📞 Soporte

Para soporte técnico o preguntas:

- **Email**: support@example.com
- **Issues**: GitHub Issues
- **Documentación**: [Wiki del proyecto](../../wiki)

## 🚧 Roadmap

### Próximas características:

- [ ] **CloudFront Distribution** completa
- [ ] **S3 Bucket definitions** 
- [ ] **Lambda Layers** para dependencias compartidas
- [ ] **API versioning**
- [ ] **Workflow de aprobación** para contenido
- [ ] **Templates/themes management**
- [ ] **SEO metadata management**
- [ ] **Multi-tenancy support**

---

