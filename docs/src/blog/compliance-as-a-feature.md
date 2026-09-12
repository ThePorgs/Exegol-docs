---
title: Exegol as a compliance tool
date: 2026-08-21
author: Charlie
description: Legal frameworks around cybersecurity have multiplied worldwide. Many Exegol subscribers care about compliance as much as plug-and-play tooling.
sidebar: false
tags:
  - compliance
  - PASSI
  - LPM
  - NIS2
  - DORA
  - enterprise
---

# Exegol as a compliance tool

We like to think of Exegol as one of the best plug-and-play offensive security environments. Ready tools, containers per engagement, less time as a part-time sysadmin. We wrote about [saving time](/blog/saving-time) and [how heavy it actually is](/blog/how-heavy-is-exegol) for that reason. We also wrote about why and how [we went pro](/blog/exegol-goes-pro) in 2025, to develop Exegol full-time and create great things.

Considering its growing number of users, Exegol is liked by the experts, but there is another motive we hear from customers, especially Enterprise: **compliance.**

Companies need an operational stack that makes audit work *defensible*: isolation between clients, a known and reproducible toolkit, session evidence, clean workspaces, and less risk that yesterday's loot sits next to tomorrow's engagement. Legal frameworks that force cybersecurity controls, or that force companies to *prove* they test them, have multiplied in the last few years. Offensive security work sits right in the middle of that.

Exegol was born in France. That can read as a plus or a minus, depending on who you ask. France is one of Europe's oldest continuous states, with a culture that leans hard on regulation, procedure, and written proof. That instinct is part of Exegol's DNA. At the same time, we (the founders) carry a strong international culture and a very product-oriented approach. Ship something people actually want to use Monday morning, not a paperwork generator. So Exegol is built for both audiences: **effectiveness** for the operator, **compliance** for whoever has to stand behind the work.

This post walks the regulatory landscapes and how Exegol fits.

## The regulatory wave

A decade ago, many organizations treated penetration testing as good practice or a checkbox for ISO. Today, laws and sector rules increasingly *require* risk management, resilience testing, incident disclosure, and competent third-party audits. The market for serious offensive work grew with that.

### 🇪🇺 European Union

