window.olMap = {
    showMap: function () {
        var map = new ol.Map({
            target: 'map',
            layers: ol.layer,
            view: new ol.View({
                center: ol.proj.fromLonLat([36.8173, -1.2865]),
                zoom: 18
            })
        });    
    }
};