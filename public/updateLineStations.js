function updateLineStations(id){
    $.ajax({
        url: '/line_station/'+id,
        type: 'PUT',
        data: $('#update-line_station').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};