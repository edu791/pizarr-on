$(document).ready(function(){				
	//var cod_sala = "0";
	var user = "usuario"+Math.floor(Math.random()*10000);
	$("#user_saludo").html(user);

	$("#accordion").accordion();	

////////////////////////////////////////////////////////////////////////////
//DIBUJO								           

	var socket = io.connect('http://192.168.1.101:9090');
	// var socket = io.connect('http://pizarron-edwardoyarzun.dotcloud.com/');
	socket.emit("login_sala", cod_sala);	            

    var path = new Array();
    var click = false;
    var x1,y1 = "";
    var canvas = document.getElementById("canvas");
    var cntx = canvas.getContext("2d");
    cntx.beginPath();
    cntx.strokeStyle = "white";
    cntx.lineWidth = 3;
    cntx.lineCap = "round";
    cntx.fillStyle = "#222222";
    cntx.fillRect(0,0,canvas.width,canvas.height);	            
    cntx.closePath;    				  

    $("#canvas").mousedown(function(canvas){	            	
        click=true;	                
        x1=canvas.pageX-this.offsetLeft;
        y1=canvas.pageY-this.offsetTop
    });

    $("#canvas").mouseup(function(){	            	
        click=false	                
        socket.emit("path_client_server", {'cod_sala': cod_sala, 'user':user, 'path': path, 'color': cntx.strokeStyle, 'ancho': cntx.lineWidth});
        path = new Array();
    });

    $("#canvas").mousemove(function(canvas){	            		            	
        if(click==true){	                	
            cntx.beginPath();
            y2=canvas.pageX-this.offsetLeft;
            x2=canvas.pageY-this.offsetTop;
            cntx.moveTo(y2,x2);
            cntx.lineTo(x1,y1);
            path.push({"x1":x1, "y1":y1, "x2":x2, "y2":y2});
            cntx.stroke();
            cntx.closePath();
            x1=canvas.pageX-this.offsetLeft;
            y1=canvas.pageY-this.offsetTop;
        }
    });

    $("#colores > div").click(function(){            	
    	cntx.strokeStyle=$(this).css("background-color");
    });

    $("#btn_limpiar").click(function(){	            	
        cntx.fillRect(0,0,canvas.width,canvas.height);		            
        socket.emit("limpiar_client_server", {user: user});  		              
    });

    $("#ancho").change(function(){
    	cntx.lineWidth = $(this).val();
    });

  socket.on("path_server_client", function (data) {                   
        ruta = data.path;
        colorAnt = cntx.strokeStyle;
        anchoAnt = cntx.lineWidth;
		var i;					
		cntx.beginPath();
    	cntx.strokeStyle = data.color;
    	cntx.lineWidth = data.ancho;					
        for(i=0; i<ruta.length; i++){	                    			        	
            cntx.moveTo(ruta[i].y2,ruta[i].x2);
            cntx.lineTo(ruta[i].x1,ruta[i].y1);          			            				        
        }                
        cntx.stroke();           	                    				        
        cntx.closePath();  			        
        cntx.strokeStyle = colorAnt;
        cntx.lineWidth = anchoAnt;               
  });

  socket.on("limpiar_server_client", function (data) {   
        cntx.fillStyle="#222222";
        cntx.fillRect(0,0,canvas.width,canvas.height);			        
  });			  
//////////////////////////////////////////////////////////////////////////////
//CHAT          

    $("#boton_enviar").click(function(){
    	if(user != null && user != ""){
            mensaje = $("#texto").val();
            socket.emit("chat_client_server", {'cod_sala': cod_sala, 'user': user, 'mensaje': mensaje});    
            $("#texto").val("");
            $("#texto").focus();
    	}
    });

    socket.on("chat_server_client", function(data){ 
        $("#mensajes").append("<div class='mens'><span style='color: blue;'>"+data.user+": </span>"+data.mensaje+"</div>");
    });

////////////////////////////////////////////////////////////////////////////
///OTROS

	$("#elegir_usuario").click(function(){
		user = prompt("Ingrese su nombre de usuario", "usuario"+Math.floor(Math.random()*10000));
		$("#user_saludo").html(user);
	});							

});