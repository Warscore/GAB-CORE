import React, { useEffect } from 'react';

export default function App() {
  useEffect(() => {
    // Código JavaScript del prototipo funcional completo
    var $=function(s){return document.querySelector(s)},$$=function(s){return document.querySelectorAll(s)};
    function I(n,c){return '<svg class="i '+(c||'')+'"><use href="#i-'+n+'"/></svg>'}
    var tm;function T(m){var t=$("#to");if(!t)return;t.textContent=m;t.classList.add("on");clearTimeout(tm);tm=setTimeout(function(){t.classList.remove("on")},2200)}

    var N=[["cat","Catálogo"],["reg","Registro"],["pago","Pago"],["ayuda","Mesa de ayuda"],["eq","Equipos"]];
    var navContainer = $("#nav");
    if(navContainer && !navContainer.hasChildNodes()){
      navContainer.innerHTML=N.map(function(n){return '<button data-v="'+n[0]+'"'+(n[0]=="cat"?' class="on"':'')+'>'+I(n[0])+n[1]+(n[0]=="pago"?'<i class="nb" id="nb"></i>':'')+'</button>'}).join("");
    }
    function go(v){$$(".v").forEach(function(x){x.classList.remove("on")});var target=$("#"+v);if(target)target.classList.add("on");$$("#nav button").forEach(function(b){b.classList.toggle("on",b.dataset.v==v)});scrollTo(0,0)}
    $$("#nav button").forEach(function(b){b.onclick=function(){go(b.dataset.v)}});

    var R=document.documentElement;
    function dk(){return R.dataset.theme?R.dataset.theme=="dark":matchMedia("(prefers-color-scheme:dark)").matches}
    function ts(d){var th=$("#th"),thi=$("#thi");if(th)th.classList.toggle("d",d);if(thi)thi.innerHTML='<use href="#i-'+(d?"moon":"sun")+'"/>'}
    var thBtn = $("#th");
    if(thBtn) thBtn.onclick=function(){var d=!dk();R.dataset.theme=d?"dark":"light";ts(d)};
    ts(dk());

    var usBtn = $("#us-btn");
    if(usBtn) usBtn.onclick=function(e){e.stopPropagation();var m=$("#us-menu");if(m)m.classList.toggle("open")};
    function closeUsMenu(){var m=$("#us-menu");if(m)m.classList.remove("open")}
    document.addEventListener("click", closeUsMenu);

    window.openLoginModal = function(){var m=$("#login-modal");if(m)m.classList.add("open")}
    window.closeLoginModal = function(){var m=$("#login-modal");if(m)m.classList.remove("open");var msg=$("#l-msg");if(msg)msg.textContent=""}
    window.go = go;

    var lBtn = $("#l-btn");
    if(lBtn) lBtn.onclick=function(){
      var m=$("#l-mail").value.trim(), p=$("#l-pass").value.trim();
      var lMsg = $("#l-msg");
      if(!m || !p){ if(lMsg){lMsg.className="er"; lMsg.textContent="Ingresa tu correo y contraseña.";} return; }
      if(lMsg){lMsg.className="ok"; lMsg.textContent="¡Bienvenido a GAPCore!";}
      setTimeout(function(){ closeLoginModal(); T("Sesión iniciada correctamente"); }, 1000);
    };

    $$(".seg").forEach(function(s){
      s.onclick=function(e){
        var b=e.target.closest("button");if(!b)return;
        s.querySelectorAll("button").forEach(function(x){x.classList.remove("on")});
        b.classList.add("on");
        if(s.id=="chips"){window.F.c=b.textContent;window.gr()}
      }
    });

    var P=[
      ["Portátil Pro 14","$3.200.000",1,"lap","Computadores",205,"hp lenovo intel i7 ssd 512gb ram 16gb laptop portatiles"],
      ["Portátil HP 15 Ryzen 7","$2.099.000",1,"lap","Computadores",190,"hp ryzen 7 amd ssd 512gb ram 8gb laptop portatiles"],
      ["Lenovo ThinkPad X1","$4.800.000",0,"lap","Computadores",210,"lenovo intel i7 ssd 1tb ram 16gb laptop portatiles"],
      ["Router WiFi 6 Gigabit","$280.000",1,"wifi","Redes",265,"router wifi6 tplink red internet mesh"],
      ["Switch 24 Puertos Cisco","$1.150.000",0,"sw","Redes",160,"switch cisco red gigabit ethernet"],
      ["Impresora Láser HP Mono","$890.000",0,"prt","Impresoras",330,"impresora laser hp multifuncional toner impresoras"],
      ["Epson EcoTank L3250","$750.000",1,"prt","Impresoras",340,"impresora epson tinta continua wifi impresoras"],
      ["Servidor Torre Dell T440","$6.400.000",1,"eq","Computadores",25,"servidor dell xeon rack datos empresa computadores"]
    ];
    window.F={c:"Todas",q:""};
    window.gr = function(){
      var grid = $("#grid");
      if(!grid) return;
      grid.innerHTML = P.map(function(p){
        return '<div class="pc"><div class="ps" style="--h:'+p[5]+'"><div class="tags">'+(p[2]?'<span class="bdg of">Oferta</span>':'')+'<span class="bdg">En stock</span></div>'+I(p[3])+'<button class="add" data-product="'+p[0]+'">'+I("plus")+'<span>Agregar</span></button></div><h3>'+p[0]+'</h3><div class="pr">'+p[1]+'</div></div>';
      }).join("");
    };
    window.gr();
  }, []);

  return (
    <div>
      <header>
        <span className="logo"><b>G</b>AP<small>.core</small></span>
        <button className="tg" id="th" aria-label="Cambiar tema"><span><svg className="i" id="thi"><use href="#i-sun"/></svg></span></button>
        <label className="sr"><input id="q" placeholder="Buscar productos..."/><svg className="i"><use href="#i-search"/></svg></label>
        <span id="session-label" className="session-label">Invitado</span>
        <div className="us-wrap">
          <button className="us" id="us-btn" aria-label="Cuenta"><svg className="i fl"><use href="#i-user"/></svg></button>
          <div className="us-menu" id="us-menu">
            <button onClick={() => window.go('reg')}><svg className="i"><use href="#i-reg"/></svg> Registrarse</button>
            <button onClick={() => window.openLoginModal()}><svg className="i"><use href="#i-login"/></svg> Iniciar sesión</button>
          </div>
        </div>
      </header>
      <aside id="nav"></aside>
      <main>
        <div className="v on" id="cat">
          <div className="hero" id="hero"></div>
          <div className="pm"><div><b>Ofertas GAPCore <em>hasta -15%</em></b><span>Tecnología para tu empresa</span></div></div>
          <div className="sh"><h2 className="t">Catálogo</h2><div className="seg" id="chips"><button className="on">Todas</button><button>Ofertas</button><button>Computadores</button><button>Redes</button><button>Impresoras</button></div></div>
          <div className="gd" id="grid"></div>
        </div>
        <div className="v" id="reg">
          <div className="rg">
            <div className="side"><svg className="i art"><use href="#i-reg"/></svg><h2>Crea tu cuenta</h2><p>Gestiona tus equipos y tickets.</p></div>
            <div className="fm">
              <h2 className="t">Cuenta de cliente</h2>
              <label className="l">Correo electrónico</label><input className="f" id="f-mail" type="email" placeholder="correo@ejemplo.com"/>
              <label className="l">Contraseña</label><input className="f" id="f-pass" type="password" placeholder="Mínimo 8 caracteres"/>
              <button className="bt w" id="regb"><svg className="i"><use href="#i-reg"/></svg><span>Registrarme</span></button>
              <div id="regm" style={{textAlign:'center', marginTop:'12px', fontWeight:700}}></div>
            </div>
          </div>
        </div>
        <div className="v" id="pago">
          <div className="two">
            <div className="cd"><h2 className="t">Resumen de la orden</h2><div id="cart-lines"></div><div className="tt"><span>Total</span><span className="ac" id="cart-total">$0</span></div></div>
            <div className="cd"><h2 className="t">Medio de pago</h2>
              <div className="seg" id="p-method"><button className="on">PSE / transferencia</button><button>Tarjeta</button><button>Billetera digital</button></div>
              <button className="bt w" id="pb"><svg className="i fl"><use href="#i-play"/></svg><span>Simular pago</span></button>
              <div className="stt"><small>Estado del pago</small><div className="big" id="pst">Pendiente</div><div className="pb"><i id="pbar"></i></div></div>
            </div>
          </div>
        </div>
        <div className="v" id="ayuda">
          <div className="two">
            <div className="cd"><h2 className="t">Nuevo ticket</h2><label className="l">Asunto</label><input className="f" id="ta" placeholder="Ej. Falla en equipo"/><button className="bt w" id="tb"><span>Enviar ticket</span></button></div>
            <div className="cd"><h2 className="t">Mis tickets</h2><div id="tt"></div></div>
          </div>
        </div>
        <div className="v" id="eq">
          <div className="kp"><div><b>48</b>Equipos</div><div><b>6</b>Mantenimiento</div></div>
          <div className="cd"><h2 className="t">Control de equipos</h2><table><thead><tr><th>Serie</th><th>Equipo</th><th>Estado</th></tr></thead><tbody id="et"></tbody></table></div>
        </div>
      </main>
      <div className="modal-overlay" id="login-modal">
        <div className="modal">
          <button className="modal-close" onClick={() => window.closeLoginModal()}>&times;</button>
          <h2 className="t">Iniciar sesión</h2>
          <label className="l">Correo electrónico</label><input className="f" id="l-mail" type="email"/>
          <label className="l">Contraseña</label><input className="f" id="l-pass" type="password"/>
          <button className="bt w ac" id="l-btn" style={{marginTop:'20px'}}><span>Ingresar</span></button>
          <div id="l-msg"></div>
        </div>
      </div>
      <div className="to" id="to"></div>
    </div>
  );
}
