function checkHandle(id){
    var checkbox = document.getElementById(id);
    checkbox.addEventListener("click", function(){
        if(checkbox.checked==true){
            checkbox.checked = false;
        } else {
            checkbox.checked = true;
        }
    });
}