**[NIS2](https://eur-lex.europa.eu/eli/dir/2022/2555/oj)** ([Directive (EU) 2022/2555](https://digital-strategy.ec.europa.eu/en/policies/nis2-directive)) replaced NIS1. Wider scope (essential and important entities across many critical sectors), stronger risk-management duties, supply-chain attention, incident reporting, and management accountability. Member States had to transpose it by October 2024. Enforcement is national and uneven, but the direction is clear: entities must manage cyber risk in a documented way. Regular security assessments and testing are how many of them show that.

**[DORA](https://eur-lex.europa.eu/eli/reg/2022/2554/oj)** ([Regulation (EU) 2022/2554](https://finance.ec.europa.eu/regulation-and-supervision/financial-services-legislation/implementing-and-delegated-acts/digital-operational-resilience-regulation-dora_en)) is the financial sector's ICT resilience rulebook. Fully applicable since 17 January 2025. It is a *regulation* (direct effect), not a directive. For financial entities it is often *lex specialis* relative to NIS2 on overlapping ICT topics. Beyond baseline resilience testing, designated entities must run **threat-led penetration testing (TLPT)** at least every three years on live systems supporting critical or important functions ([Article 26](https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32022R2554)), with tester fitness rules under Article 27. That is not a casual weekend scan. It is structured red-team work with evidence, scope control, and supervisory oversight.

Member States then add their own overlays. A few national pictures below (France first, because that is where Exegol and a large share of our Enterprise customers live; then Belgium, Luxembourg, Italy, Germany, and Spain).

#### 🇫🇷 France

France already had a dense [ANSSI](https://cyber.gouv.fr/) (*Agence nationale de la sécurité des systèmes d'information*, France's national cybersecurity authority) ecosystem before NIS2. As of August 2026, that stack looks roughly like this:

- **[LPM](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000028338825) and the OIV / SIIV regime.** The cyber chapter that still shapes French critical operators comes from the [*loi de programmation militaire*](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000028338825) (LPM, Military Programming Act). Designated **[OIV](https://cyber.gouv.fr/reglementation/cybersecurite-systemes-dinformation/directives-nis-nis2-et-dispositif-saiv/dispositif-saiv/)** (operators of vital importance) must protect their **SIIV** (information systems of vital importance). Duties include declaring SIIV, applying sector security rules, notifying incidents to ANSSI, and submitting to security controls. Those controls are run by ANSSI, another State service, or a **PASSI** qualified for LPM work. Homologation (*homologation de sécurité*, security accreditation) and control audits are a major reason PASSI exists as a market, not only as a badge.

- **NIS2 transposition (late).** The EU deadline was 17 October 2024. France has not finished transposing. The bill, nicknamed the *loi Résilience* (Resilience Act), cleared the [Sénat](https://www.senat.fr/) (Senate) and an [Assemblée nationale](https://www.assemblee-nationale.fr/) (National Assembly) committee, but has not been promulgated. In July 2026 the [European Commission](https://commission.europa.eu/) referred France to the [Court of Justice of the EU](https://curia.europa.eu/) over the delay. ANSSI has still published preparatory material ([ReCyF](https://cyber.gouv.fr/actualites/nis-2-lanssi-poursuit-et-renforce-sa-dynamique-daccompagnement/) / *Référentiel Cyber France* (Cyber France Framework), and [MonEspaceNIS2](https://monespacenis2.cyber.gouv.fr/) ("My NIS2 Space")), so entities are preparing against a draft regime while the law itself is stuck. Late does not mean "ignore it." It means French buyers and providers are living in a messy interim: EU pressure up, national text not finished. LPM / OIV obligations remain.

- **[PASSI](https://cyber.gouv.fr/offre-de-service/solutions-certifiees-et-qualifiees/comprendre-levaluation-de-securite/qualification-de-produit-et-services/referentiels-qualification/)** (*Prestataire d'Audit de la Sécurité des Systèmes d'Information*, Information Systems Security Audit Provider). ANSSI qualification for security audit providers under the [RGS](https://cyber.gouv.fr/reglementation/reglementation-identite-confiance-numerique/securite-echanges-voie-electronique/referentiel-general-de-securite/documents-referentiel-general-de-securite/) (*Référentiel général de sécurité*, General Security Framework). Five scopes: architecture, configuration, source code, **penetration testing**, organizational and physical. PASSI v2.2 splits each scope into **Substantial** and **High** assurance (portfolio-heavier path vs heavier exams, on-site observation, and stricter requirements on the provider's own IS). For LPM / OIV controls and homologation, RGS paths, [SecNumCloud](https://cyber.gouv.fr/offre-de-service/solutions-certifiees-et-qualifiees/comprendre-levaluation-de-securite/qualification-de-produit-et-services/referentiels-qualification/)-related expectations, and buyers who want ANSSI-aligned assurance, a PASSI-qualified provider is often the expected or preferred choice (see the [list of qualified providers](https://cyber.gouv.fr/produits-services-qualifies)). Evaluators look at the firm, the people, and how audits are run: methodology, ethics, protection of audit data, coordination with the auditee, reporting discipline, and traceability.

- **Other ANSSI-qualified services**, in the same [family of requirements baselines](https://cyber.gouv.fr/offre-de-service/solutions-certifiees-et-qualifiees/comprendre-levaluation-de-securite/qualification-de-produit-et-services/referentiels-qualification/): PRIS (incident response provider), PDIS (incident detection provider), PACS (security support and consulting provider), SecNumCloud (cloud), and more. Same cultural signal: competence, process, and protection of sensitive engagement data.

That stack is why a growing number of companies (MSSPs, CAC 40, banks, insurers, retail, and the public sector) come to us for their offensive security environments, including PASSI-qualified providers. We keep track of those regulatory changes so our customers can check the boxes they are expected to check without turning every engagement into a compliance project. Isolation per client, shell logging, a documented and versioned toolkit, workspaces that clean up: the controls evaluators ask for, baked into how Exegol works. [Kali Linux](https://www.kali.org/), [ParrotSec](https://www.parrotsec.org/), and the usual DIY stacks do not do that for you. You can approximate it, but only with heavy work from the end-user. And the end-user often does not care about those frameworks: they get in the way. The firm still has to care. Exegol is built so the operator stays effective while the organization stays defensible.

#### 🇧🇪 Belgium

Belgium was an early mover on NIS2. The [Law of 26 April 2024](https://ccb.belgium.be/regulation/nis2) (framework for cybersecurity of networks and information systems of general interest for public security), completed by a [Royal Decree](https://ccb.belgium.be/news/adoption-nis2-royal-decree), transposed the directive with application from October 2024. The [Centre for Cybersecurity Belgium (CCB)](https://ccb.belgium.be/) is the national cybersecurity authority and national CSIRT, with sectoral authorities in support. Belgium is distinctive for tying conformity assessment to the CCB's [CyberFundamentals (CyFun)](https://ccb.belgium.be/) framework (and optionally ISO/IEC 27001): essential entities face mandatory assessment paths and staged deadlines (including milestones in 2026 and 2027). Registration and practical guidance sit on [Safeonweb@work](https://atwork.safeonweb.be/). For offensive teams selling into Belgian essential / important entities, the ask is familiar: documented risk management, incident handling, and evidence you can show a conformity assessor.

#### 🇱🇺 Luxembourg

Luxembourg's NIS2 transposition arrived later: the [Law of 5 May 2026](https://legilux.public.lu/eli/etat/leg/loi/2026/05/05/a225/jo) on measures to ensure a high level of cybersecurity (in force from 10 May 2026; see also the [ILR NIS2 pages](https://www.ilr.lu/secteurs-activites/niss/nis-2/)). The [Institut Luxembourgeois de Régulation (ILR)](https://www.ilr.lu/) (Luxembourg Institute of Regulation) is the competent supervisory authority; the [Haut-Commissariat à la Protection nationale (HCPN)](https://hcpn.gouvernement.lu/) (High Commission for National Protection) is the national single point of contact and cyber crisis authority (home of [GOVCERT.LU](https://www.govcert.lu/)). Incident early warning / notification runs through ILR (including the SERIMA channel), on the familiar NIS2 24h / 72h cadence. Luxembourg's finance-heavy economy also sits under DORA for in-scope financial entities. Same operational implication for auditors: isolation, logs, and a reproducible toolkit when you test entities that will be asked to prove resilience.

#### 🇮🇹 Italy

Italy transposed NIS2 with [Legislative Decree No. 138 of 4 September 2024](https://www.gazzettaufficiale.it/eli/id/2024/10/01/24G00155/sg) (*decreto NIS*), in force from 16 October 2024 ([ACN overview](https://www.acn.gov.it/portale/nis/la-normativa)). The [Agenzia per la Cybersicurezza Nazionale (ACN)](https://www.acn.gov.it/) is the national competent authority and single point of contact, operating [CSIRT Italia](https://www.acn.gov.it/), with sector ministries in support. Italy runs registration and updates as a recurring cycle rather than a one-shot list, and rolls out security-measure and notification duties on staged clocks after ACN consolidates NIS subjects. Italy also keeps a strong national-security cyber perimeter culture from earlier frameworks. For providers: expect formal registration of targets, ACN-shaped expectations on how assessments are done, and demand for pentests / red-team work that leaves an audit trail.

#### 🇩🇪 Germany

Germany's NIS2 transposition is the [NIS2-Umsetzungsgesetz (NIS2UmsuCG)](https://www.bsi.bund.de/DE/Themen/Regulierte-Wirtschaft/NIS-2-Richtlinie/nis-2-richtlinie_node.html), published December 2025 and in force from 6 December 2025, rebuilding the BSI-Gesetz around the [Bundesamt für Sicherheit in der Informationstechnik (BSI)](https://www.bsi.bund.de/). Registration, risk management, and reporting duties under the revised BSIG apply without a long general grace period; KRITIS operators also sit under a separate physical-resilience track (KRITIS-Dachgesetz). Germany's market for security testing was already large under the older KRITIS / BSIG world; NIS2 widens who must show up with managed ICT risk and incident reporting. Offensive engagements for German essential / important entities increasingly need evidence that matches BSI-shaped expectations: scope control, methodology, and reproducible environments.

#### 🇪🇸 Spain

Spain has not finished NIS2 transposition as of August 2026. The government approved an [*Anteproyecto de Ley de Coordinación y Gobernanza de la Ciberseguridad*](https://www.dsn.gob.es/) (January 2025), but the text has not completed the full legislative path / BOE publication. Until then, the NIS1-era frame ([Real Decreto-ley 12/2018](https://www.boe.es/buscar/act.php?id=BOE-A-2018-12257) and related rules) still matters in practice, with supervision split between the [Centro Criptológico Nacional (CCN)](https://www.ccn.cni.es/) (public sector / ENS) and [INCIBE](https://www.incibe.es/) (private sector / citizens), plus sector regulators. Spain is in the late camp with France on the directive clock, while buyers still buy audits and pentests under national security schemes and contractual pressure. Messy interim, same tooling needs.

### 🇲🇨 Monaco

Monaco is not in the EU and does not transpose NIS2, but its cyber regime is clearly in the French-speaking OIV family. [Law No. 1.435 of 8 November 2016](https://journaldemonaco.gouv.mc/) on fighting technological crime (*lutte contre la criminalité technologique*) set security and incident duties for **operators of vital importance** (OIV) and their information systems of vital importance (SIIV). [Law No. 1.578 of 1 July 2025](https://www.99avocats.com/en/publications/law-no-1-578-of-1-july-2025-amending-various-digital-provisions-monaco) stiffened those obligations and raised penalties; [Ministerial Order No. 2025-533](https://journaldemonaco.gouv.mc/Journaux/2025/Journal-8768/Arrete-Ministeriel-n-2025-533-du-3-octobre-2025-portant-modification-de-l-arrete-ministeriel-n-2018-1053-du-8-novembre-2018-portant-application-de-l-article-27-de-la-loi-n-1.435-du-8-novembre-2016-relative-a-la-lutte-contre-la-criminalite-technologique) (3 October 2025) tightened the implementing rules (including annual security-level reporting to the authority). The national authority is the [Agence Monégasque de Sécurité Numérique (AMSN)](https://amsn.gouv.mc/) (Monegasque Digital Security Agency), which hosts CERT-MC and cooperates closely with France's ANSSI. Monaco has also signalled voluntary alignment with NIS2-style ideas. Same operational ask as next door: defensible testing environments when you touch OIV / SIIV scopes.

### 🇨🇭 Switzerland

Switzerland is not in the EU and does not transpose NIS2. Its own track is the [Information Security Act (ISG / ISA)](https://www.fedlex.admin.ch/eli/cc/2022/232/de) (*Informationssicherheitsgesetz*), amended to add a mandatory reporting duty for cyberattacks on critical infrastructure, in force from 1 April 2025, with implementing detail in the [Cybersecurity Ordinance](https://www.ncsc.admin.ch/ncsc/en/home/meldepflicht/gesetzliche-grundlagen-mp.html). Operators in listed sectors (energy, water, transport, health, finance, digital infrastructure, public administration, and others as defined) must report qualifying cyberattacks to the federal cyber authority ([NCSC](https://www.ncsc.admin.ch/)) within 24 hours of discovery. Switzerland's model is list-and-exemption rather than NIS2's economy-wide size thresholds, but the operational effect for critical operators is the same family: incident readiness, documented controls, and third-party testing that can survive scrutiny. Cross-border firms often map Swiss duties next to EU NIS2 / DORA for the same group.

### 🇬🇧 United Kingdom

Post-Brexit, the UK does not apply NIS2 as such. The core statute for operators of essential services and relevant digital service providers remains the [Network and Information Systems Regulations 2018](https://www.legislation.gov.uk/uksi/2018/506/contents/made), supervised by sector competent authorities with the [NCSC](https://www.ncsc.gov.uk/) as the technical authority / CSIRT role. Reform is in flight via the [Cyber Security and Resilience (Network and Information Systems) Bill](https://commonslibrary.parliament.uk/research-briefings/cbp-10442/), aimed at expanding scope, strengthening regulators, and updating incident reporting. Add sector regimes (finance, telecoms, and so on) and NCSC guidance culture. UK buyers of offensive work still ask for segregation, evidence, and professional ops: the acronyms differ from Brussels, the Monday-morning toolkit problem does not.

### 🇺🇸 United States

The US has no single nationwide cybersecurity law that covers everyone the way NIS2 aims to in the EU. What you get instead is a stack of overlapping regimes:

- **[SEC](https://www.sec.gov/)** [cybersecurity disclosure rules](https://www.sec.gov/newsroom/press-releases/2023-139) (effective for most issuers from late 2023 / 2024): material incidents on Form 8-K within four business days of a materiality determination; annual disclosure of cyber risk management, strategy, and governance. Boards and management need a story they can defend. Penetration testing and adversary simulation often sit in that story as evidence of process. Not as a statutory "you must pentest," but as practice investors and counsel expect.
- **Defense and federal supply chain:** [CMMC](https://www.acq.osd.mil/cmmc/) and [NIST SP 800-171](https://csrc.nist.gov/pubs/sp/800/171/r3/final) for contractors handling Controlled Unclassified Information; assessment and continuous monitoring culture. [NIST SP 800-115](https://csrc.nist.gov/pubs/sp/800/115/final) remains the classic technical guide for security testing.
- **Sector rules** (finance, healthcare, critical infrastructure) keep pushing vulnerability management, third-party risk, and periodic testing.

US buyers of offensive services increasingly ask how you segregate client data, how you log work, and how you keep tools under control. Same themes as Europe, different acronyms.

### 🇨🇦 Canada

Canada sits in the same common-law / critical-infra family as the UK and US, with a federal stack that finally caught up in statute form. [Bill C-8](https://www.parl.ca/legisinfo/en/bill/45-1/c-8) (*An Act respecting cyber security*) received royal assent on 15 June 2026 ([S.C. 2026, c. 9](https://laws.justice.gc.ca/eng/AnnualStatutes/2026_9/page-1.html)). It does two things operators care about:

- **Telecommunications:** amendments to the [Telecommunications Act](https://laws-lois.justice.gc.ca/eng/acts/T-3.4/) add security as a policy objective and give the government stronger powers to direct carriers against threats. Those telecom changes took effect on assent.
- **Critical cyber systems:** the new [Critical Cyber Systems Protection Act](https://laws.justice.gc.ca/eng/AnnualStatutes/2026_9/page-1.html) (CCSPA) frames duties for designated operators of vital services in federally regulated sectors (finance, telecommunications, energy, transportation, and others as designated): cyber security programs, supply-chain / third-party risk, incident reporting, and compliance with cyber security directions. CCSPA rolls out on a phased schedule set by the Governor in Council, so as of August 2026 the statute is on the books while operator classes and many operational details are still landing by regulation.

Beside that, privacy and sector rules already bite: [PIPEDA](https://www.priv.gc.ca/en/privacy-topics/privacy-laws-in-canada/the-personal-information-protection-and-electronic-documents-act-pipeda/) federally, stricter provincial regimes such as Quebec's Law 25, [OSFI](https://www.osfi-bsif.gc.ca/) expectations for federally regulated financial institutions, and [Canadian Centre for Cyber Security](https://www.cyber.gc.ca/) (CSE) guidance culture. Canadian buyers of offensive work ask the same hygiene questions as their US and UK peers: isolation, evidence, a toolkit you can name.

### 🇦🇺 Australia

Australia's main critical-infrastructure cyber frame is the [Security of Critical Infrastructure Act 2018](https://www.legislation.gov.au/C2018A00029/latest/text) (SOCI), expanded in recent years with risk-management programs, incident reporting, and government directions for defined critical assets. The [Australian Signals Directorate](https://www.asd.gov.au/) / [ACSC](https://www.cyber.gov.au/) guidance culture (including the Essential Eight) sits beside sector regulators. Not NIS2, not CMMC, but the same buyer conversation: prove you tested, keep client work clean, leave evidence. Offensive teams working Australian critical entities need the same operational hygiene as their UK, US, and Canadian peers.

### 🌍 Others

Asia, Africa, and the Middle East do not share one NIS2-style directive. The common layout is still familiar: national cyber and data laws, a competent authority or national CERT, critical-sector or government baselines, privacy / personal-data acts with real breach duties, and buyers (banks, telcos, energy, public suppliers) who now expect documented assessment work. Statutes differ; the Monday-morning ask does not.

Worth calling out without pretending to map every capital:

- **Asia:** China's [CSL](https://digichina.stanford.edu/work/translation-cybersecurity-law-of-the-peoples-republic-of-china-effective-june-1-2017/) / [DSL](https://en.spp.gov.cn/2021-06/10/c_948426_2.htm) / [PIPL](https://personalinformationprotectionlaw.com/) triad; Singapore's [Cybersecurity Act](https://sso.agc.gov.sg/Act/CA2018) and licensed providers under the [CSA](https://www.csa.gov.sg/); Japan ([APPI](https://www.ppc.go.jp/en/legal/)) and Korea ([PIPA](https://law.go.kr/LSW/lsInfoP.do?chrClsCd=010203&lsiSeq=248613&urlMode=engLsInfoR&viewCls=engLsInfoR)) with sector overlays.
- **Africa:** the AU [Malabo Convention](https://au.int/en/treaties/african-union-convention-cyber-security-and-personal-data-protection) as continental aspiration (in force, ratification still partial); national stacks that bite day to day, such as Nigeria's [NDPA](https://ndpc.gov.ng/), South Africa's [POPIA](https://inforegulator.org.za/), and Kenya's [Data Protection Act](https://www.odpc.go.ke/).
- **Middle East:** authority-plus-controls catalogs (Saudi [NCA](https://nca.gov.sa/) ECC and peers), federal and free-zone privacy rules in the [UAE](https://u.ae/en/about-the-uae/digital-uae/data/data-protection-laws) ([DIFC](https://www.difc.ae/), [ADGM](https://www.adgm.com/)), Oman's [PDPL](https://www.mtcit.gov.om/), Qatar's [NCSA](https://www.ncsa.gov.qa/)-led baseline. Data localisation and sovereign-cloud language show up often in RFPs.

Zoom out and the story is global. Cybersecurity used to be optional polish on top of "IT that just works." Boards could treat testing as nice-to-have. That era is over. Across regions, cyber is **mandatory and controlled**: report incidents, manage risk, prove you tested, answer to a regulator or a supervisor. And increasingly it is not only *whether* you did the work, but **how** you conducted it: method, isolation, evidence, toolkit control. That is what reinforces the need for proper offensive environments, not snowflake laptops.

## The common requirements

Strip the acronyms and the ask is fairly consistent. And for each, we ask ourselves how we can provide an environment that supports it.

1. **Competent testing** against real systems (or agreed scopes), not theatre.
2. **Controlled methodology**: who did what, with which tools, under which rules of engagement. 
3. **Traceability**: enough evidence to reconstruct the engagement for the client, an evaluator, or a regulator.
4. **Segregation and protection of audit data**: findings, credentials, dumps, and reports are highly sensitive. Mixing clients is a professional failure and often a contractual or regulatory one.
5. **Reproducibility and team consistency**, especially when a qualification or a TLPT framework looks at how the provider works, not only at the PDF report.

That is where an offensive environment like Exegol stops being "nice tooling" and becomes part of the control surface of the *provider's* information system.

## Where Exegol fits

Exegol is **infrastructure for how offensive and audit work is actually done day to day**. That is exactly the layer where many compliance programs fail: policies on paper, chaotic practice. 

- You're a **pentest / red team leader**? You know exactly what chaos we're talking about, or at least the enormous amount of work it requires to steer out of it.
- You're a **provider stakeholder**? You've got responsabilities and you should take a real good look at how your engagements are conducted. Are you confident about your own compliance?
- You're a **pentest customer**? You should add contractual requirements on how your provider works. Ask questions. Challenge answers. Demand traceability, segregation and reproducibility.
- You're a **pentester / red teamer**? Exegol was founded by two people like you. We know what it means to have management ask for traceability, segregation and reproducibility. You don't have the tools, you don't have the time, and whatever you come with is going to be difficult to use and maintain. We've got you! 

### Isolation

Containers are cheap enough that one environment per client or per mission is normal. The [workspace](/wrapper/#workspace) lives on the host, bind-mounted at `/workspace`. Engagement artifacts stay with the engagement. You can remove a container when the mission ends without inventing a cleanup ritual across a shared VM that three people used for six clients.

That also means any laptop with Docker can become a production-ready offensive machine in minutes. Some contexts require that fresh setup every time (new hardware, loaner gear, a clean room for a classified or highly regulated scope, a contractor joining for one engagement). Isolation is not only "one container per client." It is the ability to stand up a known-good environment on demand and throw it away when the mission ends.

The same model works from the **customer's** side. A pentest or red-team buyer can install Exegol, pin the image, enable logging, and hand third-party auditors access to that environment instead of letting each firm bring its own snowflake laptop onto the scope. The controlled toolkit and evidence trail stay under the customer's roof; the auditors still do the testing.

Network modes matter for the same reason. Dedicated [NAT networking](/wrapper/#network-modes) gives a container its own isolated network instead of sharing Docker's default bridge with everything else on the host.

That maps to a simple compliance idea: **segregation of client work and reduction of cross-contamination.**

### Traceability

[Shell logging](/wrapper/cli/start#shell-logging) records commands and outputs under `/workspace/logs/` (asciinema by default, with optional compression). Enable it at container creation (`-l` / `--log`), or set `always_enable` in the [wrapper config](/wrapper/configuration) for teams that want logging as the default.

For PASSI-style and TLPT-style work, that is session evidence: what was typed, what came back, with timing. Useful for reporting, for peer review inside the firm, and for answering "show us how you worked" without reconstructing from bash history and hope.

Pair that with [Exegol-history](/images/exegol-history) (`exh`) so credentials are less likely to be hardcoded into the command line you are about to archive and share. Logs that are useful *and* less radioactive are easier to keep.

When the bar is higher than a replay file, **Exegol Sentinel** (Enterprise add-on) is the supervision layer. Each interactive command becomes one structured event on the Docker host: as typed and as actually resolved, with timing, exit code, and container identity. Optional profiles can collect extra evidence when a rule matches. The stream lands in a group-readable host directory a SIEM agent can already reach, without giving that agent a seat inside the container. Operators keep working normally; the audit record is a side effect, not a second job.

That pairs cleanly with the **customer-hosted** model above. If you stand up Exegol for third-party auditors, you can enable Sentinel and ship events into *your* SIEM. The provided environment stays under your roof, and it can be **supervised** when the engagement requires it: you see what ran on the scope you own, while the auditors still do the testing. Shell logging serves the report; Sentinel serves the control owner who has to stand behind the engagement.

### Consistency

Compliance programs hate snowflake machines. "Alice's Kali with random Git checkouts" does not survive methodology review as well as "we run image X, version Y, tools documented and regression-tested."

Exegol images ship a [documented toolset](/images/tools), installed under [installation standards](/contribute/images#installation-standards) (isolated environments, tested installs). Community (`free`) and Pro/Enterprise images have different update cadences; the point for a provider is the same: **you can name what you used**. When an evaluator or a client asks which stack produced the findings, you have an answer that is not "whatever was on the laptop that week."

Team alignment follows. That is an operational control as much as a productivity feature ([saving time](/blog/saving-time) again).

### Reproducibility

Need a second auditor on the same scope? Same image, new container, shared or copied workspace policy under your own procedures. Need to re-run a check six months later for a retest? Pin the image generation you used and keep the workspace. Docker's model (one image, many thin containers) is a better fit for "clean room per mission" than cloning full VMs and praying snapshots stay honest. We compared the storage side of that story in [How heavy is Exegol?](/blog/how-heavy-is-exegol).

### What Exegol is not

Worth being clear, because marketing blurbs often are not:

- Exegol is **not** a PASSI, PRIS, or SecNumCloud qualification.
- Exegol does **not** make your firm compliant with NIS2, DORA, CMMC, or anyone else's framework by itself.
- Exegol does **not** replace methodology, training, ethics rules, insurance, or how you store final reports in your IS.

It **is** a practical way to implement several controls those frameworks expect from people who perform intrusive testing: isolation, evidence, consistency, and less accidental mixing of secrets.

## Why subscribers bring this up

When a company buys Exegol Pro or Enterprise, they are often buying time and reliability. The same purchase frequently supports a compliance narrative:

| Pressure | What buyers need | What Exegol contributes |
|---|---|---|
| 🇫🇷 LPM / OIV / PASSI audits | Traceable pentests, protected audit data, consistent methods | Per-mission containers, shell logs, documented images, workspaces |
| 🇫🇷 NIS2 (once transposed) / ReCyF prep | Recurring assessments you can stand behind | Same environment across the team year after year |
| 🇪🇺 DORA TLPT / resilience testing (finance) | Serious red-team tooling and evidence for supervised tests | Ready offensive desktop, logging, isolation |
| 🇪🇺 NIS2 risk management (other Member States) | Documented testing under national regimes | Shared, versioned toolkit |
| 🇺🇸 SEC / US governance disclosure | Defensible cyber risk process | Professional ops hygiene for internal or vendor testing |
| 🌐 Multi-client consultancies (global) | No cross-client bleed | Workspace + container lifecycle discipline |

Plug-and-play gets you in the door. Compliance keeps the procurement and security teams in the conversation.

## Closing

Laws will keep coming. NIS2 and DORA will not be the last European words; Monaco and Switzerland run their own clocks next door; the UK, US, Canada, and Australia keep stacking common-law critical-infra regimes; everywhere else keeps thickening national stacks. The whole map has moved the same way: cyber is mandatory, controlled, and increasingly judged on *how* the work was done. France is a useful stress test of that mess: the LPM / OIV regime and PASSI already force *how* you audit critical systems, while NIS2 transposition is still late as of August 2026. We hear that from a growing French customer base. The same product still has to win on effectiveness. That is the point of playing both sides.

Exegol's job in that world is not to be a certificate on the wall. It is to be the environment where qualified people do qualified work without fighting their tools, and without leaving a mess that compliance cannot defend.

If you are building or maintaining a PASSI / LPM scope, a TLPT capability, or an internal red team under any of the regimes above, treat the offensive workstation as part of your control framework. We built Exegol so that part can be boring, repeatable, and logged.

*— Charlie, Co-founder and CEO*
