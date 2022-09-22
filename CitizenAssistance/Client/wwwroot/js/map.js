﻿
var appId = 'p6GqkdoqlSjfnyVvdIUL';
var appCode = '00CJe6ilEo6UAyApIR0JNA';

window.olMap = {
    showMap: function () {

        var HereLayers = [
            {
                base: 'base',
                type: 'maptile',
                scheme: 'osm',                
            },
            {
                base: 'base',
                type: 'maptile',
                scheme: 'normal.day',
                app_id: appId,
                app_code: appCode
            },
            {
                base: 'base',
                type: 'maptile',
                scheme: 'normal.day.transit',
                app_id: appId,
                app_code: appCode
            },
            {
                base: 'base',
                type: 'maptile',
                scheme: 'pedestrian.day',
                app_id: appId,
                app_code: appCode
            },
            {
                base: 'aerial',
                type: 'maptile',
                scheme: 'terrain.day',
                app_id: appId,
                app_code: appCode
            },
            {
                base: 'aerial',
                type: 'maptile',
                scheme: 'satellite.day',
                app_id: appId,
                app_code: appCode
            },
            {
                base: 'aerial',
                type: 'maptile',
                scheme: 'hybrid.day',
                app_id: appId,
                app_code: appCode
            }
        ];
        var urlTpl = 'https://{1-4}.{base}.maps.cit.api.here.com' +
            '/{type}/2.1/maptile/newest/{scheme}/{z}/{x}/{y}/256/png' +
            '?app_id={app_id}&app_code={app_code}';

        var layers = [];

        var osmLayer = new ol.layer.Tile({
            visible: false,
            type: "base",
            preload: Infinity,
            source: new ol.source.OSM()
        });

        //loads data from a json file and creates features
        function loadAirportData(data) {

            var airportsSource = new ol.source.Vector();

            // transform the geometries into the view's projection
            var transform = ol.proj.getTransform('EPSG:4326', 'EPSG:3857');

            // loop over the items in the response
            for (var i = 0; i < data.length; i++) {
               
                //create a new feature with the item as the properties
                var feature = new ol.Feature(data[i]);

                // add a name property for later ease of access
                feature.set('name', data[i].Name);

                // create an appropriate geometry and add it to the feature
                var coordinate = transform([parseFloat(data[i].Longitude), parseFloat(data[i].Latitude)]);
                var geometry = new ol.geom.Point(coordinate);
                feature.setGeometry(geometry);

                // add the feature to the source
                airportsSource.addFeature(feature);
            }

            return airportsSource;
        }

        var vectorLayer = new ol.layer.Vector({
            source: loadAirportData(airportsdata),           
            visible: true,
            style: new ol.style.Style({
                image: new ol.style.Circle( /** @type {olx.style.IconOptions} */({
                    radius: 5,
                    fill: new ol.style.Fill({
                        color: '#0004ff'
                    })
                }))
            })
        });

       
        

        var i, ii;

        for (i = 0, ii = HereLayers.length; i < ii; ++i) {
            var layerDesc = HereLayers[i];

            if (layerDesc.scheme === "osm") {
                layers.push(osmLayer);
            }          

            if (layerDesc.scheme !== "osm") {
                layers.push(new ol.layer.Tile({
                    visible: false,
                    type: "base",
                    preload: Infinity,
                    source: new ol.source.XYZ({
                        url: createUrl(urlTpl, layerDesc),
                        attributions: 'Map Tiles &copy; ' + new Date().getFullYear() + ' ' +
                            '<a href="http://developer.here.com">HERE</a>'
                    })
                }));
            }
        }

        /**
        * Elements that make up the popup.
        */
        var container = document.getElementById('popup');
        var content = document.getElementById('popup-content');
        var closer = document.getElementById('popup-closer');


        /**
         * Create an overlay to anchor the popup to the map.
         */
        var overlay = new ol.Overlay({
            element: container,
            autoPan: true,
            autoPanAnimation: {
                duration: 250
            }
        });


        /**
         * Add a click handler to hide the popup.
         * @return {boolean} Don't follow the href.
         */
        closer.onclick = function () {
            overlay.setPosition(undefined);
            closer.blur();
            return false;
        };


        var map = new ol.Map({
            overlays: [overlay],
            target: 'map',
            layers: layers,
            view: new ol.View({
                center: ol.proj.fromLonLat([36.8173, -1.2865]),
                zoom: 18
            })
        });

        map.addLayer(vectorLayer);       


        /**
       * Add a click handler to the map to render the popup.
       */
        map.on('singleclick', function (evt) {
            var coordinate = evt.coordinate;
            var hdms = ol.coordinate.toStringHDMS(ol.proj.toLonLat(coordinate));

            content.innerHTML = '<div style="background-color:black;color:white;padding:20px;"><p>Latitude and Longitude:</p><code>' + hdms +
                '</code></div>';
            overlay.setPosition(coordinate);
        });



        function createUrl(tpl, layerDesc) {
            return tpl
                .replace('{base}', layerDesc.base)
                .replace('{type}', layerDesc.type)
                .replace('{scheme}', layerDesc.scheme)
                .replace('{app_id}', layerDesc.app_id)
                .replace('{app_code}', layerDesc.app_code);
        }

        var select = document.getElementById('layer-select');

        function onChange() {
            var scheme = select.value;
            for (var i = 0, ii = layers.length; i < ii; ++i) {
                layers[i].setVisible(HereLayers[i].scheme === scheme);                
            }
        }

        select.addEventListener('change', onChange);

        onChange();
    }
};


