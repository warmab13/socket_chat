// Functions to render users
var params = new URLSearchParams( window.location.search );

var name_user = params.get('name')
var room = params.get('room')

//Jquery refs
var divUsuarios  = $('#divUsuarios');
var formSend  = $('#formSend');
var txtMessage  = $('#txtMessage');
var divChatbox = $('#divChatbox');

function renderUsers(persons){ //[{},{},{}]
    console.log(persons);

    let html = '';

    html += '<li>';
    html += '   <a href="javascript:void(0)" class="active"> Chat de <span> '+ params.get('room') +'</span></a>';
    html += '</li>';

    for( var i = 0; i< persons.length; i++){
        html +='<li>'
        html += '   <a data-id="'+ persons[i].id +'" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>'+ persons[i].name +' <small class="text-success">online</small></span></a>';
        html +='</li>'
    }

    divUsuarios.html(html);
}


//Listeners JQUERY
divUsuarios.on('click', 'a', function(){
    let id = $(this).data('id');
    if( id ) {console.log(id)} 
})

function renderMessages( msg, me ){
    var html = '';

    var date = new Date(msg.date)
    var hour = date.getHours() + ':' + date.getMinutes();

    var adminClass = 'info';
    console.log("Message render messages", msg)
    if(msg.name === 'Administrator'){
        adminClass = 'danger';
    }

    console.log("admin class ", adminClass)
    if( me ){
        html += '<li class="reverse">';
        html += '    <div class="chat-content">';
        html += '        <h5>'+ msg.name +'</h5>';
        html += '        <div class="box bg-light-inverse">'+ msg.msg +'</div>';
        html += '    </div>';
        html += '    <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>';
        html += '    <div class="chat-time">'+ hour +'</div>';
        html += '</li>';
    }else{
        html+= '<li class="animated fadeIn">';
        html+=      '<div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>';
        html+=          '<div class="chat-content">';
        html+=              '<h5>' + msg.name +'</h5>';
        html+=              '<div class="box bg-light-'+adminClass+'">'+ msg.msg +'</div>';
        html+=          '</div>';
        html+=      '<div class="chat-time">'+ hour +'</div>';
        html+= '</li>';
    }

    divChatbox.append(html)

}

function scrollBottom(){

    //selectors
    var newMessage = divChatbox.children('li:last-child');

    //heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        divChatbox.scrollTop(scrollHeight)
    }
}

formSend.on('submit', function(e){
    e.preventDefault(); //evita que cuando se haga enter no postee la data
    console.log(txtMessage.val())
    if( txtMessage.val().trim().length === 0 ){
        return;
    }
    
    socket.emit('createMessage', {
        user: name_user,
        msg: txtMessage.val()
    }, function(msg) {
        console.log("Create message");
        console.log('respuesta server: ', msg);
        txtMessage.val('').focus();
        renderMessages(msg, true)
        scrollBottom();
    });
});