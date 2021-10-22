import 'ol/ol.css';
import 'ol-layerswitcher/src/ol-layerswitcher.css';
import { Map, View, Feature, Overlay, Graticule } from 'ol/index';
import { fromLonLat, toLonLat, useGeographic, transform } from 'ol/proj';
import { toStringHDMS } from 'ol/coordinate';
import { defaults as defaultControls, ZoomToExtent, ScaleLine, ZoomSlider, Attribution, FullScreen, Control, MousePosition } from 'ol/control';
import { Circle as CircleStyle, Circle, Icon, Fill, Stroke, Style, Text } from 'ol/style';
import { bbox as bboxStrategy } from 'ol/loadingstrategy';
import { Tile as TileLayer, Vector as VectorLayer, LayerTile } from 'ol/layer';
import { ImageArcGISRest, TileArcGISRest, XYZ, OSM, Stamen, BingMaps } from 'ol/source';
import LayerSwitcher from 'ol-layerswitcher';
import LayerGroup from 'ol/layer/Group';
import LayerImage from 'ol/layer/Image';
import VectorSource from 'ol/source/Vector';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import TileJSON from 'ol/source/TileJSON';


let attribution = new Attribution({
    collapsible: true
});

//Poopup
/**
* Elements that make up the popup.
*/

let container = document.getElementById('popup');
let content = document.getElementById('popup-content');
let closer = document.getElementById('popup-closer');



/**

* Create an overlay to anchor the popup to the map.

*/

let overlay = new Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation: {
        duration: 250
    }

});

/**
  Add a click handler to hide the popup.
* @return {boolean} Don't follow the href.
*/

closer.onclick = function () {
    overlay.setPosition(undefined);
    closer.blur();
    return false;
};

//Raster
let arcgis = new TileLayer({
    title: 'ArcGIS',
    type: 'base',
    visible: true,
    source: new XYZ({
        attributions: 'Tiles © <a href="https://services.arcgisonline.com/ArcGIS/' +
            'rest/services/World_Topo_Map/MapServer">ArcGIS</a>',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/' +
            'World_Topo_Map/MapServer/tile/{z}/{y}/{x}'
    })
});

let graticule = new Graticule({
    title: 'Graticule',
    //type: 'base',
    combine: true,
    visible: true,
    opaque: false,
    strokeStyle: new Stroke({
        color: 'rgba(255,120,0,0.9)',
        width: 2.5,
        lineDash: [0.5, 4]
    }),
    showLabels: true,
    wrapX: false
});


//VECTORI

let vector4wfs = new VectorLayer({
    title: 'World',
    visible: false,
    source: new VectorSource({
        format: new GeoJSON(),
        url: function (extent) {
            return 'https://ahocevar.com/geoserver/wfs?service=WFS&' +
                'version=1.1.0&request=GetFeature&typename=opengeo:countries&' +
                'outputFormat=application/json&srsname=EPSG:4326&' +
                'bbox=' + extent.join(',') + ',EPSG:3857';
        },
        strategy: bboxStrategy,
        crossOrigin: 'anonymous'
    }),

    style: new Style({
        fill: new Fill({
            color: [105, 107, 41, 0.1]
        }),

        stroke: new Stroke({
            color: 'rgba(107, 99, 89, 1.0)',
            width: 0.5
        })

    })

});



//Style Countries (label si vectors)

let styletext = new Style({

    text: new Text({
        font: '10px "Open Sans", "Arial Unicode MS", "sans-serif"',
        placement: 'point',
        overflow: true,
        fill: new Fill({
            color: 'black'
        }),

        stroke: new Stroke({
            color: '#fff',
            width: 3
        })
    })

});



let countryStyle = new Style({
    fill: new Fill({
        color: 'rgba(255, 255, 255, 0.6)'
    }),

    stroke: new Stroke({
        color: '#319FD3',
        width: 1
    })
});

let stylecountrylabel = [styletext, countryStyle];

//localgeojson
//style

let image1 = new CircleStyle({
    radius: 6,
    fill: new Fill({
        color: 'rgba(145, 50, 255, 0.5)'
    }),

    stroke: new Stroke({
        color: 'rgba(145, 50, 255, 0.5)',
        width: 1
    })

});

let styles = {

    'Point': new Style({
        image: image1
    }),

    fill: new Fill({
        color: 'rgba(145, 50, 255, 0.5)'
    })

};
let styleFunction = function (feature) {
    return styles[feature.getGeometry().getType()];
};



