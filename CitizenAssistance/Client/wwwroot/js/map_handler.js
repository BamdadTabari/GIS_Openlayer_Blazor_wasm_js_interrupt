
function call_map() {
    //var map = new ol.Map({
    //    // id of html element that contains our map
    //    target: '',
    //    // map layers we can set multiple layers
    //    layers: [
    //        new ol.layer.Tile({
    //            source: new ol.source.OSM({ crossOrigin: null })
    //        })
    //    ],
    //    // this is our map view setting
    //    view: new ol.View({
    //        center: ol.proj.fromLonLat([100, 5000]),
    //        zoom: 5
    //    })
    //});

    if (window.divMap == null) {
        window.divMap = new ol.Map({
            target: 'map',
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.OSM()
                })
            ]
        });
    }

    window.divMap.setView(
        new ol.View({
            center: ol.proj.fromLonLat(0,0),
            zoom: 16
        })
    );
}