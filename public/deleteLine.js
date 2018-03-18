function deleteLine(id){
    $.ajax({
        url: '/line/'+id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};