import Link from 'next/link';
import data from '../../data/all-documents.js';
import { jurisprudence } from '../../data/jurisprudence.js';
import { dossiers } from '../../data/dossiers.js';
import { publicLawFor } from '../../data/public-law.js';
import { dossierPacks, documentsForDossier } from '../../data/dossier-packs.js';
import { scopeOf, scopeName } from '../../lib/catalogue.mjs';
import { explanationFor } from '../../lib/explain.mjs';
import { packsForQuery, correlationFor } from '../../data/legal-relations.js';

const norm=(s='')=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();
const aliases={
  '48h':['48 h','duree maximale','temps de travail','repos'],
  '48 h':['48h','duree maximale','temps de travail','repos'],
  'astreinte':['action immediate','pers530','pers557','pers849','pers939','zha','zone habitat','mres','intervention','repos'],
  'pause':['pers77','pause meridienne','temps de travail'],
  'repas':['pers375','pers583','pers793','indemnite repas','repas sans deplacement','deplacement'],
  'discipline':['pers846','sanction','ep1','ep2','reglement interieur'],
  '11h':['repos quotidien','11 h'],
  '11 h':['repos quotidien','11h'],
};
const docText=d=>{const x=explanationFor(d);return norm([d.ref,d.title,d.theme,d.folder,d.kind,d.scopeLabel,d.origin,x.heading,x.simple,...(x.points||[]),x.related,...(d.relatedTexts||[]).map(v=>typeof v==='string'?v:v?.title)].filter(Boolean).join(' '));};
const caseText=j=>norm([j.court,j.date,j.number,j.title,j.issue,j.result,j.scope,...(j.topics||[])].join(' '));
const dossierText=d=>norm([d.title,d.subtitle,...d.queries,...d.sections.flatMap(s=>[s.title,s.text])].join(' '));
const tokens=q=>{const n=norm(q);const extra=Object.entries(aliases).filter(([k])=>n.includes(norm(k))).flatMap(([,v])=>v.map(norm));return [...new Set([...n.split(/\s+/).filter(Boolean),...extra.flatMap(x=>x.split(' '))])];};
const score=(hay,terms)=>terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0);
const uniqById=arr=>arr.filter((x,i,a)=>a.findIndex(y=>y.d.id===x.d.id)===i);
const isExtension=d=>/décision d.?extension|decision d.?extension|texte remis a jour|modifi|application de la circulaire|note aux unités/i.test(`${d.title||''} ${d.kind||''}`);
const refRegex=/\b(?:PERS\s*[- ]?\s*\d{1,4}[A-Z]?|DP\s*\d{1,2}\s*-\s*\d+[A-Z]?|N\s*\d{2}\s*-\s*\d+[A-Z]?)\b/gi;
const canonRef=r=>String(r||'').toUpperCase().replace(/[\s-]+/g,m=>m.includes('-')?'-':'').replace(/^PERS-?/,'PERS').replace(/^DP(\d+)-(\d+)$/,'DP$1-$2').replace(/^N(\d+)-(\d+)$/,'N$1-$2');
const refsIn=d=>{
  const x=explanationFor(d);
  const src=[d.ref,d.title,d.origin,x.related,...(d.relatedTexts||[]).map(v=>typeof v==='string'?v:v?.title)].filter(Boolean).join(' ');
  const refs=[...(src.match(refRegex)||[])].map(canonRef);
  if(d.ref) refs.push(canonRef(d.ref));
  return [...new Set(refs.filter(Boolean))];
};

function packForQuery(query){
  const q=norm(query);
  if(!q) return null;
  return dossierPacks
    .map(pack=>({pack,score:pack.triggers.reduce((n,t)=>n+(q.includes(norm(t))?Math.max(2,norm(t).split(' ').length):0),0)}))
    .filter(x=>x.score>0)
    .sort((a,b)=>b.score-a.score)[0]?.pack||null;
}

function LawBlock({items}){
  if(!items.length)return null;
  return <section className="law-bridge search-law-bridge"><div className="ieg-bridge-head"><div className="ieg-bridge-icon">📘</div><div><span>Niveau 1</span><h2>Droit commun & Europe</h2><p>Les règles générales qui structurent directement la question.</p></div></div><div className="law-grid">{items.map(x=><a className="law-card" href={x.url} target="_blank" rel="noopener noreferrer" key={x.id}><div><span>{x.level}</span><b>{x.ref}</b></div><strong>{x.title}</strong><p>{x.simple}</p><small><strong>Pourquoi ici :</strong> {x.why}</small><i>Source officielle ↗</i></a>)}</div></section>;
}

function CaseBlock({items}){
  if(!items.length) return <p className="muted">Aucune décision vérifiée n’est reliée à cette recherche.</p>;
  return <div className="search-case-grid">{items.map(({j})=><article className="search-case" key={j.id}>
    <span>⚖️ {j.court}</span><h3>{j.number}</h3><p>{j.result}</p>
    {j.judgment?.amounts?.length>0&&<div className="mini-amount">{j.judgment.amounts.slice(0,2).map(([label,amount])=><div key={label}><small>{label}</small><strong>{amount}</strong></div>)}</div>}
    <a href={j.url} target="_blank" rel="noopener noreferrer">Décision officielle / source ↗</a>
  </article>)}</div>;
}

