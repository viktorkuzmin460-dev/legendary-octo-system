const FEEDS = [
  ["Variety", "https://variety.com/feed/"],
  ["Deadline", "https://deadline.com/feed/"],
  ["The Guardian Film", "https://www.theguardian.com/film/rss"]
];
function clean(s="") {
  return s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'")
    .replace(/&#(\d+);/g,(_,n)=>String.fromCharCode(Number(n))).replace(/\s+/g," ").trim();
}
function parse(xml, source) {
  const blocks = xml.match(/<(item|entry)\b[\s\S]*?<\/\1>/gi) || [];
  return blocks.map(b => {
    const get = tag => { const m=b.match(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)<\\/${tag}>`,"i"));return m?clean(m[1]):""; };
    const title=get("title");
    let link=get("link");
    if(!link){const m=b.match(/<link\b[^>]*href=["']([^"']+)["']/i);link=m?m[1]:"";}
    const description=get("description")||get("summary")||get("content");
    const date=get("pubDate")||get("published")||get("updated");
    return title&&link?{title,link,description:description.slice(0,500),date,source}:null;
  }).filter(Boolean);
}
export async function onRequest() {
  const results = await Promise.all(FEEDS.map(async ([name,url]) => {
    try {
      const r = await fetch(url,{headers:{"User-Agent":"CINEMA_DAILY public movie news reader/1.0","Accept":"application/rss+xml, application/atom+xml, application/xml, text/xml"}, cf:{cacheTtl:900,cacheEverything:true}});
      if(!r.ok) throw new Error(`HTTP ${r.status}`);
      return parse(await r.text(),name);
    } catch { return []; }
  }));
  const seen=new Set();
  const items=results.flat().filter(n=>{if(seen.has(n.link))return false;seen.add(n.link);return true;})
    .sort((a,b)=>(Date.parse(b.date)||0)-(Date.parse(a.date)||0)).slice(0,60);
  return Response.json({items,updated:new Date().toISOString(),sources:FEEDS.map(f=>f[0])},{
    headers:{"Cache-Control":"public, max-age=600, s-maxage=900","Access-Control-Allow-Origin":"*"}
  });
}