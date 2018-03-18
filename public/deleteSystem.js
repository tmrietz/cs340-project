function deleteStation(id){
    $.ajax({
        url: '/system/'+id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};