function deleteLineStation(id){
    $.ajax({
        url: '/line_station/'+id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};