function DocCard({item,label}){
  const {d}=item; const x=explanationFor(d);
  return <Link className="correlation-doc" href={`/textes/${d.id}`}>
    <div className="correlation-top"><span className={'stamp '+(scopeOf(d)==='grdf'?'grdf':'')}>{scopeName(scopeOf(d))}</span>{d.ref&&<b>{d.ref}</b>}<em>{label}</em></div>
    <h3>{x.heading||d.title}</h3>
    <p>{x.simple}</p>
    {item.why&&<small><strong>Pourquoi ce texte :</strong> {item.why}</small>}
    <i>Comprendre ce texte →</i>
  </Link>;
}

function SourceGroup({title,subtitle,items,label='À lire'}){
  if(!items.length)return null;
  return <section className="progress-source-group">
    <div className="progress-source-title"><span>{title}</span><small>{subtitle}</small></div>
    <div className="correlation-grid">{items.map(item=><DocCard key={item.d.id} item={item} label={label}/>)}</div>
  </section>;
}

export default async function Recherche({searchParams}){
  const p=await searchParams;
  const q=(p?.q||'').trim();
  const terms=tokens(q);
  const packs=q?packsForQuery(q):[];
  const dossierPack=q?packForQuery(q):null;
  const lawItems=q?publicLawFor(q):[];

  const lexical=q?data.map(d=>({d,s:score(docText(d),terms)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s):[];
  const maxScore=lexical[0]?.s||0;
  const strongest=lexical.filter(x=>x.s===maxScore).slice(0,10);
  const queryRefs=[...(q.match(refRegex)||[])].map(canonRef);
  const seedRefs=[...new Set([...queryRefs,...strongest.flatMap(x=>refsIn(x.d))])];

  const dossierLinked=dossierPack
    ? documentsForDossier(data,dossierPack.id).map(({document,relation})=>({
        d:document,s:relation.score,why:relation.why,dossierTier:relation.tier,
        kind:relation.tier==='related'||isExtension(document)?'extension':'correlation'
      }))
    :[];

  const packCorrelated=q?data.map(d=>{const rel=correlationFor(d,packs);return rel?{d,s:0,...rel}:null}).filter(Boolean):[];
  const autoCorrelated=q&&seedRefs.length?data.map(d=>{
    const drefs=refsIn(d); const hay=docText(d);
    const hits=seedRefs.filter(ref=>drefs.includes(ref)||hay.includes(norm(ref)));
    if(!hits.length) return null;
    return {d,s:0,kind:isExtension(d)?'extension':'correlation',why:`Ce document est relié à ${hits.join(', ')} : il le cite, l’applique, le modifie, l’étend ou reprend la même référence.`};
  }).filter(Boolean):[];

  const corrMap=new Map();
  [...autoCorrelated,...packCorrelated,...dossierLinked].forEach(x=>{
    const prev=corrMap.get(x.d.id);
    if(!prev||x.dossierTier||(!prev.pack&&x.pack)) corrMap.set(x.d.id,x);
  });
  const correlated=[...corrMap.values()];
  const correlatedIds=new Set(correlated.map(x=>x.d.id));
  const all=uniqById([...lexical,...correlated]);

  const linked=all
    .filter(x=>correlatedIds.has(x.d.id))
    .map(x=>corrMap.get(x.d.id)||x)
    .sort((a,b)=>(b.s||0)-(a.s||0));

  const directAll=linked
    .filter(x=>!isExtension(x.d))
    .filter(x=>!x.dossierTier||x.dossierTier==='core');

  const direct=directAll.slice(0,6);

  const supplements=[
    ...directAll.slice(6),
    ...linked.filter(x=>isExtension(x.d)||x.dossierTier==='related'||x.dossierTier==='direct')
  ].filter((x,i,a)=>a.findIndex(y=>y.d.id===x.d.id)===i);

  const other=lexical.filter(x=>!correlatedIds.has(x.d.id)).slice(0,30);

  const packWords=packs.flatMap(pack=>[pack.id,pack.label,...pack.refs]);
  const caseTerms=[...terms,...packWords.map(norm),...seedRefs.map(norm)];
  const cases=q?jurisprudence.map(j=>({j,s:score(caseText(j),caseTerms)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s):[];
  const ds=q?Object.values(dossiers).map(d=>({d,s:score(dossierText(d),terms)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s):[];
  const top=ds[0]?.d;

  const ieg=direct.filter(x=>scopeOf(x.d)==='ieg');
  const grdf=direct.filter(x=>scopeOf(x.d)==='grdf');
  const local=direct.filter(x=>scopeOf(x.d)==='local');
  const visibleCount=lawItems.length+direct.length;

  return <>
    <section className="question-head question-head-lite">
      <span>💬</span><div><div className="eyebrow">Une question, puis seulement ce dont tu as besoin</div><h1>Qu’est-ce que tu veux comprendre ?</h1><p>Écris normalement. Tu verras d’abord l’essentiel ; les textes restent repliés tant que tu ne demandes pas à aller plus loin.</p></div>
    </section>
    <form className="ask-box ask-box-lite" action="/recherche">
      <textarea name="q" defaultValue={q} autoFocus placeholder="Ex. Ai-je droit à une indemnité de repas ?" aria-label="Ta question"/>
      <button type="submit">Explique-moi <span>→</span></button>
    </form>

    {q&&<>
      <section className="simple-result-card">
        <div className="simple-result-top"><span>💡</span><div><small>JE RETIENS</small><h2>{top?.title||dossierPack?.label||'Voici ce que le corpus permet d’identifier'}</h2></div></div>
        <p className="simple-result-lead">{top?.subtitle||dossierPack?.subtitle||'La recherche a identifié les textes les plus directement liés à ta question.'}</p>
        {top?.sections?.slice(0,2).map((s,i)=><div className="simple-result-point" key={i}><b>{i+1}</b><p><strong>{s.title.replace(/^\d+\.\s*/, '')}</strong><br/>{s.text}</p></div>)}
        {!top&&dossierPack&&<div className="simple-result-point"><b>✓</b><p><strong>Le dossier est reconstitué avant affichage.</strong><br/>{direct.length} texte{direct.length>1?'s':''} directement lié{direct.length>1?'s':''} et {supplements.length} complément{supplements.length>1?'s':''} ont été identifiés dans le corpus.</p></div>}
        <div className="simple-result-actions">
          {top&&<Link href={`/dossiers/${top.slug}`}>Comprendre le sujet en détail →</Link>}
          <a href="#sources">Voir les textes seulement si j’en ai besoin ↓</a>
        </div>
      </section>

      <section className="discovery-strip">
        <div><span>1</span><strong>Je comprends</strong><small>la règle en clair</small></div>
        <div><span>2</span><strong>J’approfondis</strong><small>si quelque chose m’intéresse</small></div>
        <div><span>3</span><strong>Je vérifie</strong><small>les textes et décisions</small></div>
      </section>

      <section id="sources" className="progress-sources">
        <details className="progress-details">
          <summary><div><span className="progress-icon">📚</span><div><small>ÉTAPE SUIVANTE</small><strong>Voir les textes qui fondent cette réponse</strong><p>{visibleCount} source{visibleCount>1?'s':''} structurante{visibleCount>1?'s':''} classée{visibleCount>1?'s':''} par niveau.</p></div></div><b>Ouvrir ＋</b></summary>
          <div className="progress-details-body">
            <LawBlock items={lawItems}/>
            <SourceGroup title="Niveau 2 · Statut & branche IEG" subtitle="PERS, Notes DP, Circulaires N et accords de branche." items={ieg}/>
            <SourceGroup title="Niveau 3 · GRDF" subtitle="Accords, décisions, notes et règles d’entreprise." items={grdf}/>
            <SourceGroup title="Niveau 4 · Local" subtitle="Uniquement lorsque le texte vise le bon périmètre." items={local}/>
            {!visibleCount&&<p className="empty">Aucun texte suffisamment direct n’a été identifié. L’application préfère ne pas remplir l’écran avec des résultats faibles.</p>}
          </div>
        </details>

        {supplements.length>0&&<details className="progress-details secondary-progress">
          <summary><div><span className="progress-icon">🔗</span><div><small>SI TU VEUX ALLER PLUS LOIN</small><strong>Textes liés, extensions et compléments</strong><p>{supplements.length} document{supplements.length>1?'s':''} gardé{supplements.length>1?'s':''} en retrait pour ne pas te submerger.</p></div></div><b>Ouvrir ＋</b></summary>
          <div className="progress-details-body"><div className="correlation-grid">{supplements.map(item=><DocCard key={item.d.id} item={item} label="Complément"/>)}</div></div>
        </details>}

        {cases.length>0&&<details className="progress-details secondary-progress">
          <summary><div><span className="progress-icon">⚖️</span><div><small>INTERPRÉTATION</small><strong>Voir les décisions de justice reliées</strong><p>Seulement si tu veux voir comment une règle a été interprétée ou appliquée.</p></div></div><b>Ouvrir ＋</b></summary>
          <div className="progress-details-body"><CaseBlock items={cases}/></div>
        </details>}

        {other.length>0&&<details className="progress-details tertiary-progress">
          <summary><div><span className="progress-icon">🔎</span><div><small>RECHERCHE LARGE</small><strong>Voir les autres résultats contenant mes mots</strong><p>Résultats moins ciblés : à utiliser seulement si tu veux fouiller le corpus.</p></div></div><b>{other.length} résultats ＋</b></summary>
          <div className="progress-details-body"><div className="results">{other.map(item=>{const x=explanationFor(item.d);return <Link className="result" href={`/textes/${item.d.id}`} key={item.d.id}><div><span className={'stamp '+(scopeOf(item.d)==='grdf'?'grdf':'')}>{scopeName(scopeOf(item.d))}</span>{item.d.ref&&<strong>{item.d.ref}</strong>}</div><h3>{item.d.title}</h3><p>{x.simple}</p></Link>})}</div></div>
        </details>}
      </section>
    </>}
  </>;
}
