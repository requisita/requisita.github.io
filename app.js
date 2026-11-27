/* Requisita.ai: código do app. Fica em arquivo separado para a página poder usar uma
   política de segurança (CSP) que bloqueia qualquer script injetado. */
// Não deixa a página ser aberta dentro de outro site (proteção contra clickjacking).
if(window.top!==window.self){try{window.top.location=window.self.location.href}catch(_){document.documentElement.style.display='none'}}
document.getElementById('form').addEventListener('submit',e=>e.preventDefault());
{
const SISTEMA='Eco-Maida',LKEY='ecomaida.cards.v1',DKEY='ecomaida.draft.v1',IKEY='ecomaida.integ.v1';
const store={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=s=>document.querySelector(s);
const TYPES={bi:'BI',rel:'Relatório'},PLURAL={bi:'BI',rel:'Relatórios'};
const SVG={hist:'<svg viewBox="0 0 10 10"><path d="M2.5 1.5h5v7L5 6.8 2.5 8.5z" fill="var(--onsolid)"/></svg>',bi:'<svg viewBox="0 0 10 10"><path d="M1.5 8.5V5.5M5 8.5v-7M8.5 8.5V3.5" stroke="#000" stroke-width="1.6"/></svg>',rel:'<svg viewBox="0 0 10 10"><path d="M2 2.5h6M2 5h6M2 7.5h4" stroke="var(--solid)" stroke-width="1.3"/></svg>'};
const ico=t=>`<span class="ico ${t}" title="${TYPES[t]}">${SVG[t]}</span>`;
const LISTS={filtros:{t:'Filtros',ph:'Ex.: Período'},params:{t:'Parâmetros exibidos',ph:'Ex.: Total do mês'},comps:{t:'Comparativos',ph:'Ex.: Mês atual x anterior'},colunas:{t:'Colunas',ph:'Ex.: Data'}};
const GRAF=['Cartão (número)','Barras','Colunas','Linhas','Área','Pizza','Rosca','Barras + linha','Tabela','Mapa de calor','Velocímetro','Funil','Mapa geográfico'];
const pnome=x=>typeof x==='string'?x:String(x&&x.nome||'');
const LINKNAMES=['Cervello','Jira'];
const BY={bi:['filtros','params','comps'],rel:['filtros','colunas']};
const STATUS=['Em levantamento de requisitos','Escrevendo','Pronto para desenvolvimento','Pronto para validação','Concluído'];
const STCOR=['#f5a623','#4c9aff','#8777d9','#00b8d9','#36b37e'];
const stIdx=s=>Math.max(0,STATUS.indexOf(s));
const FIELDS=['status','historico','key','tipo','titulo','prioridade','como','quero','para','descricao','criterios','filtros','params','comps','colunas','integracoes','links','integDetalhe','autor','autorNome','criadoEm','editadoPor','editadoNome','editadoEm'];
const blank=t=>({id:null,status:STATUS[0],historico:[],key:'',tipo:TYPES[t]?t:'bi',titulo:'',prioridade:'Média',como:'',quero:'',para:'',descricao:'',criterios:'',filtros:[],params:[],comps:[],colunas:[],integracoes:[],links:{},integDetalhe:''});
const norm=(c,id)=>{const o=Object.assign(blank(c.tipo),{});FIELDS.forEach(k=>{if(c[k]!==undefined)o[k]=c[k]});if(!TYPES[o.tipo])o.tipo='bi';['filtros','params','comps','colunas','integracoes'].forEach(k=>{if(!Array.isArray(o[k]))o[k]=[];o[k]=k==='params'?o[k].map(x=>({nome:pnome(x),grafico:String(x&&x.grafico||'')})):o[k].map(x=>String(x??''))});['titulo','como','quero','para','descricao','criterios','integDetalhe','prioridade','key'].forEach(k=>o[k]=String(o[k]??''));{const l={};if(o.links&&typeof o.links==='object')Object.keys(o.links).forEach(k=>{l[String(k)]=String(o.links[k]??'')});o.links=l}if(o.status==='Em validação cliente')o.status=STATUS[0];if(!STATUS.includes(o.status))o.status=STATUS[0];o.historico=Array.isArray(o.historico)?o.historico.filter(x=>x&&typeof x==='object').map(x=>({de:String(x.de||''),para:String(x.para||''),motivo:String(x.motivo||''),porUid:String(x.porUid||''),porNome:String(x.porNome||''),em:String(x.em||'')})).slice(-100):[];o.nComentarios=Math.max(0,+c.nComentarios||0);o.nAnexos=Math.max(0,+c.nAnexos||0);o.id=id;return o};
const okUrl=u=>/^https:\/\/\S+$/i.test(String(u||'').trim());
const linkOf=(c,t)=>String((c.links||{})[t]||'').trim();
let cards=[],integ=['Cervello','Jira'],d=norm(store.get(DKEY,{}),store.get(DKEY,{}).id||null),undo=null,tt,ft='',db=null,user=null,me=null,names={};
const clone=o=>JSON.parse(JSON.stringify(o));
const vals=(k,c=d)=>(c[k]||[]).map(s=>pnome(s).trim()).filter(Boolean);
const paramsOk=(c=d)=>(c.params||[]).filter(p=>pnome(p).trim()).map(p=>({nome:pnome(p).trim(),grafico:p.grafico||''}));
const body=c=>{const o={};FIELDS.forEach(k=>{if(c[k]!==undefined)o[k]=c[k]});return o};

/* ---------- Firebase (versão do GitHub) ----------
   Cole aqui a configuração do seu app Web do Firebase (Configurações do projeto > Seus apps).
   Esses dados não são senha: podem ficar no repositório público. A segurança vem das regras do Firestore. */
const FIREBASE_CONFIG={apiKey:"AIzaSyBjISGIXktzMFy3t_hinDF8iFZD8bGOxaY",authDomain:"requisita.firebaseapp.com",projectId:"requisita",storageBucket:"requisita.firebasestorage.app",messagingSenderId:"696965923031",appId:"1:696965923031:web:d1f0da3979e237e66bb092"};
const MASTER='cicero.silva@maida.health';
/* Login com Google direto neste site (funciona no Safari do iPhone, que bloqueia a janela do firebaseapp.com).
   Cole aqui o "ID do cliente da Web" (Firebase > Authentication > Método de login > Google > Configuração do SDK da Web).
   Não é senha. Vazio = usa a janela do Firebase (pode falhar no iPhone). */
const GOOGLE_CLIENT_ID='';
function gsiStart(){
 if(!GOOGLE_CLIENT_ID||!fb)return;
 const go=()=>{try{
  google.accounts.id.initialize({client_id:GOOGLE_CLIENT_ID,ux_mode:'popup',use_fedcm_for_button:true,callback:async r=>{
   gmsg('Entrando…');try{await fb.AU.signInWithCredential(fb.auth,fb.AU.GoogleAuthProvider.credential(r.credential));gmsg('')}catch(err){gmsg(aerr(err))}}});
  const box=$('#gGsi');box.innerHTML='';
  google.accounts.id.renderButton(box,{type:'standard',theme:'outline',size:'large',text:'continue_with',shape:'rectangular',logo_alignment:'center',locale:'pt-BR',width:Math.min(380,box.parentElement.clientWidth||320)});
  box.hidden=false;$('#gGoogle').hidden=true;
 }catch(_){}};
 if(window.google&&google.accounts&&google.accounts.id)return go();
 const sc=document.createElement('script');sc.src='https://accounts.google.com/gsi/client';sc.async=true;sc.onload=go;document.head.appendChild(sc);
}
let gMode='entrar';
function setGMode(){const c=gMode==='criar';document.querySelectorAll('[data-gmode]').forEach(x=>{const on=x.dataset.gmode===gMode;x.classList.toggle('on',on);x.setAttribute('aria-selected',on)});$('#gNomeWrap').hidden=!c;$('#gReset').hidden=c;$('#gTitle').textContent=c?'Criar conta':'Entrar';$('#gSubTxt').textContent=c?'Depois do cadastro, o master precisa aprovar seu acesso.':'Use sua conta do time para acessar o backlog.';$('#gSubmit').textContent=c?'Criar conta':'Entrar';$('#gGoogleTxt').textContent=c?'Cadastrar com Google':'Continuar com Google';$('#gPass').autocomplete=c?'new-password':'current-password';gmsg('')}
async function gmode_submit(){const em=$('#gEmail').value.trim(),pw=$('#gPass').value;if(!em||!pw){gmsg('Preencha e-mail e senha.');return}
 if(gMode==='entrar'){gmsg('Entrando…');try{await fb.AU.signInWithEmailAndPassword(fb.auth,em,pw);gmsg('')}catch(err){gmsg(aerr(err))}return}
 pendingName=$('#gNome').value.trim();gmsg('Criando conta…');try{const cr=await fb.AU.createUserWithEmailAndPassword(fb.auth,em,pw);if(pendingName)await fb.AU.updateProfile(cr.user,{displayName:pendingName});await fb.AU.sendEmailVerification(cr.user);gmsg('')}catch(err){gmsg(aerr(err))}}
let fb=null,unsubCards=null,unsubMe=null,unsubUsers=null,users=[],uft='pendente',myName='',pendingName='';
const fbOn=()=>!!(FIREBASE_CONFIG.apiKey&&FIREBASE_CONFIG.projectId);
const AUTHERR={'auth/invalid-credential':'E-mail ou senha incorretos.','auth/wrong-password':'E-mail ou senha incorretos.','auth/user-not-found':'E-mail ou senha incorretos.','auth/invalid-email':'E-mail inválido.','auth/email-already-in-use':'Já existe conta com esse e-mail. Use Entrar.','auth/weak-password':'A senha precisa ter pelo menos 6 caracteres.','auth/popup-closed-by-user':'Login com Google cancelado.','auth/popup-blocked':'O navegador bloqueou a janela do Google. Libere pop-ups para este site.','auth/unauthorized-domain':'Este site não está autorizado no Firebase. Adicione o domínio em Authentication > Configurações > Domínios autorizados.','auth/operation-not-allowed':'Este tipo de login não está ativado no Firebase.','auth/too-many-requests':'Muitas tentativas. Espere alguns minutos.','auth/network-request-failed':'Sem conexão com a internet.'};
const gmsg=t=>{$('#gMsg').textContent=t||''};
const aerr=e=>AUTHERR[e&&e.code]||'Não foi possível concluir. Tente de novo.';
function showGate(mode,msg){$('#gate').hidden=false;$('#gLogin').hidden=mode!=='login';$('#gWait').hidden=mode!=='wait';if(msg)$('#gWaitMsg').textContent=msg;['#whoMe','#btnUsers','#btnOut'].forEach(s=>$(s).hidden=true)}
async function fbStart(){
 showGate('login');gmsg('Carregando…');
 try{
  const base='https://www.gstatic.com/firebasejs/10.12.2/';
  const [A,AU,FS]=await Promise.all([import(base+'firebase-app.js'),import(base+'firebase-auth.js'),import(base+'firebase-firestore.js')]);
  const app=A.initializeApp(FIREBASE_CONFIG);
  fb={auth:AU.getAuth(app),fs:FS.getFirestore(app),AU,FS};
  gmsg('');AU.onAuthStateChanged(fb.auth,onUser);gsiStart();
 }catch(e){gmsg('Não foi possível carregar o Firebase. Confira a internet e a configuração.')}
}
function stopSubs(){[unsubCards,unsubMe,unsubUsers,unsubNot,unsubCom,unsubAnx].forEach(f=>f&&f());unsubCards=unsubMe=unsubUsers=unsubNot=unsubCom=unsubAnx=null;$('#bellW').hidden=true}
async function onUser(u){
 stopSubs();cards=[];renderCards();$('#umodal').hidden=true;
 if(!u){showGate('login');return}
 const {FS}=fb,isPwd=u.providerData.some(p=>p.providerId==='password'),master=(u.email||'').toLowerCase()===MASTER;
 if(isPwd&&!u.emailVerified){showGate('wait',`Enviamos um link de confirmação para ${u.email}. Abra o e-mail, confirme e clique em Verificar de novo.`);return}
 const ref=FS.doc(fb.fs,'users',u.uid);
 try{
  const s=await FS.getDoc(ref);
  if(!s.exists())await FS.setDoc(ref,{email:u.email||'',nome:String(u.displayName||pendingName||'').slice(0,120),status:master?'aprovado':'pendente',papel:master?'master':'membro',criadoEm:new Date().toISOString()});
 }catch(e){showGate('wait','Não foi possível abrir seu cadastro. O master precisa publicar as regras do Firestore.');return}
 unsubMe=FS.onSnapshot(ref,s=>{
  const st=s.exists()?s.data().status:'pendente';
  if(!master&&st!=='aprovado'){if(unsubCards){unsubCards();unsubCards=null;cards=[];renderCards()}showGate('wait',st==='bloqueado'?'Seu acesso foi bloqueado pelo master.':'Cadastro recebido. Aguarde o master aprovar seu acesso. Esta tela abre sozinha quando for aprovado.');return}
  if(!unsubCards)enterApp(u,master,s.exists()?s.data().nome:'');
 },()=>showGate('wait','Não foi possível ler seu cadastro.'));
}
function enterApp(u,master,nome){
 const {FS}=fb;me=u.uid;myName=String(nome||u.displayName||u.email||'').slice(0,120);names[me]=myName;
 $('#gate').hidden=true;$('#whoMe').textContent=u.email;$('#whoMe').hidden=false;$('#btnOut').hidden=false;$('#btnUsers').hidden=!master;
 $('#syncLine').textContent='Conectando ao backlog do time…';
 amMaster=master;$('#meAv').textContent=ini(myName);$('#meAv').style.setProperty('--h',hue(me));
 unsubCards=FS.onSnapshot(FS.collection(fb.fs,'cards'),s=>{
  cards=s.docs.map(x=>norm(x.data()||{},x.id)).sort((a,b)=>num(b.key)-num(a.key));cardsLoaded=true;syncOpenCard();renderCards();meta();route();
  $('#syncLine').textContent='Backlog do time no Firebase. Só usuários aprovados pelo master acessam.';
 },()=>{$('#syncLine').textContent='Sem permissão para ler o backlog. Fale com o master.'});
 watchUsers();watchNotif();
}
function watchUsers(){
 const {FS}=fb;unsubUsers=FS.onSnapshot(FS.collection(fb.fs,'users'),s=>{users=s.docs.map(x=>({id:x.id,...x.data()}));users.forEach(x=>{if(x.nome||x.email)names[x.id]=x.nome||x.email});people=users.filter(x=>x.status==='aprovado'||x.papel==='master').map(x=>({id:x.id,nome:String(x.nome||x.email||'').trim()||'Sem nome',email:String(x.email||'')})).sort((a,b)=>a.nome.localeCompare(b.nome,'pt-BR'));if(amMaster){const p=users.filter(x=>x.status==='pendente').length;$('#btnUsers').textContent=p?`Usuários (${p} aguardando)`:'Usuários';renderUsers()}},()=>{});
}
function renderUsers(){
 const cnt=s=>users.filter(x=>x.status===s).length;
 $('#uTabs').innerHTML=[['pendente','Aguardando'],['aprovado','Aprovados'],['bloqueado','Bloqueados']].map(([s,n])=>`<button type="button" data-uft="${s}" class="${uft===s?'on':''}">${n}<small>${cnt(s)}</small></button>`).join('');
 const l=users.filter(x=>x.status===uft).sort((a,b)=>String(b.criadoEm).localeCompare(String(a.criadoEm)));
 $('#ulist').innerHTML=l.length?l.map(x=>{const self=x.id===me;return `<div class="urow"><div><b>${esc(x.nome||x.email)}</b><span>${esc(x.email)}${x.criadoEm?' · pediu acesso em '+esc(new Date(x.criadoEm).toLocaleDateString('pt-BR')):''}</span></div><span class="ust ${esc(x.status)}">${x.papel==='master'?'Master':esc(x.status)}</span><div class="uact">${self?'':`${x.status!=='aprovado'?`<button type="button" class="btn pri" data-ust="aprovado" data-uid="${esc(x.id)}">Aprovar</button>`:''}${x.status!=='bloqueado'?`<button type="button" class="btn" data-ust="bloqueado" data-uid="${esc(x.id)}">${x.status==='pendente'?'Recusar':'Bloquear'}</button>`:''}`}</div></div>`}).join(''):`<p class="empty">${uft==='pendente'?'Ninguém aguardando aprovação.':'Nenhum usuário aqui.'}</p>`;
}
async function setStatus(uid,st){try{await fb.FS.updateDoc(fb.FS.doc(fb.fs,'users',uid),{status:st,decididoEm:new Date().toISOString()});toast(st==='aprovado'?'Acesso aprovado':'Acesso bloqueado')}catch(e){toast('Não foi possível alterar. Confira as regras do Firestore.')}}



/* ---------- status (fluxo) ---------- */
function renderStatus(){
 const i=stIdx(d.status),c=STCOR[i];
 $('#stBtn').style.setProperty('--sc',c);$('#stTxt').textContent=d.status||STATUS[0];
 $('#stBtn').disabled=!d.id;$('#stHint').textContent=d.id?`Etapa ${i+1} de ${STATUS.length}`:'Salve o card para mudar o status';
 const h=(d.historico||[]).slice().reverse();
 $('#hist').innerHTML=h.length?`<h3>Histórico de status</h3><ol>${h.map(x=>{const back=stIdx(x.para)<stIdx(x.de);return `<li><b>${esc(who(x.porUid,x.porNome)||'Alguém')}</b> ${back?'voltou':'moveu'} de ${esc(x.de)} para <b>${esc(x.para)}</b><time title="${esc(fullDate(x.em))}">${esc(rel(x.em))}</time>${x.motivo?`<span class="why" style="--sc:#c9372c">Motivo: ${esc(x.motivo)}</span>`:''}</li>`}).join('')}</ol>`:'';
}
function stMenu(open){
 const m=$('#stMenu');if(open===false||(open===undefined&&!m.hidden)){m.hidden=true;$('#stBtn').setAttribute('aria-expanded','false');return}
 const i=stIdx(d.status);let html='';
 if(i<STATUS.length-1)html+=`<div class="lbl">Avançar</div><button type="button" data-stgo="${i+1}"><i class="dot" style="--sc:${STCOR[i+1]}"></i>${esc(STATUS[i+1])}<small>próxima etapa</small></button>`;
 if(i>0)html+=`<div class="lbl">Voltar</div><button type="button" data-stback="${i-1}"><i class="dot" style="--sc:${STCOR[i-1]}"></i>${esc(STATUS[i-1])}<small>pede motivo</small></button>`;
 html+=`<ol class="flow">${STATUS.map((s,k)=>`<li class="${k===i?'on':k<i?'done':''}"><i class="dot" style="--sc:${STCOR[k]}"></i>${k+1}. ${esc(s)}</li>`).join('')}</ol>`;
 m.innerHTML=html;m.hidden=false;$('#stBtn').setAttribute('aria-expanded','true');
}
let stBusy=false,stBackTo=-1;
async function changeStatus(to,motivo){
 if(stBusy||!d.id)return;const de=d.status,para=STATUS[to];if(!para||para===de)return;
 stBusy=true;stMenu(false);
 const ev={de,para,motivo:motivo||'',porUid:me||'',porNome:myName||'',em:new Date().toISOString()};
 const base=cards.find(c=>c.id===d.id)||d;
 const upd=clone(base);upd.status=para;upd.historico=[...(base.historico||[]),ev].slice(-100);
 try{
  if(fb){await fb.FS.updateDoc(fb.FS.doc(fb.fs,'cards',d.id),{status:para,historico:upd.historico,ultimaAtividade:ev.em});
   fb.FS.addDoc(fb.FS.collection(fb.fs,'cards',d.id,'comentarios'),{tipo:'status',de,para,motivo:ev.motivo,texto:'',autorUid:me,autorNome:myName,criadoEm:ev.em,mencoes:[],anexos:[]}).catch(()=>{})}
  else await persist(upd);
  d.status=para;d.historico=upd.historico;save();renderStatus();renderCards();
  toast(motivo?`${d.key} voltou para ${para}`:`${d.key} agora está em ${para}`);
 }catch(e){toast('Não foi possível mudar o status. Tente de novo.')}
 stBusy=false;
}
function askBack(to){stMenu(false);stBackTo=to;$('#rTitle').textContent=`Voltar para ${STATUS[to]}`;$('#rSub').textContent=`${d.key}: de ${d.status} para ${STATUS[to]}. O motivo fica registrado no histórico do card.`;$('#rText').value='';$('#rErr').textContent='';$('#rmodal').hidden=false;$('#rText').focus()}
function confirmBack(){const m=$('#rText').value.trim();if(m.length<5){$('#rErr').textContent='Escreva o motivo da volta (pelo menos 5 caracteres).';$('#rText').focus();return}$('#rmodal').hidden=true;changeStatus(stBackTo,m)}

/* ---------- navegação: backlog <-> card ---------- */
let cardsLoaded=false,dirty=false,amMaster=false,people=[],unsubNot=null,unsubCom=null,unsubAnx=null,comments=[],anexos={},pend=[],mentionMap={},notifs=[],mSel=0,mList=[],openId=null;
function showView(v){$('#vBacklog').hidden=v!=='backlog';$('#vCard').hidden=v!=='card';document.title=v==='card'?`${d.key||'Novo card'} · Requisita.ai`:'Requisita.ai';window.scrollTo(0,0)}
function newCard(){d=blank(d.tipo||'bi');dirty=false;fillForm();if(location.hash!=='#novo')history.pushState(null,'','#novo');showView('card');openActivity(null);$('#f-titulo').focus()}
function route(){
 const k=decodeURIComponent(location.hash.slice(1));
 if(!k){showView('backlog');openActivity(null);renderCards();return}
 if(k==='novo'){if(d.id){d=blank(d.tipo||'bi');fillForm()}showView('card');openActivity(null);return}
 const c=cards.find(x=>x.key===k||x.id===k);
 if(!c){if(cardsLoaded||local.on){toast('Card não encontrado');history.replaceState(null,'',location.pathname);showView('backlog')}return}
 if(d.id!==c.id){d=clone(c);dirty=false;fillForm()}
 showView('card');if(openId!==c.id)openActivity(c);
}
function syncOpenCard(){if(!d.id||dirty)return;const c=cards.find(x=>x.id===d.id);if(c&&JSON.stringify(body(c))!==JSON.stringify(body(d))){d=clone(c);fillForm()}}
window.addEventListener('hashchange',route);

/* ---------- comentários, anexos e menções (Firebase) ---------- */
const ini=n=>String(n||'?').trim().split(/\s+/).slice(0,2).map(p=>p[0]||'').join('').toUpperCase()||'?';
const hue=s=>{let x=0;for(const ch of String(s||''))x=(x*31+ch.charCodeAt(0))%360;return x};
function rel(iso){const t=new Date(iso).getTime();if(!t)return'';const s=(Date.now()-t)/1000;if(s<60)return'agora';if(s<3600)return`há ${Math.floor(s/60)} min`;if(s<86400)return`há ${Math.floor(s/3600)} h`;if(s<86400*7)return`há ${Math.floor(s/86400)} dia(s)`;return new Date(t).toLocaleDateString('pt-BR')}
const fullDate=iso=>{const t=new Date(iso);return isNaN(t)?'':t.toLocaleString('pt-BR')};
const kb=n=>n>1048576?(n/1048576).toFixed(1)+' MB':Math.max(1,Math.round(n/1024))+' KB';
const okImg=u=>/^data:image\/(png|jpe?g|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(String(u||''));
const okData=u=>/^data:[\w.+-]+\/[\w.+-]+;base64,[A-Za-z0-9+/=]+$/.test(String(u||''));
const FILEICO='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/><path d="M14 3v4h4M9 12h6M9 16h6" fill="none" stroke="currentColor" stroke-width="1.6"/></svg>';
function openActivity(c){
 [unsubCom,unsubAnx].forEach(f=>f&&f());unsubCom=unsubAnx=null;comments=[];anexos={};pend=[];mentionMap={};openId=c&&c.id||null;
 $('#activity').hidden=!fb;if(!fb)return;
 renderPend();$('#gal').innerHTML='';
 const can=!!openId;$('#cBox').hidden=!can;$('#cLocked').hidden=can;
 if(!can){$('#cList').innerHTML='';return}
 const {FS}=fb;$('#cList').innerHTML='<p class="empty">Carregando comentários…</p>';
 unsubCom=FS.onSnapshot(FS.collection(fb.fs,'cards',openId,'comentarios'),s=>{comments=s.docs.map(x=>({id:x.id,...x.data()})).sort((a,b)=>String(b.criadoEm).localeCompare(String(a.criadoEm)));renderComments()},()=>{$('#cList').innerHTML='<p class="empty">Não foi possível carregar os comentários. O master precisa publicar as regras novas do Firestore.</p>'});
 unsubAnx=FS.onSnapshot(FS.collection(fb.fs,'cards',openId,'anexos'),s=>{anexos={};s.docs.forEach(x=>{anexos[x.id]={id:x.id,...x.data()}});renderComments();renderGallery()},()=>{});
}
function richText(cm){
 const nm=cm.mencoesNomes||{};
 let t=esc(cm.texto||'');
 t=t.replace(/(https?:\/\/[^\s<{}]+[^\s<{}.,;:!?)\]'"])/g,u=>`<a href="${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
 t=t.replace(/(^|[\s(])(www\.[^\s<{}]+[^\s<{}.,;:!?)\]'"])/g,(m,p,u)=>`${p}<a href="https://${u}" target="_blank" rel="noopener noreferrer">${u}</a>`);
 t=t.replace(/@\{([\w-]{1,128})\}/g,(m,uid)=>`<span class="mention${uid===me?' mine':''}">@${esc(names[uid]||nm[uid]||'alguém')}</span>`);
 return t.replace(/\n/g,'<br>');
}
function attHtml(list){
 if(!Array.isArray(list)||!list.length)return'';
 return `<div class="atts">${list.map(m=>{const a=anexos[m.id];const nome=esc(m.nome||'arquivo');
  if(a&&okImg(a.dataUrl))return `<button type="button" class="thumb" data-view="${esc(m.id)}" title="${nome}"><img src="${a.dataUrl}" alt="${nome}"></button>`;
  return `<button type="button" class="fchip" data-dl="${esc(m.id)}" title="Baixar ${nome}">${FILEICO}<span>${nome}</span><small>${a?kb(+a.tamanho||0):'carregando…'}</small></button>`}).join('')}</div>`;
}
function renderComments(){
 if(!openId)return;
 if(!comments.length){$('#cList').innerHTML='<p class="empty">Nenhum comentário ainda. Use a caixa acima para comentar, anexar prints ou marcar alguém.</p>';return}
 $('#cList').innerHTML=comments.map(cm=>cm.tipo==='status'?`<article class="cm sys"><div class="av" style="--h:${hue(cm.autorUid)}">${esc(ini(names[cm.autorUid]||cm.autorNome))}</div><div><div class="ch"><b>${esc(names[cm.autorUid]||cm.autorNome||'Alguém do time')}</b><time title="${esc(fullDate(cm.criadoEm))}">${esc(rel(cm.criadoEm))}</time></div><div class="ct">${stIdx(cm.para)<stIdx(cm.de)?'voltou':'moveu'} o card de <span class="slz" style="--sc:${STCOR[stIdx(cm.de)]}"><i class="dot"></i>${esc(cm.de)}</span> para <span class="slz" style="--sc:${STCOR[stIdx(cm.para)]}"><i class="dot"></i>${esc(cm.para)}</span>${cm.motivo?`<span class="why">Motivo: ${esc(cm.motivo)}</span>`:''}</div></div></article>`:`<article class="cm"><div class="av" style="--h:${hue(cm.autorUid)}">${esc(ini(names[cm.autorUid]||cm.autorNome))}</div><div><div class="ch"><b>${esc(names[cm.autorUid]||cm.autorNome||'Alguém do time')}</b><time datetime="${esc(cm.criadoEm)}" title="${esc(fullDate(cm.criadoEm))}">${esc(rel(cm.criadoEm))}</time>${(cm.autorUid===me||amMaster)?`<button type="button" class="cdel" data-cdel="${esc(cm.id)}">Excluir</button>`:''}</div><div class="ct">${richText(cm)}</div>${attHtml(cm.anexos)}</div></article>`).join('');
}
function renderGallery(){
 const l=Object.values(anexos).sort((a,b)=>String(a.criadoEm).localeCompare(String(b.criadoEm)));
 $('#gal').innerHTML=l.length?l.map(a=>okImg(a.dataUrl)?`<button type="button" class="thumb" data-view="${esc(a.id)}" title="${esc(a.nome)}"><img src="${a.dataUrl}" alt="${esc(a.nome)}"></button>`:`<button type="button" class="fchip" data-dl="${esc(a.id)}" title="Baixar ${esc(a.nome)}">${FILEICO}<span>${esc(a.nome)}</span><small>${kb(+a.tamanho||0)}</small></button>`).join(''):'';
}
function renderPend(){
 $('#cPend').innerHTML=pend.map((p,i)=>`<div class="pchip">${okImg(p.dataUrl)?`<img src="${p.dataUrl}" alt="">`:FILEICO}<span title="${esc(p.nome)}">${esc(p.nome)} <small>${kb(p.tamanho)}</small></span><button type="button" data-rmpend="${i}" aria-label="Remover ${esc(p.nome)}">×</button></div>`).join('');
}
const MAXFILE=700*1024;
function readURL(f){return new Promise((ok,no)=>{const r=new FileReader();r.onload=()=>ok(r.result);r.onerror=no;r.readAsDataURL(f)})}
async function shrink(f){
 const url=await readURL(f);if(/gif$/i.test(f.type)&&f.size<MAXFILE)return url;
 const img=await new Promise((ok,no)=>{const i=new Image();i.onload=()=>ok(i);i.onerror=no;i.src=url});
 let max=1600,q=.82,out=url;
 for(let k=0;k<6;k++){const s=Math.min(1,max/Math.max(img.width,img.height));const c=document.createElement('canvas');c.width=Math.max(1,Math.round(img.width*s));c.height=Math.max(1,Math.round(img.height*s));const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(img,0,0,c.width,c.height);out=c.toDataURL('image/jpeg',q);if(out.length<900000)return out;max=Math.round(max*.8);q=Math.max(.5,q-.08)}
 return out.length<900000?out:null;
}
async function addFiles(files){
 for(const f of files){
  if(pend.length>=8){toast('Até 8 anexos por comentário');break}
  try{
   if(/^image\//.test(f.type)){const u=await shrink(f);if(!u){toast(`${f.name}: imagem grande demais`);continue}pend.push({nome:(f.name||'print').replace(/\.(png|webp|bmp|heic)$/i,'.jpg'),tipo:u.slice(5,u.indexOf(';')),tamanho:Math.round(u.length*.75),dataUrl:u})}
   else{if(f.size>MAXFILE){toast(`${f.name} tem ${kb(f.size)}. O limite é 700 KB por arquivo.`);continue}const u=await readURL(f);pend.push({nome:f.name,tipo:f.type||'application/octet-stream',tamanho:f.size,dataUrl:u})}
  }catch(e){toast(`Não foi possível ler ${f.name}`)}
 }
 renderPend();
}
let sending=false;
async function sendComment(){
 if(sending||!fb||!openId)return;
 let txt=$('#cText').value.trim();
 if(!txt&&!pend.length){toast('Escreva um comentário ou anexe um arquivo');$('#cText').focus();return}
 sending=true;$('#cSend').disabled=true;$('#cSend').textContent='Enviando…';
 const {FS}=fb,now=new Date().toISOString(),card=cards.find(c=>c.id===openId)||d;
 const mencoes=[],mencoesNomes={};
 Object.entries(mentionMap).sort((a,b)=>b[0].length-a[0].length).forEach(([nome,uid])=>{const tok='@'+nome;if(txt.includes(tok)){txt=txt.split(tok).join('@{'+uid+'}');if(!mencoes.includes(uid))mencoes.push(uid);mencoesNomes[uid]=nome}});
 try{
  const metas=[];
  for(const p of pend){const r=await FS.addDoc(FS.collection(fb.fs,'cards',openId,'anexos'),{nome:p.nome,tipo:p.tipo,tamanho:p.tamanho,dataUrl:p.dataUrl,autorUid:me,autorNome:myName,criadoEm:now});metas.push({id:r.id,nome:p.nome,tipo:p.tipo,tamanho:p.tamanho})}
  await FS.addDoc(FS.collection(fb.fs,'cards',openId,'comentarios'),{texto:txt,autorUid:me,autorNome:myName,criadoEm:now,mencoes,mencoesNomes,anexos:metas});
  FS.updateDoc(FS.doc(fb.fs,'cards',openId),{nComentarios:FS.increment(1),nAnexos:FS.increment(metas.length),ultimaAtividade:now}).catch(()=>{});
  const plain=txt.replace(/@\{([\w-]+)\}/g,(m,u)=>'@'+(mencoesNomes[u]||'alguém')).slice(0,160);
  for(const uid of mencoes){if(uid===me)continue;FS.addDoc(FS.collection(fb.fs,'users',uid,'notificacoes'),{tipo:'mencao',deUid:me,deNome:myName,cardId:openId,cardKey:card.key||'',cardTitulo:card.titulo||'',trecho:plain,criadoEm:now,lida:false}).catch(()=>{})}
  $('#cText').value='';pend=[];mentionMap={};renderPend();closeMentions();
  toast(mencoes.length?`Comentário enviado. ${mencoes.length} pessoa(s) marcada(s).`:'Comentário enviado');
 }catch(e){toast(e&&e.code==='permission-denied'?'Sem permissão para comentar. O master precisa publicar as regras novas do Firestore.':'Não foi possível enviar. Arquivos muito grandes? Tente de novo.')}
 sending=false;$('#cSend').disabled=false;$('#cSend').textContent='Comentar';
}
async function delComment(id){
 const {FS}=fb,cm=comments.find(c=>c.id===id);if(!cm)return;
 try{for(const a of (cm.anexos||[]))await FS.deleteDoc(FS.doc(fb.fs,'cards',openId,'anexos',a.id)).catch(()=>{});
  await FS.deleteDoc(FS.doc(fb.fs,'cards',openId,'comentarios',id));
  FS.updateDoc(FS.doc(fb.fs,'cards',openId),{nComentarios:FS.increment(-1),nAnexos:FS.increment(-((cm.anexos||[]).length))}).catch(()=>{});
  toast('Comentário excluído')}catch(e){toast('Não foi possível excluir')}
}
function download(id){const a=anexos[id];if(!a||!okData(a.dataUrl)){toast('Arquivo ainda carregando');return}const l=document.createElement('a');l.href=a.dataUrl;l.download=String(a.nome||'arquivo').replace(/[\\/:*?"<>|]/g,'_');document.body.appendChild(l);l.click();l.remove()}
function viewImg(id){const a=anexos[id];if(!a||!okImg(a.dataUrl))return;$('#lbImg').src=a.dataUrl;$('#lbImg').alt=a.nome||'';$('#lb').hidden=false;$('#lbClose').focus()}
/* menções */
function mentionQuery(){const el=$('#cText'),pos=el.selectionStart,before=el.value.slice(0,pos);const m=before.match(/(^|\s)@([^\s@]{0,30})$/);return m?{q:m[2],start:pos-m[2].length-1,end:pos}:null}
function openMentions(){
 const mq=mentionQuery();if(!mq||!people.length){closeMentions();return}
 const q=mq.q.normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase();
 mList=people.filter(p=>!q||(p.nome+' '+p.email).normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase().includes(q)).slice(0,8);
 if(!mList.length){closeMentions();return}
 mSel=Math.min(mSel,mList.length-1);
 $('#mPop').innerHTML=mList.map((p,i)=>`<button type="button" role="option" data-mpick="${i}" class="${i===mSel?'on':''}" aria-selected="${i===mSel}"><span class="av" style="--h:${hue(p.id)}">${esc(ini(p.nome))}</span><span>${esc(p.nome)}<small>${esc(p.email)}</small></span></button>`).join('');
 $('#mPop').hidden=false;
}
function closeMentions(){$('#mPop').hidden=true;mList=[];mSel=0}
function pickMention(i){const p=mList[i],mq=mentionQuery();if(!p||!mq)return;const el=$('#cText');const tok='@'+p.nome+' ';el.value=el.value.slice(0,mq.start)+tok+el.value.slice(mq.end);const pos=mq.start+tok.length;el.setSelectionRange(pos,pos);mentionMap[p.nome]=p.id;closeMentions();el.focus()}
/* notificações */
function watchNotif(){
 const {FS}=fb;$('#bellW').hidden=false;
 unsubNot=FS.onSnapshot(FS.collection(fb.fs,'users',me,'notificacoes'),s=>{notifs=s.docs.map(x=>({id:x.id,...x.data()})).sort((a,b)=>String(b.criadoEm).localeCompare(String(a.criadoEm))).slice(0,40);renderNotif()},()=>{});
}
function renderNotif(){
 const n=notifs.filter(x=>!x.lida).length;$('#bellN').hidden=!n;$('#bellN').textContent=n>9?'9+':n;
 $('#btnBell').setAttribute('aria-label',n?`Notificações, ${n} não lida(s)`:'Notificações');
 $('#nList').innerHTML=notifs.length?notifs.map(x=>`<button type="button" class="nit${x.lida?'':' unread'}" data-nid="${esc(x.id)}"><b>${esc(x.deNome||'Alguém')} marcou você em ${esc(x.cardKey||'um card')}</b><span>${esc(x.cardTitulo||'')}</span><span>“${esc(x.trecho||'')}”</span><time>${esc(rel(x.criadoEm))}</time></button>`).join(''):'<p class="empty">Nenhuma notificação. Quando alguém marcar você com @, aparece aqui.</p>';
}
function openNotif(id){const x=notifs.find(n=>n.id===id);if(!x)return;$('#nPanel').hidden=true;if(!x.lida)fb.FS.updateDoc(fb.FS.doc(fb.fs,'users',me,'notificacoes',id),{lida:true}).catch(()=>{});if(x.cardKey)location.hash=x.cardKey}
function readAll(){notifs.filter(x=>!x.lida).forEach(x=>fb.FS.updateDoc(fb.FS.doc(fb.fs,'users',me,'notificacoes',x.id),{lida:true}).catch(()=>{}))}

/* ---------- dados: backlog do time (db) ou este navegador ---------- */
const local={on:false};
function useLocal(msg){local.on=true;cards=store.get(LKEY,[]).map(c=>norm(c,String(c.id)));integ=store.get(IKEY,integ);$('#syncLine').textContent=msg;renderAll();cardsLoaded=true;route()}
async function persist(c){
 if(fb){await fb.FS.setDoc(fb.FS.doc(fb.fs,'cards',c.id),body(c),{merge:true});return}
 if(local.on){const i=cards.findIndex(x=>x.id===c.id);i>=0?cards[i]=clone(c):cards.unshift(clone(c));store.set(LKEY,cards);renderCards();return}
 await db.collection('cards').doc(c.id).set(body(c));
}
async function remove(id){
 if(fb){await fb.FS.deleteDoc(fb.FS.doc(fb.fs,'cards',id));return}
 if(local.on){cards=cards.filter(x=>x.id!==id);store.set(LKEY,cards);renderCards();return}
 await db.collection('cards').doc(id).delete();
}
async function saveInteg(){
 if(local.on){store.set(IKEY,integ);return}
 try{await db.doc('config/integracoes').set({lista:integ})}catch(e){}
}
async function connect(){
 const timer=setTimeout(()=>{if(!db)useLocal('Backlog do time indisponível agora. Os cards estão sendo salvos só neste navegador.')},10000);
 try{db=await claude.use('db');user=await claude.use('user')}catch(e){db=null}
 if(!db){clearTimeout(timer);if(!local.on)useLocal('Backlog do time indisponível nesta visualização. Os cards ficam só neste navegador.');return}
 try{me=user?await user.id():null}catch(e){me=null}
 let first=true;
 const slow=setTimeout(()=>{if(first)$('#syncLine').textContent='O backlog do time está demorando para responder…'},10000);
 clearTimeout(timer);
 db.collection('cards').onSnapshot(snap=>{
  cards=snap.docs.filter(s=>s.exists).map(s=>norm(s.data()||{},s.id)).sort((a,b)=>num(b.key)-num(a.key));
  if(!snap.metadata.fromCache){first=false;clearTimeout(slow);$('#syncLine').textContent='Backlog do time: todo mundo com acesso ao link vê os mesmos cards.'}
  cardsLoaded=true;syncOpenCard();renderCards();resolveNames();route();
 },e=>{clearTimeout(slow);$('#syncLine').textContent='Não foi possível ler o backlog do time. Recarregue a página mais tarde.'});
}
const num=k=>parseInt(String(k).replace(/\D/g,''))||0;
async function resolveNames(){
 if(!user)return;const ids=[...new Set(cards.flatMap(c=>[c.autor,c.editadoPor]).filter(Boolean))];if(!ids.length)return;
 try{const ps=await user.profiles(ids);ids.forEach(i=>names[i]=(ps&&ps[i]&&ps[i].name)||'Alguém do time');renderCards();meta()}catch(e){}
}
const who=(id,nm)=>id?(id===me?'você':(names[id]||nm||'Alguém do time')):'';

/* ---------- interface ---------- */
function renderTipos(){
 const saved=!!(d.id&&cards.some(c=>c.id===d.id));$('#tipoNovo').hidden=saved;$('#tipoBadge').hidden=!saved;$('#tipoBadge').innerHTML=ico(d.tipo)+(d.tipo==='bi'?'BI':'Relatório');
 document.querySelectorAll('.tipos button').forEach(b=>{b.innerHTML=ico(b.dataset.type)+TYPES[b.dataset.type];b.classList.toggle('on',b.dataset.type===d.tipo);b.setAttribute('aria-selected',b.dataset.type===d.tipo)});
 $('#tipoFix').innerHTML=ico(d.tipo)+TYPES[d.tipo];
}
function renderExtra(){
 $('#extra').innerHTML=BY[d.tipo].map(k=>`<div><h3>${LISTS[k].t}</h3>${d[k].map((v,i)=>`<div class="item"><input class="inl" data-l="${k}" data-i="${i}" value="${esc(pnome(v))}" placeholder="${esc(LISTS[k].ph)}" aria-label="${LISTS[k].t} ${i+1}">${k==='params'?`<select class="graf" data-g="${i}" aria-label="Tipo de gráfico de ${esc(pnome(v)||'parâmetro '+(i+1))}"><option value="">Tipo de gráfico</option>${GRAF.map(g=>`<option${v.grafico===g?' selected':''}>${g}</option>`).join('')}</select>`:''}<button type="button" class="x" data-del="${k}" data-i="${i}" aria-label="Remover">×</button></div>`).join('')}<button type="button" class="lnk" data-add="${k}">+ Adicionar</button></div>`).join('');
 
}
function renderLinks(){
 LINKNAMES.forEach(t=>{const el=document.querySelector(`[data-link="${t}"]`);el.value=linkOf(d,t);linkUi(el)});
}
function linkUi(el){
 const r=el.parentElement,u=el.value.trim();let a=r.querySelector('a');
 if(okUrl(u)){if(!a){a=document.createElement('a');a.target='_blank';a.rel='noopener';a.textContent='Abrir';r.appendChild(a)}a.href=u}else if(a)a.remove();
 const bad=LINKNAMES.filter(t=>{const v=linkOf(d,t);return v&&!okUrl(v)});
 $('#lkwarn').textContent=bad.length?`O link do ${bad.join(' e do ')} precisa começar com https://`:'';
}
function grow(el){if(!el||el.tagName!=='TEXTAREA'||!el.classList.contains('inl'))return;el.style.height='auto';el.style.height=(el.scrollHeight+4)+'px'}
function growAll(){document.querySelectorAll('textarea.inl').forEach(grow)}
function fillForm(){setTimeout(renderStatus,0);document.querySelectorAll('[data-f]').forEach(el=>el.value=d[el.dataset.f]??'');requestAnimationFrame(growAll);renderTipos();renderExtra();renderLinks();meta();save()}
function renderAll(){fillForm();renderCards()}
function meta(){
 $('#crumbKey').textContent=d.key||'Novo card';
 $('#metaLine').textContent=d.id?`${d.key}${d.autor?` criado por ${who(d.autor,d.autorNome)}`:''}${d.editadoPor?`, editado por ${who(d.editadoPor,d.editadoNome)}`:''}. Alterações só valem depois de Salvar.`:'Card novo, ainda não salvo';
}
function save(){store.set(DKEY,d)}
function md(c,plain){
 const B=s=>plain?s:`**${s}**`,Hm=s=>plain?s.toUpperCase():`### ${s}`,L=[];
 L.push(plain?(c.titulo||'Sem título'):`## ${c.titulo||'Sem título'}`);
 L.push(`${B('Status:')} ${c.status||STATUS[0]}`,`${B('Sistema:')} ${SISTEMA}`,`${B('Tipo:')} ${TYPES[c.tipo]}`,`${B('Prioridade:')} ${c.prioridade}`);
 {const ls=LINKNAMES.filter(t=>okUrl(linkOf(c,t)));if(ls.length)L.push(`${B('Links:')} `+ls.map(t=>plain?`${t}: ${linkOf(c,t)}`:`[${t}](${linkOf(c,t)})`).join(' | '))}
 L.push('',`${B('Como')} ${c.como||'…'}, ${B('quero')} ${c.quero||'…'}, ${B('para')} ${c.para||'…'}.`);
 if(c.descricao)L.push('',Hm('Descrição'),c.descricao);
 BY[c.tipo].forEach(k=>{if(k==='params'){const a=paramsOk(c);if(a.length)L.push('',Hm(LISTS[k].t),...a.map(p=>`- ${p.nome}${p.grafico?` (gráfico: ${p.grafico})`:''}`));return}const a=vals(k,c);if(a.length)L.push('',Hm(LISTS[k].t),...a.map(x=>'- '+x))});
 const crit=c.criterios.split('\n').map(s=>s.trim()).filter(Boolean);
 if(crit.length)L.push('',Hm('Critérios de aceite'),...crit.map(x=>(plain?'- ':'- [ ] ')+x));
 return L.join('\n');
}
function sugerir(){
 const c=[];
 vals('filtros').forEach(f=>c.push(`Filtrar por ${f} exibe apenas os dados correspondentes.`));
 if(d.tipo==='bi'){paramsOk().forEach(p=>c.push(p.grafico?`Exibe ${p.nome} em gráfico do tipo ${p.grafico.toLowerCase()}.`:`Exibe ${p.nome} em tela.`));vals('comps').forEach(p=>c.push(`Exibe o comparativo ${p}.`))}
 if(d.tipo==='rel'&&vals('colunas').length)c.push(`O relatório exibe as colunas: ${vals('colunas').join(', ')}.`);
 if(d.quero)c.push(`O usuário consegue ${d.quero}.`);
 const atual=d.criterios.split('\n').map(s=>s.trim()).filter(Boolean),novos=c.filter(x=>!atual.includes(x));
 d.criterios=[...atual,...novos].join('\n');$('#f-crit').value=d.criterios;grow($('#f-crit'));save();
 toast(novos.length?`${novos.length} critério(s) adicionado(s)`:'Nenhum critério novo');
}
function toast(msg,fn){
 $('#toastMsg').textContent=msg;undo=fn||null;$('#toastUndo').style.display=undo?'':'none';
 $('#toast').classList.add('on');clearTimeout(tt);tt=setTimeout(()=>$('#toast').classList.remove('on'),undo?6000:2500);
}
async function copy(text){
 try{await navigator.clipboard.writeText(text);toast('Copiado')}
 catch(e){const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();let ok=false;try{ok=document.execCommand('copy')}catch(_){}ta.remove();toast(ok?'Copiado':'Não foi possível copiar')}
}
function renderCards(){
 const cnt=t=>cards.filter(c=>!t||c.tipo===t).length;
 $('#ftabs').innerHTML=[['','Todos'],['bi',PLURAL.bi],['rel',PLURAL.rel]].map(([t,n])=>`<button type="button" data-ft="${t}" class="${ft===t?'on':''}" role="tab" aria-selected="${ft===t}">${n}<small>${cnt(t)}</small></button>`).join('');
 const q=$('#busca').value.trim().toLowerCase();
 const fs=$('#fStatus').value;const list=cards.filter(c=>(!ft||c.tipo===ft)&&(!fs||c.status===fs)&&(!q||[c.key,c.titulo,c.quero].join(' ').toLowerCase().includes(q)));
 $('#cards').innerHTML=list.length?list.map(c=>`<div class="li${c.id===d.id?' cur':''}">${ico(c.tipo)}<span class="k">${esc(c.key)}</span><span class="t" data-edit="${esc(c.id)}" tabindex="0" role="button">${esc(c.titulo||'Sem título')}</span><span class="tg tags">${LINKNAMES.filter(t=>okUrl(linkOf(c,t))).map(t=>{const u=linkOf(c,t);return okUrl(u)?`<a class="tag tl" href="${esc(u)}" target="_blank" rel="noopener" title="Abrir ${esc(t)}">${esc(t)} ↗</a>`:`<span class="tag" style="padding-right:6px">${esc(t)}</span>`}).join('')}</span><span class="st"><span class="slz" style="--sc:${STCOR[stIdx(c.status)]}"><i class="dot"></i>${esc(c.status)}</span></span><span class="who">${esc(c.editadoPor?who(c.editadoPor,c.editadoNome):who(c.autor,c.autorNome))}</span><span class="cc" title="${c.nComentarios} comentário(s), ${c.nAnexos} anexo(s)">${c.nComentarios?`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg>${c.nComentarios}`:''}</span><span class="p">${esc(c.prioridade)}</span><span class="a"><button type="button" data-copy="${esc(c.id)}">Copiar</button>${canDel(c)?`<button type="button" data-rm="${esc(c.id)}">Excluir</button>`:''}</span></div>`).join('')
  :`<p class="empty">${cards.length?'Nenhum card neste filtro.':'O backlog está vazio. Clique em Criar card para começar.'}</p>`;
}
const canDel=c=>!fb||amMaster||(!!me&&c.autor===me);
function edit(id){const c=cards.find(c=>c.id==id);if(!c)return;if(location.hash==='#'+c.key)route();else location.hash=c.key}
let saving=false;
async function salvar(){
 if(saving)return;if(!d.titulo.trim()){toast('Escreva o resumo antes de salvar');$('#f-titulo').focus();return}
 saving=true;const now=new Date().toISOString();
 if(!d.id){d.id='c'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);d.key='ECO-'+(Math.max(0,...cards.map(c=>num(c.key)))+1);d.autor=me||'';d.autorNome=myName||'';d.criadoEm=now}
 else{d.editadoPor=me||'';d.editadoNome=myName||'';d.editadoEm=now}
 const wasNew=!cards.some(c=>c.id===d.id);if(wasNew)history.replaceState(null,'','#'+d.key);try{await persist(d);dirty=false;save();meta();renderCards();toast(`${d.key} salvo`);if(wasNew){renderTipos();openActivity(d);$('#crumbKey').textContent=d.key;document.title=d.key+' · Requisita.ai'}}
 catch(e){toast(e&&e.code==='quota_exceeded'?'O backlog atingiu o limite de cards. Exclua cards antigos e salve de novo.':e&&e.code==='invalid_argument'?'Você só tem acesso de leitura a este backlog. Peça acesso de Contribuidor ao dono.':e&&e.code==='permission-denied'?'O servidor recusou o salvamento: confira se algum campo está grande demais.':'Não foi possível salvar agora. Tente de novo.')}
 saving=false;
}


/* ---------- IA: Claude (link do Claude) ou Gemini (GitHub) ---------- */
let sampleFn=null,aiCtl=null,aiBusy=false;
const GK='requisita.gemini.key',GM='requisita.gemini.model',GAPI='https://generativelanguage.googleapis.com/v1beta/';
const gem={key:store.get(GK,''),model:store.get(GM,'')};
function setProv(){
 if(sampleFn){$('#aiProv').textContent='usando o Claude';$('#gemCfgBtn').hidden=true;$('#gemCfg').hidden=true;return}
 $('#gemCfgBtn').hidden=false;
 $('#aiProv').textContent=gem.key?`usando o Gemini${gem.model?' ('+gem.model.replace('models/','')+')':''}`:'com o Gemini';
}
async function initAI(){
 try{sampleFn=window.claude&&claude.use?await claude.use('sample'):null}catch(e){sampleFn=null}
 setProv();if(!sampleFn&&gem.key)listModels(true);
}
async function listModels(quiet){
 const r=await fetch(GAPI+'models?pageSize=200',{headers:{'x-goog-api-key':gem.key}}).catch(()=>null);
 if(!r||!r.ok){if(!quiet)$('#gemMsg').textContent=r&&(r.status===400||r.status===403)?'Chave inválida ou sem permissão. Confira a chave e tente de novo.':'Não foi possível falar com o Gemini. Confira sua internet.';return false}
 const j=await r.json().catch(()=>({}));
 const ms=(j.models||[]).filter(m=>String(m.name||'').includes('gemini')&&(m.supportedGenerationMethods||[]).includes('generateContent')&&!/vision|embedding|tts|image|audio|live/i.test(m.name)).map(m=>String(m.name)).sort().reverse();
 if(!ms.length){if(!quiet)$('#gemMsg').textContent='Essa chave não tem modelos do Gemini disponíveis.';return false}
 if(!ms.includes(gem.model)){gem.model=ms.find(m=>/flash/.test(m)&&!/lite|preview|exp/.test(m))||ms.find(m=>/flash/.test(m))||ms[0];store.set(GM,gem.model)}
 $('#gemModel').innerHTML=ms.map(m=>`<option value="${esc(m)}"${m===gem.model?' selected':''}>${esc(m.replace('models/',''))}</option>`).join('');
 $('#gemModelRow').hidden=false;setProv();return true;
}
async function askGemini(prompt,signal){
 if(!gem.key)throw{code:'no_key'};
 if(!gem.model&&!(await listModels(false)))throw{code:'no_key'};
 const r=await fetch(GAPI+gem.model+':generateContent',{method:'POST',signal,headers:{'Content-Type':'application/json','x-goog-api-key':gem.key},body:JSON.stringify({contents:[{role:'user',parts:[{text:prompt}]}],generationConfig:{temperature:0.4,responseMimeType:'application/json'}})}).catch(e=>{throw{code:signal.aborted?'cancelled':'upstream_error'}});
 if(r.status===429)throw{code:'rate_limited'};
 if(r.status===400||r.status===401||r.status===403)throw{code:'bad_key'};
 if(!r.ok)throw{code:'upstream_error'};
 const j=await r.json().catch(()=>null);
 const t=((j&&j.candidates&&j.candidates[0]&&j.candidates[0].content&&j.candidates[0].content.parts)||[]).map(p=>p.text||'').join('').trim();
 if(!t)throw{code:'empty_completion'};
 try{return JSON.parse(t)}catch(_){const m=t.match(/[{\[][\s\S]*[}\]]/);if(m)try{return JSON.parse(m[0])}catch(__){}throw{code:'invalid_json'}}
}
const AIERR={not_granted:'A IA não foi liberada nesta visualização.',sampling_disabled:'A IA não está disponível para esta conta.',rate_limited:'Muitos pedidos seguidos ou limite da conta atingido. Espere um pouco e tente de novo.',session_expired:'Sua sessão expirou. Entre de novo no Claude.',refused:'A IA não respondeu a esse pedido. Reescreva o pedido.',invalid_json:'A resposta veio incompleta. Clique de novo.',empty_completion:'A IA não devolveu nada. Tente um pedido mais curto.',prompt_too_large:'O card está grande demais para a IA. Encurte a descrição.',bad_key:'O Gemini recusou a chave. Confira a chave em Configurar Gemini.',no_key:'Configure a chave do Gemini para usar a IA.'};
function curCard(){return{titulo:d.titulo,como:d.como,quero:d.quero,para:d.para,descricao:d.descricao,filtros:vals('filtros'),...(d.tipo==='bi'?{params:paramsOk(),comps:vals('comps')}:{colunas:vals('colunas')}),criterios:d.criterios.split('\n').map(s=>s.trim()).filter(Boolean)}}
async function aiRun(mode){
 if(aiBusy)return;
 if(!sampleFn&&!gem.key){$('#gemCfg').hidden=false;$('#gemKey').focus();$('#aiMsg').textContent='Conecte o Gemini para usar a IA.';return}
 const pedido=$('#aiIn').value.trim();
 if(mode==='fill'&&!pedido&&!d.titulo.trim()){$('#aiMsg').textContent='Escreva o pedido do cliente no campo acima.';$('#aiIn').focus();return}
 const bi=d.tipo==='bi';
 const shape=`{"titulo":string,"como":string,"quero":string,"para":string,"descricao":string,"filtros":[string],${bi?`"params":[{"nome":string,"grafico":string}],"comps":[string]`:`"colunas":[string]`},"criterios":[string]}`;
 const prompt=`Você ajuda um analista de requisitos a escrever cards de histórias de usuário para o sistema Eco-Maida. Escreva em português do Brasil, claro e objetivo, no estilo de um card do Jira.
Tipo do card: ${bi?'BI (painel com filtros em tela, parâmetros exibidos com tipo de gráfico e comparativos)':'Relatório (filtros e colunas)'}.
${mode==='fill'?'Tarefa: monte o card a partir do pedido do cliente, aproveitando e mantendo o que já está preenchido no card atual.':'Tarefa: revise o card atual. Melhore a redação, corrija português, deixe os critérios de aceite testáveis e complete o que faltar, sem inventar regras de negócio novas.'}
Pedido do cliente: ${pedido||'(não informado)'}
Card atual (JSON): ${JSON.stringify(curCard())}
Regras:
- "titulo": curto, sem ponto final.
- "como": só o perfil de quem usa (ex.: "gerente comercial"). "quero": começa com verbo no infinitivo. "para": o ganho para o negócio.
- "descricao": 1 a 3 frases de contexto. Pode ficar vazia se não houver contexto.
${bi?`- "params[].grafico": use exatamente um destes: ${GRAF.join(', ')}.
- "comps": cada item no formato "X atual x Y" (ex.: "Mês atual x mês anterior").`:`- "colunas": na ordem em que devem aparecer no relatório.`}
- "criterios": de 3 a 8 critérios de aceite, cada um uma frase testável.
- Não invente nomes de tabelas, campos de banco ou sistemas.
Responda somente com um objeto JSON neste formato: ${shape}`;
 const prev=clone(d);aiBusy=true;aiCtl=new AbortController();
 ['#aiFill','#aiReview'].forEach(s=>$(s).disabled=true);$('#aiStop').hidden=false;$('#aiMsg').textContent='Escrevendo…';
 try{
  const r=sampleFn?await sampleFn.json(prompt,{signal:aiCtl.signal,cache:false}):await askGemini(prompt,aiCtl.signal);
  if(!r||typeof r!=='object')throw{code:'invalid_json'};
  const S=v=>typeof v==='string'?v.trim():'',A=v=>Array.isArray(v)?v.map(x=>S(typeof x==='string'?x:'')).filter(Boolean):[];
  ['titulo','como','quero','para','descricao'].forEach(k=>{const v=S(r[k]);if(v)d[k]=v});
  if(Array.isArray(r.filtros))d.filtros=A(r.filtros);
  if(bi){if(Array.isArray(r.params))d.params=r.params.filter(p=>p&&S(p.nome)).map(p=>({nome:S(p.nome),grafico:GRAF.includes(S(p.grafico))?S(p.grafico):''}));if(Array.isArray(r.comps))d.comps=A(r.comps)}
  else if(Array.isArray(r.colunas))d.colunas=A(r.colunas);
  if(Array.isArray(r.criterios)&&A(r.criterios).length)d.criterios=A(r.criterios).join('\n');
  fillForm();$('#aiMsg').textContent='';
  toast(mode==='fill'?'Card preenchido pela IA. Revise e salve.':'Texto revisado pela IA. Revise e salve.',()=>{d=prev;fillForm()});
 }catch(e){
  const c=e&&e.code;$('#aiMsg').textContent=c==='cancelled'?'':(AIERR[c]||'A IA não respondeu agora. Tente de novo.');
  if(sampleFn&&(c==='not_granted'||c==='sampling_disabled'))$('#ai').hidden=true;
  if(c==='bad_key'||c==='no_key')$('#gemCfg').hidden=false;
 }finally{aiBusy=false;['#aiFill','#aiReview'].forEach(s=>$(s).disabled=false);$('#aiStop').hidden=true}
}
document.addEventListener('input',e=>{
 const el=e.target;
 if(el.id==='cText'){mSel=0;openMentions();return}
 if(el.dataset.f){d[el.dataset.f]=el.value;dirty=true;grow(el);save()}
 else if(el.dataset.l){const k=el.dataset.l,i=+el.dataset.i;if(k==='params')d.params[i].nome=el.value;else d[k][i]=el.value;save()}
 else if(el.dataset.link!==undefined){d.links[el.dataset.link]=el.value;save();linkUi(el)}
 else if(el.dataset.g!==undefined){d.params[+el.dataset.g].grafico=el.value;save()}
 else if(el.id==='busca')renderCards();
});
document.addEventListener('change',e=>{if(e.target.id==='gemModel'){gem.model=e.target.value;store.set(GM,gem.model);setProv()}});
document.addEventListener('keydown',e=>{
 const el=e.target;
 if(e.key==='Escape'&&!$('#rmodal').hidden){$('#rmodal').hidden=true;return}
 if(e.key==='Enter'&&el.id==='rText'&&(e.ctrlKey||e.metaKey)){e.preventDefault();confirmBack();return}
 if(e.key==='Escape'){stMenu(false);if(!$('#lb').hidden){$('#lb').hidden=true;return}if(!$('#mPop').hidden){closeMentions();return}$('#nPanel').hidden=true}
 if(el.id==='cText'&&!$('#mPop').hidden&&mList.length){if(e.key==='ArrowDown'){e.preventDefault();mSel=(mSel+1)%mList.length;openMentions();return}if(e.key==='ArrowUp'){e.preventDefault();mSel=(mSel-1+mList.length)%mList.length;openMentions();return}if(e.key==='Enter'||e.key==='Tab'){e.preventDefault();pickMention(mSel);return}}
 if(el.id==='cText'&&e.key==='Enter'&&(e.ctrlKey||e.metaKey)){e.preventDefault();sendComment();return}
 if(e.key==='Enter'&&el.dataset.l){e.preventDefault();addItem(el.dataset.l)}
 else if(e.key==='Enter'&&el.dataset.edit)edit(el.dataset.edit);
 else if(e.key==='Enter'&&['gEmail','gPass','gNome'].includes(el.id)){e.preventDefault();gmode_submit()}
});
function addItem(k){d[k].push(k==='params'?{nome:'',grafico:''}:'');renderExtra();save();const a=document.querySelectorAll(`[data-l="${k}"]`);a[a.length-1]?.focus()}
document.addEventListener('click',async e=>{
 const t=e.target.closest('[data-edit]');if(t){edit(t.dataset.edit);return}
 if(!e.target.closest('#bellW'))$('#nPanel').hidden=true;
 if(!e.target.closest('.stw'))stMenu(false);
 if(e.target.id==='lb'){$('#lb').hidden=true;return}
 const bk=e.target.closest('#toBacklog');if(bk){e.preventDefault();history.pushState(null,'',location.pathname);route();return}
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.type){if(d.id&&cards.some(c=>c.id===d.id))return;d.tipo=b.dataset.type;renderTipos();renderExtra();save()}
 else if(b.dataset.ft!==undefined){ft=b.dataset.ft;renderCards()}
 else if(b.dataset.add)addItem(b.dataset.add);
 else if(b.dataset.del){d[b.dataset.del].splice(+b.dataset.i,1);renderExtra();save()}
 else if(b.id==='salvar')salvar();
 else if(b.id==='novo'||b.id==='novo2'){newCard()}
 else if(b.id==='sugerir')sugerir();
 else if(b.id==='aiFill')aiRun('fill');
 else if(b.id==='aiReview')aiRun('review');
 else if(b.id==='aiStop')aiCtl&&aiCtl.abort();
 else if(b.id==='gemCfgBtn'){$('#gemCfg').hidden=!$('#gemCfg').hidden;if(!$('#gemCfg').hidden){$('#gemKey').value=gem.key;$('#gemKey').focus()}}
 else if(b.id==='gemConnect'){const k=$('#gemKey').value.trim();if(!k){$('#gemMsg').textContent='Cole a chave primeiro.';return}gem.key=k;gem.model='';$('#gemMsg').textContent='Conectando…';if(await listModels(false)){store.set(GK,k);$('#gemMsg').textContent='Gemini conectado.';setProv();setTimeout(()=>{$('#gemCfg').hidden=true;$('#gemMsg').textContent=''},1500)}else{gem.key=store.get(GK,'')}}
 else if(b.id==='gemForget'){gem.key='';gem.model='';try{localStorage.removeItem(GK);localStorage.removeItem(GM)}catch(_){}$('#gemKey').value='';$('#gemModelRow').hidden=true;$('#gemMsg').textContent='Chave removida deste navegador.';setProv()}
 else if(b.id==='copiarMd')copy(md(d));
 else if(b.id==='copiarTxt')copy(md(d,true));
 else if(b.dataset.copy)copy(md(cards.find(c=>c.id==b.dataset.copy)));
 else if(b.dataset.rm){const old=clone(cards.find(c=>c.id==b.dataset.rm));if(!old||!canDel(old)){toast('Só quem criou o card ou o master pode excluir.');return}try{await remove(old.id);toast(`${old.key} excluído`,()=>persist(old).catch(()=>toast('Não foi possível desfazer')))}catch(err){toast(err&&err.code==='permission-denied'?'Só quem criou o card ou o master pode excluir.':'Não foi possível excluir agora. Tente de novo.')}}
 else if(b.id==='gGoogle'){gmsg('Abrindo o Google…');try{await fb.AU.signInWithPopup(fb.auth,new fb.AU.GoogleAuthProvider());gmsg('')}catch(err){gmsg(/iPhone|iPad|iPod/.test(navigator.userAgent)?'O Safari do iPhone bloqueou o login com Google. Por enquanto, entre com e-mail e senha.':aerr(err))}}
 else if(b.dataset.gmode){gMode=b.dataset.gmode;setGMode()}
 else if(b.id==='gSubmit'){gmode_submit()}
 else if(b.id==='gReset'){const em=$('#gEmail').value.trim();if(!em){gmsg('Escreva seu e-mail e clique de novo em Esqueci a senha.');return}try{await fb.AU.sendPasswordResetEmail(fb.auth,em);gmsg('Enviamos um link para criar uma nova senha.')}catch(err){gmsg(aerr(err))}}
 else if(b.id==='gRecheck'){const u=fb.auth.currentUser;if(u){await u.reload().catch(()=>{});onUser(fb.auth.currentUser)}}
 else if(b.id==='gOut'||b.id==='btnOut'){await fb.AU.signOut(fb.auth)}
 else if(b.id==='btnUsers'){$('#umodal').hidden=false;renderUsers()}
 else if(b.id==='uClose'){$('#umodal').hidden=true}
 else if(b.dataset.uft){uft=b.dataset.uft;renderUsers()}
 else if(b.dataset.ust){setStatus(b.dataset.uid,b.dataset.ust)}
 else if(b.dataset.cdel!==undefined){if(b.classList.contains('sure')){delComment(b.dataset.cdel)}else{b.classList.add('sure');b.textContent='Confirmar exclusão';setTimeout(()=>{if(b.isConnected){b.classList.remove('sure');b.textContent='Excluir'}},4000)}}
 else if(b.dataset.view!==undefined)viewImg(b.dataset.view);
 else if(b.dataset.dl!==undefined)download(b.dataset.dl);
 else if(b.dataset.rmpend!==undefined){pend.splice(+b.dataset.rmpend,1);renderPend()}
 else if(b.dataset.mpick!==undefined)pickMention(+b.dataset.mpick);
 else if(b.dataset.nid!==undefined)openNotif(b.dataset.nid);
 else if(b.id==='btnBell'){$('#nPanel').hidden=!$('#nPanel').hidden}
 else if(b.id==='nAll')readAll();
 else if(b.id==='cSend')sendComment();
 else if(b.id==='lbClose')$('#lb').hidden=true;
 else if(b.id==='stBtn')stMenu();
 else if(b.dataset.stgo!==undefined)changeStatus(+b.dataset.stgo);
 else if(b.dataset.stback!==undefined)askBack(+b.dataset.stback);
 else if(b.id==='rOk')confirmBack();
 else if(b.id==='rCancel'||b.id==='rClose')$('#rmodal').hidden=true;
 else if(b.id==='toastUndo'){undo&&undo();undo=null;$('#toast').classList.remove('on')}
 else if(b.id==='gerarBk'){const j=JSON.stringify({cards,integ});$('#backup').value=j;copy(j)}
 else if(b.id==='importBk'){
  let a;try{a=JSON.parse($('#backup').value)}catch(_){toast('Backup inválido. Cole o texto gerado por esta página.');return}
  a=Array.isArray(a)?a:a&&a.cards;if(!Array.isArray(a)){toast('Backup inválido. Cole o texto gerado por esta página.');return}
  let n=0,u=0;for(const c of a){if(!c||!c.id)continue;const id=String(c.id).replace(/[^\w-]/g,'');if(!id)continue;const ex=cards.some(x=>x.id===id);try{await persist(norm(c,id));ex?u++:n++}catch(_){break}}
  toast(`${n} card(s) novo(s), ${u} atualizado(s)`)}
});
fillForm();renderCards();
document.addEventListener('change',e=>{if(e.target.id==='fStatus'){renderCards();return}if(e.target.id==='cFile'){addFiles([...e.target.files]);e.target.value=''}});
document.addEventListener('paste',e=>{if(e.target.id!=='cText')return;const fs=[...(e.clipboardData&&e.clipboardData.files||[])];if(fs.length){e.preventDefault();const stamp=new Date().toISOString().slice(0,19).replace(/[T:]/g,'-');addFiles(fs.map((f,i)=>(!f.name||f.name==='image.png')?new File([f],`print-${stamp}${i?'-'+i:''}.png`,{type:f.type}):f))}});
['dragenter','dragover'].forEach(t=>document.addEventListener(t,e=>{if(e.target.closest&&e.target.closest('#cBox')){e.preventDefault();$('#cBox').classList.add('drag')}}));
['dragleave','drop'].forEach(t=>document.addEventListener(t,e=>{if(e.target.closest&&e.target.closest('#cBox')){$('#cBox').classList.remove('drag');if(t==='drop'){e.preventDefault();addFiles([...e.dataTransfer.files])}}}));
document.addEventListener('focusout',e=>{if(e.target.id==='cText')setTimeout(()=>{if(!document.activeElement||!document.activeElement.closest||!document.activeElement.closest('#mPop'))closeMentions()},150)});

$('#fStatus').innerHTML='<option value="">Todos os status</option>'+STATUS.map(s=>`<option>${esc(s)}</option>`).join('');
route();
if(window.claude&&claude.use){connect()}else if(fbOn()){fbStart()}else useLocal('Firebase ainda não configurado: os cards ficam salvos só neste navegador.');
window.addEventListener('resize',()=>growAll());
}
