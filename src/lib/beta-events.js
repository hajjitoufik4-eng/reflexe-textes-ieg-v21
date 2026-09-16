const ENDPOINT='https://zhjzmdhwyshvfwywclrl.supabase.co/functions/v1/beta-events';
const TOKEN='reflexe-ieg-beta-v1';

export async function sendBetaEvent(event,payload){
  const res=await fetch(ENDPOINT,{
    method:'POST',
    headers:{'Content-Type':'application/json','x-reflexe-beta':TOKEN},
    body:JSON.stringify({event,payload})
  });
  if(!res.ok) throw new Error(`beta-events ${res.status}`);
  return res.json().catch(()=>({ok:true}));
}
