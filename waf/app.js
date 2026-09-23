/* OPDS compatibility candidate 0.2.1. ES5 only. */
(function () {
  'use strict';
  var BASE = 'http://127.0.0.1:18765';
  var busy = false, previous = [], current = '', next = '', loaded = [], searching = false;
  function el(id) { return document.getElementById(id); }
  function status(t) { el('status').textContent = t; }
  function node(tag, cls, s) { var n = document.createElement(tag); if(cls) n.className = cls; n.textContent = s || ''; return n; }
  function empty() { var n = el('items'); while(n.firstChild) n.removeChild(n.firstChild); return n; }
  function buttons() {
    el('open').disabled = busy;
    el('back').disabled = busy || searching || previous.length === 0;
    el('next').disabled = busy || searching || !next;
    el('searchAll').disabled = busy;
    el('filterPage').disabled = busy || !loaded.length;
    el('clearSearch').disabled = busy || !loaded.length;
  }
  function http(method, route, payload, callback) {
    var req, finished = false;
    function done(err, data) { if (finished) return; finished = true; callback(err, data); }
    try {
      req = new XMLHttpRequest();
      req.open(method, BASE + route, true);
      req.timeout = method === 'POST' ? 310000 : 45000;
      if (method === 'POST') { req.setRequestHeader('Content-Type','application/json'); req.setRequestHeader('X-OPDS-Library','1'); }
      req.onreadystatechange = function () {
        if(req.readyState !== 4) return;
        var data = null;
        try { data = JSON.parse(req.responseText); } catch(ignore) {}
        if(req.status >= 200 && req.status < 300 && data !== null) done(null, data);
        else done((data && data.error) || ('Không đọc được dữ liệu máy chủ (HTTP ' + req.status + ').'), null);
      };
      req.onerror = function () { done('Không kết nối được backend cổng 18765. Xem OPDSLibrary/backend.log.', null); };
      req.ontimeout = function () { done('Hết thời gian chờ.', null); };
      req.send(payload ? JSON.stringify(payload) : null);
    } catch(e) { done('Không thể gửi yêu cầu: '+String(e), null); }
  }
  function render(query) {
    var q = (query || '').replace(/^\s+|\s+$/g,'').toLowerCase();
    var list = empty(), i,j,item,card,link,btn,links,hay,shown = 0;
    for(i=0;i<loaded.length;i++){
      item = loaded[i];
      hay = ((item.title || '')+' '+(item.author || '')).toLowerCase();
      if(q && hay.indexOf(q) < 0) continue;
      shown++;
      if(item.kind === 'heading'){list.appendChild(node('h2','',item.title || 'Nhóm sách')); continue;}
      card = node('div','entry','');
      if(item.kind === 'nav' && item.url){
        btn = node('button','',item.title || 'Mở thư mục');
        btn.onclick = (function(u){return function(){requestCatalog(u,true);};})(item.url);
        card.appendChild(btn);
      } else {
        card.appendChild(node('h3','',item.title || 'Không có tên'));
        if(item.author) card.appendChild(node('p','','Tác giả: '+item.author));
        links = item.links || [];
        for(j=0;j<links.length;j++){
          link=links[j];
          btn=node('button','',link.supported ? ((link.format === 'EPUB') ? 'TẢI EPUB (KOReader)' : 'TẢI '+(link.format || 'SÁCH')) : (link.format || 'Định dạng')+' - chưa hỗ trợ');
          btn.disabled = !link.supported;
          if(link.supported)btn.onclick=(function(it,choice,b){return function(){download(it,choice,b);};})(item,link,btn);
          card.appendChild(btn);
        }
        if(!links.length)card.appendChild(node('p','','Không có tệp tải trực tiếp.'));
      }
      list.appendChild(card);
    }
    if(!shown) list.appendChild(node('p','','Không tìm thấy sách phù hợp.'));
    return shown;
  }
  function acceptFeed(feed, label) {
    if(!feed || !feed.items || typeof feed.items.length !== 'number') return false;
    loaded = feed.items || [];
    next = feed.next || '';
    el('heading').textContent = feed.title || label || 'Danh mục OPDS';
    render('');
    return true;
  }
  function requestCatalog(url, saveHistory) {
    if(busy) return;
    if(!/^https?:\/\/[^\s/]+/i.test(url)) { status('Hãy nhập URL bắt đầu bằng http:// hoặc https://'); return; }
    if(saveHistory && current) previous.push(current);
    busy = true; searching = false; next = ''; loaded = []; buttons(); status('Đang tải danh mục...');
    empty().appendChild(node('p','','Đang kết nối...'));
    http('GET','/api/catalog?url='+encodeURIComponent(url),null,function(err,feed){
      busy = false;
      if(err || !acceptFeed(feed,'Danh mục OPDS')) {
        status('Mở danh mục thất bại: '+(err || 'Dữ liệu không hợp lệ.')); buttons(); return;
      }
      current = url; el('catalog').value = url; el('search').value = '';
      status('Đã tải '+loaded.length+' mục.'); buttons();
    });
  }
  function searchAll() {
    if(busy) return;
    var q = el('search').value.replace(/^\s+|\s+$/g,'');
    var base = current || el('catalog').value.replace(/^\s+|\s+$/g,'');
    if(!q){ status('Nhập tên sách hoặc tác giả cần tìm.'); return; }
    if(!/^https?:\/\//i.test(base)){ status('Mở danh mục trước khi tìm toàn kho.'); return; }
    busy=true; searching=true; buttons(); status('Đang tìm toàn kho...');
    empty().appendChild(node('p','','Đang tìm kiếm...'));
    http('GET','/api/search?catalog='+encodeURIComponent(base)+'&q='+encodeURIComponent(q),null,function(err,feed){
      busy=false;
      if(err || !acceptFeed(feed,'Kết quả tìm kiếm')){
        searching=false;
        status('Tìm toàn kho chưa dùng được: '+(err || 'Dữ liệu không hợp lệ.')+' Có thể dùng LỌC TRANG.');
        buttons(); return;
      }
      next='';
      status('Tìm thấy '+loaded.length+' mục trong kết quả toàn kho.'); buttons();
    });
  }
  function download(item,choice,btn){
    if(busy)return;
    busy=true; buttons(); btn.disabled=true; status('Đang tải: '+(item.title || 'Sách')+'...');
    http('POST','/api/download',{url:choice.url,title:item.title || 'Book',format:choice.format,referer:choice.referer || current || el('catalog').value},function(err,result){
      busy=false; btn.disabled=false; buttons();
      if(err){status('Tải thất bại: '+err);return;}
      status((result.existing ? 'Đã có: ' : 'Đã lưu: ')+(result.name || 'sách')+((choice.format === 'EPUB') ? '. Mở bằng KOReader.' : '. Mở Kindle Library để tìm sách.'));
      btn.textContent='ĐÃ LƯU '+(choice.format || '');
    });
  }
  el('open').onclick=function(){var url=el('catalog').value.replace(/^\s+|\s+$/g,'');if(!busy){previous=[];current='';requestCatalog(url,false);}};
  el('back').onclick=function(){if(busy || searching || !previous.length)return;var u=previous.pop();requestCatalog(u,false);};
  el('next').onclick=function(){if(next && !busy && !searching)requestCatalog(next,true);};
  el('searchAll').onclick=searchAll;
  el('filterPage').onclick=function(){if(busy || !loaded.length)return;var q=el('search').value;var n=render(q);status(q.replace(/^\s+|\s+$/g,'') ? ('Lọc được '+n+' mục trong trang hiện tại.') : ('Đang hiển thị '+n+' mục.'));};
  el('clearSearch').onclick=function(){if(busy || !loaded.length)return;el('search').value='';var n=render('');status('Đang hiển thị '+n+' mục.');};
  buttons();
}());