//geojson

let geojsonObject = {

    'type': 'FeatureCollection',

    'crs': { 'type': 'name', 'properties': { 'name': 'EPSG:4326' } },

    'features': [
        { 'type': 'Feature', 'properties': { 'name': 'Sarzeau, Franța', 'linkx': "<a href= 'https://en.wikipedia.org/wiki/Sarzeau'</a>", 'flag': "<center><img src=https://findicons.com/files/icons/282/flags/48/france.png><center>" }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([-2.768477, 47.527715]) } },

        { 'type': 'Feature', 'properties': { 'name': ' Louargat, Franța', 'linkx': "<a href='https://en.wikipedia.org/wiki/Louargat'</a>", 'flag': "<center><img src=https://findicons.com/files/icons/282/flags/48/france.png><center>" }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([-3.473566, 48.611386]) } },

        { 'type': 'Feature', 'properties': { 'name': 'Saint-Firmin-des-Prés, Franţa', 'linkx': "<a href='https://en.wikipedia.org/wiki/Saint-Firmin-des-Pr%C3%A9s'</a>", 'flag': "<center><img src=https://findicons.com/files/icons/282/flags/48/france.png><center>" }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([1.065347, 47.792556]) } },

        { 'type': 'Feature', 'properties': { 'name': 'Wahlbach, Franța', 'linkx': "<a href='https://en.wikipedia.org/wiki/Wahlbach,_Haut-Rhin</a>", 'flag': "<center><img src=https://findicons.com/files/icons/282/flags/48/france.png><center>" }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([7.305065, 47.553403]) } },

        { 'type': 'Feature', 'properties': { 'name': 'Coye-la-Foret, Franța', 'linkx': "<a href='https://en.wikipedia.org/wiki/Louvre'</a>", 'flag': "<center><img src=https://findicons.com/files/icons/282/flags/48/france.png><center>" }, 'geometry': { 'type': 'Point', 'coordinates': fromLonLat([2.46776, 49.14392]) } },

    ]

};


//layer

let vectorSource = new VectorSource({
    features: (new GeoJSON()).readFeatures(geojsonObject)

});

let localgeojson = new VectorLayer({
    title: 'Local Geojson',
    source: vectorSource,
    visible: true,
    style: styleFunction,
    declutter: true
});

//Afisare
const map = new Map({
    target: 'map',
    overlays: [overlay],
    layers: [
        new LayerGroup({
            'title': 'Base maps',
            layers: [arcgis, graticule]
        }),
        new LayerGroup({
            title: 'Overlay WFS',
            layers: [vector4wfs, localgeojson],
        }),
    ],

    view: new View({
        projection: 'EPSG:3857',
        center: transform([12.5359979, 41.9100711], 'EPSG:4326', 'EPSG:3857'),

        zoom: 5
    }),
    controls: defaultControls({ attribution: false }).extend([
        new ZoomSlider(),

        new ZoomToExtent({
            extent: transform([11847730.116737, 1749516.199121,
                13119643.648371, 854286.622203], 'EPSG:3857', 'EPSG:4326')
        }),

        new ScaleLine({ units: 'metric' }),

        new FullScreen(),
        attribution
    ])
});
let layerSwitcher = new LayerSwitcher();
map.addControl(layerSwitcher);



/**
 * Add a click handler to the map to render the popup.
 */

map.on('singleclick', function (evt) {
    if (map.hasFeatureAtPixel(evt.pixel) === true) {
        let coordinate = evt.coordinate;
        let hdms = toStringHDMS(toLonLat(coordinate));
        let feature = map.getFeaturesAtPixel(evt.pixel)[0];
        let continut = feature.get('name');
        let continut1 = feature.get('linkx');
        let continut2 = feature.get('flag');
        let continut3 = feature.get('linkx');
        content.innerHTML = '<b>Bună ziua!</b><br><center><img src' + continut2 + '<br>Această locație este: ' + continut + '<code><br>(' + hdms + ')</code>';
        overlay.setPosition(coordinate);
    } else {
        overlay.setPosition(undefined);
        closer.blur();

    }
});


map.on('pointermove', function (evt) {
    if (map.hasFeatureAtPixel(evt.pixel)) {
        map.getViewport().style.cursor = 'pointer';
    } else {
        map.getViewport().style.cursor = 'inherit';

    }

});