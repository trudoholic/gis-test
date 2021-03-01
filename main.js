var mapPanel, store, gridPanel, mainPanel;

Ext.onReady(function() {
    Ext.QuickTips.init();
	
    var map = new OpenLayers.Map();
    var wmsLayer = new OpenLayers.Layer.WMS(
        "Global",
        "http://vmap0.tiles.osgeo.org/wms/vmap0",
        {layers: 'basic'}
    );

    var vector = new OpenLayers.Layer.Vector("vector");
    map.addLayers([wmsLayer, vector]);
	
    map.addControl(new OpenLayers.Control.LayerSwitcher());

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
        layer: vector,
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
		title: "GeoExt Editor Demo",
        renderTo: "mainpanel",
        layout: "border",
        height: 400,
        width: 920,
        tbar: new Ext.Toolbar({
            items: [
				new GeoExt.Action({
					text: "nav",
					control: new OpenLayers.Control.Navigation(),
					map: map,
					// button options
					toggleGroup: "draw",
					allowDepress: false,
					pressed: true,
					tooltip: "navigate",
					// check item options
					group: "draw",
					checked: true
				}),
				//
				new GeoExt.Action({
					text: "draw line",
					control: new OpenLayers.Control.DrawFeature(
						vector, OpenLayers.Handler.Path
					),
					map: map,
					// button options
					toggleGroup: "draw",
					allowDepress: false,
					tooltip: "draw line",
					// check item options
					group: "draw"
				}),
            ]
        }),
        items: [mapPanel, gridPanel]
    });
});

