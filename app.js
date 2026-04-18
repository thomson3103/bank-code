/* Shared helpers: favorites, copy-to-clipboard, toast, search shortcut */
(function(){
  const FAV_KEY='bcn_favs_v2';
  window.BCN={
    getFavs(){try{return JSON.parse(localStorage.getItem(FAV_KEY))||[]}catch(e){return[]}},
    setFavs(f){localStorage.setItem(FAV_KEY,JSON.stringify(f));window.dispatchEvent(new Event('bcn-favs'))},
    isFav(code){return this.getFavs().some(f=>f.code===code)},
    toggleFav(item){
      const favs=this.getFavs();
      const i=favs.findIndex(f=>f.code===item.code);
      if(i>=0)favs.splice(i,1);else favs.unshift(item);
      this.setFavs(favs.slice(0,12));
    },
    removeFav(code){this.setFavs(this.getFavs().filter(f=>f.code!==code))},
    clearFavs(){if(confirm('お気に入りを全て削除しますか？'))this.setFavs([])},
    copy(text,label){
      navigator.clipboard.writeText(text).then(()=>{
        BCN.toast(label||text);
      }).catch(()=>{
        const ta=document.createElement('textarea');ta.value=text;document.body.appendChild(ta);ta.select();
        try{document.execCommand('copy')}catch(e){}
        document.body.removeChild(ta);BCN.toast(label||text);
      });
    },
    toast(code){
      let t=document.getElementById('bcn-toast');
      if(!t){t=document.createElement('div');t.id='bcn-toast';t.className='toast';document.body.appendChild(t)}
      t.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12l5 5L20 7"/></svg> コピーしました <span class="mono">'+code+'</span>';
      t.classList.add('show');
      clearTimeout(t._h);t._h=setTimeout(()=>t.classList.remove('show'),1800);
    }
  };
  // "/" to focus search
  document.addEventListener('keydown',e=>{
    if(e.key==='/'&&!['INPUT','TEXTAREA'].includes(document.activeElement.tagName)){
      const s=document.querySelector('[data-search-focus]');if(s){e.preventDefault();s.focus()}
    }
  });
  // Delegated: .code-chip click copies its data-code
  document.addEventListener('click',e=>{
    const chip=e.target.closest('.code-chip');
    if(chip&&chip.dataset.code){
      BCN.copy(chip.dataset.code,chip.dataset.code);
      chip.classList.add('copied');
      setTimeout(()=>chip.classList.remove('copied'),900);
    }
  });
})();
