javascript:(function(){
    let floatDiv=document.createElement('div');
    floatDiv.id='omegas-float-window';
    Object.assign(floatDiv.style,{
        position:'fixed',top:'100px',left:'100px',width:'800px',height:'600px',
        backgroundColor:'#222',color:'#eee',fontFamily:'sans-serif',
        border:'1px solid #444',borderRadius:'5px',
        boxShadow:'0 4px 10px rgba(0,0,0,0.5)',zIndex:999999,
        overflow:'hidden',display:'flex',flexDirection:'column'
    });

    let header=document.createElement('div');
    Object.assign(header.style,{
        display:'flex',justifyContent:'space-between',alignItems:'center',
        backgroundColor:'#333',padding:'5px 10px',cursor:'grab',userSelect:'none'
    });
    header.innerHTML='<span>Omega\'s Tool</span><div id="header-buttons" style="display: flex; align-items: center;"></div>';
    let headerButtons=header.querySelector('#header-buttons');

    // Tombol Open di tab baru (tetap ada sebagai alternatif)
    let openBtn=document.createElement('button');
    openBtn.textContent='Open in new tab';
    Object.assign(openBtn.style,{
        backgroundColor:'#e94560',color:'white',border:'none',padding:'5px 10px',
        marginLeft:'5px',cursor:'pointer',borderRadius:'3px',fontSize:'0.9em'
    });
    openBtn.addEventListener('mouseenter',()=>openBtn.style.backgroundColor='#c93550');
    openBtn.addEventListener('mouseleave',()=>openBtn.style.backgroundColor='#e94560');

    // Tombol minimize
    let minimizeBtn=document.createElement('button');
    minimizeBtn.textContent='_';
    Object.assign(minimizeBtn.style,{
        backgroundColor:'#555',color:'white',border:'none',padding:'5px 10px',
        marginLeft:'5px',cursor:'pointer',borderRadius:'3px',fontSize:'0.9em'
    });
    minimizeBtn.addEventListener('mouseenter',()=>minimizeBtn.style.backgroundColor='#777');
    minimizeBtn.addEventListener('mouseleave',()=>minimizeBtn.style.backgroundColor='#555');

    // Tombol close
    let closeBtn=document.createElement('button');
    closeBtn.textContent='X';
    Object.assign(closeBtn.style,{
        backgroundColor:'#555',color:'white',border:'none',padding:'5px 10px',
        marginLeft:'5px',cursor:'pointer',borderRadius:'3px',fontSize:'0.9em'
    });
    closeBtn.addEventListener('mouseenter',()=>closeBtn.style.backgroundColor='#777');
    closeBtn.addEventListener('mouseleave',()=>closeBtn.style.backgroundColor='#555');

    headerButtons.appendChild(openBtn);
    headerButtons.appendChild(minimizeBtn);
    headerButtons.appendChild(closeBtn);

    // Wrapper konten utama – langsung berisi iframe
    let contentWrapper=document.createElement('div');
    Object.assign(contentWrapper.style,{
        flex:1,display:'flex',flexDirection:'column',overflow:'hidden',padding:'0'
    });
    let iframe=document.createElement('iframe');
    iframe.src='https://cheatnetwork.eu/services/quizizz';
    Object.assign(iframe.style,{
        width:'100%',height:'100%',border:'none',backgroundColor:'#fff'
    });
    contentWrapper.appendChild(iframe);

    // Placeholder saat minimize
    let minimizedPlaceholder=document.createElement('div');
    Object.assign(minimizedPlaceholder.style,{
        display:'none',textAlign:'center',paddingTop:'10px',fontSize:'0.9em',cursor:'pointer'
    });
    minimizedPlaceholder.innerHTML='<span>Hidden!</span> <button id="restoreButton" style="background-color:#e94560; color:white; border:none; padding:3px 8px; margin-left:5px; cursor:pointer; border-radius:3px;">Restore</button>';

    floatDiv.appendChild(header);
    floatDiv.appendChild(contentWrapper);
    floatDiv.appendChild(minimizedPlaceholder);
    document.body.appendChild(floatDiv);

    // State dan fungsi resize
    let isMinimized=false;
    const originalWidth=800,originalHeight=600,minimizedWidth=180,minimizedHeight=60;
    function resizeContainer(w,h){ floatDiv.style.width=w+'px'; floatDiv.style.height=h+'px'; }

    // Event tombol
    minimizeBtn.addEventListener('click',()=>{
        if(!isMinimized){
            contentWrapper.style.display='none';
            minimizedPlaceholder.style.display='block';
            minimizeBtn.textContent='☐';
            floatDiv.querySelector('span').textContent='Omega (Hidden)';
            resizeContainer(minimizedWidth,minimizedHeight);
        }else{
            contentWrapper.style.display='flex';
            minimizedPlaceholder.style.display='none';
            minimizeBtn.textContent='_';
            floatDiv.querySelector('span').textContent="Omega's Tool";
            resizeContainer(originalWidth,originalHeight);
        }
        isMinimized=!isMinimized;
    });

    let restoreBtn=minimizedPlaceholder.querySelector('#restoreButton');
    restoreBtn.addEventListener('click',()=>{
        contentWrapper.style.display='flex';
        minimizedPlaceholder.style.display='none';
        minimizeBtn.textContent='_';
        floatDiv.querySelector('span').textContent="Omega's Tool";
        resizeContainer(originalWidth,originalHeight);
        isMinimized=false;
    });

    openBtn.addEventListener('click',()=>{
        window.open('https://cheatnetwork.eu/services/quizizz','_blank');
    });

    closeBtn.addEventListener('click',()=>{ floatDiv.remove(); });

    // Drag functionality
    let isDragging=false,startX,startY,startLeft,startTop;
    header.addEventListener('mousedown',(e)=>{
        e.preventDefault();
        isDragging=true;
        startX=e.clientX; startY=e.clientY;
        startLeft=floatDiv.offsetLeft; startTop=floatDiv.offsetTop;
        header.style.cursor='grabbing';
    });
    document.addEventListener('mousemove',(e)=>{
        if(!isDragging) return;
        e.preventDefault();
        let dx=e.clientX-startX, dy=e.clientY-startY;
        let newLeft=startLeft+dx, newTop=startTop+dy;
        newLeft=Math.max(0,Math.min(window.innerWidth-floatDiv.offsetWidth,newLeft));
        newTop=Math.max(0,Math.min(window.innerHeight-floatDiv.offsetHeight,newTop));
        floatDiv.style.left=newLeft+'px'; floatDiv.style.top=newTop+'px';
    });
    document.addEventListener('mouseup',()=>{
        if(isDragging){ isDragging=false; header.style.cursor='grab'; }
    });
    header.addEventListener('mouseleave',()=>{ if(!isDragging) header.style.cursor='grab'; });
})();
