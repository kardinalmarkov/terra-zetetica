// utils/sbRest.js — минималистичный REST‑клиент Supabase поверх XMLHttpRequest
// ---------------------------------------------------------------------------
// Работает в любом браузере с XHR (Android 4.4, iOS 9). Никаких fetch/Promise не
// требуется, но если Promise доступны — возвращаем real Promise, иначе свой poly.

(function(root,factory){
  if(typeof module==='object'&&module.exports) module.exports=factory();
  else root.sbRest=factory();
})(typeof self!=='undefined'?self:this,function(){

  var SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  var SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  function xhr(method, path, body, params){
    return new Promise(function(res,rej){
      var x = new XMLHttpRequest();
      x.open(method, SB_URL + '/rest/v1' + path + (params||''), true);
      x.setRequestHeader('apikey', SB_KEY);
      x.setRequestHeader('authorization','Bearer '+SB_KEY);
      x.setRequestHeader('Content-Type','application/json');
      x.onload = function(){ res({ ok: (x.status/100|0)===2, status:x.status, json:function(){return JSON.parse(x.responseText||'null')} }); };
      x.onerror= function(){ rej(new Error('network')); };
      x.send(body?JSON.stringify(body):null);
    });
  }

  /* public api */
  function select(table, query){
    var qs = '?select=*' + (query||'');
    return xhr('GET','/'+table, null, qs).then(function(r){return r.json();});
  }
  function upsert(table, row, onConflict){
    var q='?on_conflict='+encodeURIComponent(onConflict)+'&return=minimal';
    return xhr('POST','/'+table, row, q).then(function(r){return r.ok});
  }

  return { select:select, upsert:upsert };
});
