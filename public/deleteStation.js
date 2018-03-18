function deleteStation(id){
    $.ajax({
        url: '/station/'+id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};