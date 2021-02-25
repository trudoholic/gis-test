var mapPanel, store, gridPanel, mainPanel;

Ext.onReady(function() {
    var map = new OpenLayers.Map();
    var wmsLayer = new OpenLayers.Layer.WMS(
        "vmap0",
        "http://vmap0.tiles.osgeo.org/wms/vmap0",
        {layers: 'basic'}
    );

    var vecLayer = new OpenLayers.Layer.Vector("vector");
    map.addLayers([wmsLayer, vecLayer]);

    mapPanel = new GeoExt.MapPanel({
        title: "Map",
        region: "center",
        height: 400,
        width: 600,
        map: map,
        center: new OpenLayers.LonLat(15, 50),
        zoom: 3.5
    });
 
    store = new GeoExt.data.FeatureStore({
        layer: vecLayer,
        fields: [
            {name: 'name', type: 'string'},
            {name: 'elevation', type: 'float'}
        ],
        proxy: new GeoExt.data.ProtocolProxy({
            protocol: new OpenLayers.Protocol.HTTP({
                url: "data/summits.json",
                format: new OpenLayers.Format.GeoJSON()
            })
        }),
        autoLoad: true
    });

    gridPanel = new Ext.grid.GridPanel({
        title: "Target Types",
        region: "west",
        store: store,
        width: 125,
        columns: [{
            header: "Type",
            width: 120,
            dataIndex: "name"
        }],
        sm: new GeoExt.grid.FeatureSelectionModel() 
    });

    mainPanel = new Ext.Panel({
        renderTo: "mainpanel",
        layout: "border",
        height: 400,
        width: 920,
        items: [mapPanel, gridPanel]
    });
});

