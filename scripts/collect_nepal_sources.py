"""Collect public Nepal source links and health, without promoting candidates to news."""
import concurrent.futures
import hashlib
import json
import re
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.parse import urljoin, urlparse

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.links=[]; self.href=None; self.text=[]
    def handle_starttag(self,tag,attrs):
        if tag=='a': self.href=dict(attrs).get('href'); self.text=[]
    def handle_data(self,text):
        if self.href: self.text.append(text)
    def handle_endtag(self,tag):
        if tag=='a' and self.href:
            self.links.append((self.href,' '.join(' '.join(self.text).split()))); self.href=None

def scan(source):
    if source['platform']!='Website': return source,[],[]
    now=datetime.now(timezone.utc).isoformat()
    source={**source,'lastAttemptAt':now}
    try:
        with urlopen(Request(source['url'],headers={'User-Agent':'NepalICTResearch/1.0 (public-source-index)'}),timeout=18) as response:
            text=response.read(2_000_000).decode('utf-8','replace')
        if re.search(r'just a moment|verify you are human|cf-chl-',text,re.I): raise ValueError('Access challenge')
        parser=Links();parser.feed(text)
        candidates=[];social=[];seen=set()
        for path,title in parser.links:
            url=urljoin(source['url'],path.strip()); parsed=urlparse(url)
            if parsed.scheme!='https' or parsed.username or parsed.password: continue
            if parsed.hostname in ['facebook.com','www.facebook.com','x.com','twitter.com','t.me','www.linkedin.com','np.linkedin.com'] and not any(x in url for x in ['sharer','intent/','/share','/tr?','login','plugins/']):
                social.append({'sourceId':source['id'],'url':url,'evidenceUrl':source['url'],'status':'needs-ownership-review'})
            if len(title)<15 or url in seen or parsed.hostname!=urlparse(source['url']).hostname: continue
            if source.get('scope')=='Nepal-only' and not re.search(r'nepal|nepali|नेपाल|kathmandu|worldlink|ncell',title+' '+url,re.I): continue
            if not re.search(r'news|press|notice|article|blog|tender|समाचार|सूचना|खरिद|प्रविधि|टेलिकम|दूरसञ्चार|इन्टरनेट|फाइबर|5g|ncell',title+' '+url,re.I): continue
            seen.add(url)
            candidates.append({'id':hashlib.sha256(url.encode()).hexdigest()[:20],'sourceId':source['id'],'country':'尼泊尔','url':url,'titleOriginal':title[:240],'observedAt':now,'publishedAt':None,'status':'date-and-content-unverified'})
        source.update(status='官网可读取·内容待核验',statusEn='Website readable; content pending review',lastCollectedAt=now)
        return source,candidates[:60],social[:30]
    except Exception as error:
        # No response bodies, contact details, credentials or private sessions are persisted.
        source.update(status='扫描失败·待重试',statusEn='Scan failed; retry needed',scanError=type(error).__name__)
        return source,[],[]

def main():
    market=json.loads(Path('config/market.json').read_text())
    if market['code']!='np': raise SystemExit('Nepal profile required')
    sources=json.loads(Path('config/sources.json').read_text())
    if any(s['country']!='尼泊尔' for s in sources): raise SystemExit('Foreign-market source blocked')
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: results=list(pool.map(scan,sources))
    updated=[r[0] for r in results]
    payload={'country':'尼泊尔','generatedAt':datetime.now(timezone.utc).isoformat(),'candidates':[i for r in results for i in r[1]],'socialCandidates':[i for r in results for i in r[2]],'note':'Candidates require date verification, corroboration and bilingual translation before publishing.'}
    Path('config/sources.json').write_text(json.dumps(updated,ensure_ascii=False,indent=2)+'\n')
    Path('config/nepal-source-candidates.json').write_text(json.dumps(payload,ensure_ascii=False,indent=2)+'\n')
    legal=json.loads(Path('config/nepal-legal-news.json').read_text())
    by_id={s['id']:s for s in updated}; legal['sources']=[by_id[s['id']] for s in legal['sources']]
    Path('config/nepal-legal-news.json').write_text(json.dumps(legal,ensure_ascii=False,indent=2)+'\n')
    print(json.dumps({'sources':len(updated),'readable':sum(s['status'].startswith('官网可读取') for s in updated),'candidateLinks':len(payload['candidates']),'socialCandidates':len(payload['socialCandidates'])}))
if __name__=='__main__': main()
