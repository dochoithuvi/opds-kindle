/* OPDS Library 0.2.2. ES5 only. */
(function () {
  'use strict';
  var BASE = 'http://127.0.0.1:18765';
  var busy = false, previous = [], currentRoute = null, next = '', loaded = [], searching = false;
  var catalogsLoaded = false, catalogs = [], activeSource = 'default', activeName = 'Kho sách mặc định', editorID = '';
  function el(id) { return document.getElementById(id); }
  function status(t) { el('status').textContent = t; }
  function node(tag, cls, s) { var n = document.createElement(tag); if(cls) n.className = cls; n.textContent = s || ''; return n; }
  function empty() { var n = el('items'); while(n.firstChild) n.removeChild(n.firstChild); return n; }
  function trim(s) { return String(s || '').replace(/^\s+|\s+$/g,''); }
  function buttons() {
    el('open').disabled = busy;
    el('catalogMenu').disabled = busy;
    el('showAdd').disabled = busy;
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
  function applyCatalogResponse(data) {
    var i, c;
    if(!data || !data.catalogs || typeof data.catalogs.length !== 'number') return false;
    catalogs = data.catalogs;
    activeSource = data.selected || 'default';
    activeName = 'Kho sách mặc định';
    for(i=0;i<catalogs.length;i++) {
      c = catalogs[i];
      if(c.id === activeSource) { activeName = c.name || activeName; break; }
    }
    catalogsLoaded = true;
    el('catalogMenu').textContent = activeName.toUpperCase() + ' ▾';
    renderCatalogList();
    return true;
  }
  function loadCatalogs(callback) {
    if(catalogsLoaded) { callback(null); return; }
    http('GET','/api/catalogs',null,function(err,data){
      if(err || !applyCatalogResponse(data)) { callback(err || 'Danh sách kho không hợp lệ.'); return; }
      callback(null);
    });
  }
  function showPanel(show) {
    el('catalogPanel').className = show ? 'catalogPanel' : 'catalogPanel hidden';
    if(!show) hideEditor();
  }
  function hideEditor() {
    editorID = '';
    el('catalogEditor').className = 'catalogEditor hidden';
    el('catalogName').value = '';
    el('catalogURL').value = '';
  }
  function editCatalog(c) {
    editorID = c ? c.id : '';
    el('catalogName').value = c ? (c.name || '') : '';
    el('catalogURL').value = c ? (c.url || '') : '';
    el('catalogEditor').className = 'catalogEditor';
    status(c ? 'Sửa tên hoặc địa chỉ kho rồi bấm LƯU KHO.' : 'Nhập tên kho và địa chỉ OPDS mới.');
  }
  function postCatalog(payload, callback) {
    busy = true; buttons();
    http('POST','/api/catalogs',payload,function(err,data){
      busy = false;
      if(err || !applyCatalogResponse(data)) { buttons(); callback(err || 'Không cập nhật được danh sách kho.'); return; }
      buttons(); callback(null);
    });
  }
  function selectCatalog(id, openNow) {
    if(busy) return;
    postCatalog({action:'select',id:id},function(err){
      if(err) { status('Chuyển kho thất bại: '+err); return; }
      previous = []; currentRoute = null; next = ''; loaded = []; searching = false;
      el('search').value = ''; empty().appendChild(node('p','','Chưa có dữ liệu.'));
      el('heading').textContent = 'Sách và thư mục';
      showPanel(false);
      status('Đã chọn '+activeName+'.');
      if(openNow) requestCatalog({source:activeSource},false);
    });
  }
  function deleteCatalog(id) {
    if(busy) return;
    postCatalog({action:'delete',id:id},function(err){
      if(err) { status('Xóa kho thất bại: '+err); return; }
      previous=[]; currentRoute=null; next=''; loaded=[]; searching=false;
      renderCatalogList();
      status('Đã xóa kho. Kho hiện tại: '+activeName+'.');
    });
  }
  function renderCatalogList() {
    var list=el('catalogList'), i,c,row,pick,edit,del;
    while(list.firstChild) list.removeChild(list.firstChild);
    for(i=0;i<catalogs.length;i++) {
      c=catalogs[i]; row=node('div','catalogRow','');
      pick=node('button','catalogPick'+(c.id===activeSource?' selected':''),(c.id===activeSource?'✓ ':'')+(c.name || 'Kho sách'));
      pick.onclick=(function(id){return function(){selectCatalog(id,true);};})(c.id);
      row.appendChild(pick);
      if(!c.builtin) {
        edit=node('button','mini','SỬA');
        edit.onclick=(function(cat){return function(){editCatalog(cat);};})(c);
        del=node('button','mini delete','XÓA');
        del.onclick=(function(id){return function(){deleteCatalog(id);};})(c.id);
        row.appendChild(edit); row.appendChild(del);
      }
      list.appendChild(row);
    }
  }
  function routeRequest(route) {
    if(route && route.source) return '/api/catalog?source='+encodeURIComponent(route.source);
    return '/api/catalog?url='+encodeURIComponent(route && route.url ? route.url : '');
  }
  function render(query) {
    var q = trim(query).toLowerCase();
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
        btn.onclick = (function(u){return function(){requestCatalog({url:u},true);};})(item.url);
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
  function requestCatalog(route, saveHistory) {
    if(busy) return;
    if(!route || (!route.source && !/^https?:\/\/[^\s/]+/i.test(route.url || ''))) { status('Địa chỉ kho không hợp lệ.'); return; }
    if(saveHistory && currentRoute) previous.push(currentRoute);
    busy = true; searching = false; next = ''; loaded = []; buttons(); status('Đang tải '+activeName+'...');
    empty().appendChild(node('p','','Đang kết nối...'));
    http('GET',routeRequest(route),null,function(err,feed){
      busy = false;
      if(err || !acceptFeed(feed,'Danh mục OPDS')) { status('Mở kho thất bại: '+(err || 'Dữ liệu không hợp lệ.')); buttons(); return; }
      currentRoute = route; el('search').value = '';
      status('Đã tải '+loaded.length+' mục từ '+activeName+'.'); buttons();
    });
  }
  function searchAll() {
    if(busy) return;
    var q = trim(el('search').value);
    if(!q){ status('Nhập tên sách hoặc tác giả cần tìm.'); return; }
    if(!currentRoute){ status('Mở kho trước khi tìm toàn kho.'); return; }
    busy=true; searching=true; buttons(); status('Đang tìm trong '+activeName+'...');
    empty().appendChild(node('p','','Đang tìm kiếm...'));
    http('GET','/api/search?source='+encodeURIComponent(activeSource)+'&q='+encodeURIComponent(q),null,function(err,feed){
      busy=false;
      if(err || !acceptFeed(feed,'Kết quả tìm kiếm')){
        searching=false;
        status('Tìm toàn kho chưa dùng được: '+(err || 'Dữ liệu không hợp lệ.')+' Có thể dùng LỌC TRANG.');
        buttons(); return;
      }
      next='';
      status('Tìm thấy '+loaded.length+' mục trong '+activeName+'.'); buttons();
    });
  }
  function download(item,choice,btn){
    if(busy)return;
    busy=true; buttons(); btn.disabled=true; status('Đang tải: '+(item.title || 'Sách')+'...');
    http('POST','/api/download',{url:choice.url,title:item.title || 'Book',format:choice.format,referer:choice.referer || ''},function(err,result){
      busy=false; btn.disabled=false; buttons();
      if(err){status('Tải thất bại: '+err);return;}
      status((result.existing ? 'Đã có: ' : 'Đã lưu: ')+(result.name || 'sách')+((choice.format === 'EPUB') ? '. Mở bằng KOReader.' : '. Mở Kindle Library để tìm sách.'));
      btn.textContent='ĐÃ LƯU '+(choice.format || '');
    });
  }
  el('catalogMenu').onclick=function(){
    if(busy)return;
    loadCatalogs(function(err){
      if(err){status('Không đọc được danh sách kho: '+err);return;}
      renderCatalogList(); showPanel(el('catalogPanel').className.indexOf('hidden') >= 0);
    });
  };
  el('showAdd').onclick=function(){ if(!busy) editCatalog(null); };
  el('cancelCatalog').onclick=function(){ hideEditor(); status('Đã hủy chỉnh sửa kho.'); };
  el('saveCatalog').onclick=function(){
    if(busy)return;
    var name=trim(el('catalogName').value), url=trim(el('catalogURL').value);
    if(!name){status('Nhập tên kho.');return;}
    if(!/^https?:\/\/[^\s/]+/i.test(url)){status('Địa chỉ OPDS phải bắt đầu bằng http:// hoặc https://');return;}
    var wasEdit=!!editorID;
    var payload=editorID ? {action:'update',id:editorID,name:name,url:url} : {action:'add',name:name,url:url};
    postCatalog(payload,function(err){
      if(err){status('Lưu kho thất bại: '+err);return;}
      hideEditor(); renderCatalogList();
      status(wasEdit ? 'Đã cập nhật kho.' : 'Đã thêm kho. Chạm tên kho để chuyển.');
    });
  };
  el('open').onclick=function(){
    if(busy)return;
    loadCatalogs(function(err){
      if(err){status('Không đọc được danh sách kho: '+err);return;}
      previous=[]; currentRoute=null; requestCatalog({source:activeSource},false);
    });
  };
  el('back').onclick=function(){if(busy || searching || !previous.length)return;var r=previous.pop();requestCatalog(r,false);};
  el('next').onclick=function(){if(next && !busy && !searching)requestCatalog({url:next},true);};
  el('searchAll').onclick=searchAll;
  el('filterPage').onclick=function(){if(busy || !loaded.length)return;var q=el('search').value;var n=render(q);status(trim(q) ? ('Lọc được '+n+' mục trong trang hiện tại.') : ('Đang hiển thị '+n+' mục.'));};
  el('clearSearch').onclick=function(){if(busy || !loaded.length)return;el('search').value='';var n=render('');status('Đang hiển thị '+n+' mục.');};
  buttons();
}());