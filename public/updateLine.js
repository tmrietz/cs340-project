function updateLine(id){
    $.ajax({
        url: '/line/'+id,
        type: 'PUT',
        data: $('#update-line').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};