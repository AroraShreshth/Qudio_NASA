/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Illustrates how to consume imagery from a Web Map Service (WMS).
 */
requirejs(['./WorldWindShim',
    './LayerManager'],
    function (WorldWind,
        LayerManager) {
        "use strict";

        // Tell WorldWind to log only warnings and errors.
        WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);

        // Create the WorldWindow.
        var wwd = new WorldWind.WorldWindow("canvasOne");

        // Create and add layers to the WorldWindow.
        var layers = [
            // Imagery layers.
            { layer: new WorldWind.BMNGLayer(), enabled: true },
            { layer: new WorldWind.BMNGLandsatLayer(), enabled: false },
            { layer: new WorldWind.BingAerialLayer(null), enabled: false },
            { layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: false },
            { layer: new WorldWind.BingRoadsLayer(null), enabled: false },
            // Add atmosphere layer on top of all base layers.
            { layer: new WorldWind.AtmosphereLayer(), enabled: true },
            // WorldWindow UI layers.
            { layer: new WorldWind.CompassLayer(), enabled: true },
            { layer: new WorldWind.CoordinatesDisplayLayer(wwd), enabled: true },
            { layer: new WorldWind.ViewControlsLayer(wwd), enabled: true }
        ];

        for (var l = 0; l < layers.length; l++) {
            layers[l].layer.enabled = layers[l].enabled;
            wwd.addLayer(layers[l].layer);

        }



        // Web Map Service information from NASA's Near Earth Observations WMS
        var serviceAddress = "https://neo.sci.gsfc.nasa.gov/wms/wms?SERVICE=WMS&REQUEST=GetCapabilities&VERSION=1.3.0";
        // Named layer displaying Average Temperature data
        var layerName = "MOD_LSTD_CLIM_M";


        var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
        wwd.addLayer(placemarkLayer);


        var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);


        //p1
        var data_ftd;
        var i;
        //var jsondata;
        fetch('https://api.nasa.gov/DONKI/CMEAnalysis?startDate=2015-09-01&endDate=2019-09-30&mostAccurateOnly=true&speed=500&halfAngle=30&catalog=ALL&api_key=LNiCCHc70tKPv1ht4MxDgcMWdrhEWs1WmhcEwLNh')
            .then(res => res.json())
            .then((out) => {
                // function v(json) {
                //     jsondata = json;
                // }
                console.log('Output: ', out[3].latitude);
                //var data_ftd = out;
                //var wwd = new WorldWind.WorldWindow("canvasOne");
                for (i = 0; i < 220; i++) {


                    var placemarkLayer = new WorldWind.RenderableLayer("Placemark");
                    wwd.addLayer(placemarkLayer);

                    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

                    placemarkAttributes.imageOffset = new WorldWind.Offset(
                        WorldWind.OFFSET_FRACTION, 0.3,
                        WorldWind.OFFSET_FRACTION, 0.0);

                    placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
                    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
                        WorldWind.OFFSET_FRACTION, 0.5,
                        WorldWind.OFFSET_FRACTION, 1.0);
                    placemarkAttributes.imageSource = "./images/rec.png";
                    var position = new WorldWind.Position(out[i].latitude, out[i].longitude, 100.0);
                    var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
                    placemark.label = out[i].type + "\n" +
                        (out[i].speed / 2) / 10;
                    placemark.alwaysOnTop = true;
                    placemarkLayer.addRenderable(placemark);


                    var polygonLayer = new WorldWind.RenderableLayer();
                    wwd.addLayer(polygonLayer);

                    var polygonAttributes = new WorldWind.ShapeAttributes(null);
                    polygonAttributes.interiorColor = new WorldWind.Color(0, 1, 1, 0.75);
                    polygonAttributes.outlineColor = WorldWind.Color.BLUE;
                    polygonAttributes.drawOutline = true;
                    polygonAttributes.applyLighting = true;

                    var boundaries = [];
                    boundaries.push(new WorldWind.Position(out[i].latitude + 1, out[i].longitude + 1, out[i].speed * 1000));
                    boundaries.push(new WorldWind.Position(out[i].latitude - 1, out[i].longitude - 1, out[i].speed * 1000));
                    boundaries.push(new WorldWind.Position(out[i].latitude + 1, out[i].longitude - 1, out[i].speed * 1000));
                    boundaries.push(new WorldWind.Position(out[i].latitude - 1, out[i].longitude + 1, out[i].speed * 1000));
                    boundaries.push(new WorldWind.Position(out[i].latitude + 1, out[i].longitude, out[i].speed * 1000));
                    boundaries.push(new WorldWind.Position(out[i].latitude - 1, out[i].longitude, out[i].speed * 1000));



                    var polygon = new WorldWind.Polygon(boundaries, polygonAttributes);
                    polygon.extrude = true;
                    polygonLayer.addRenderable(polygon);



                }


            }).catch(err => console.error(err));



        //c1


        //check2


        // Called asynchronously to parse and create the WMS layer
        var createLayer = function (xmlDom) {
            // Create a WmsCapabilities object from the XML DOM
            var wms = new WorldWind.WmsCapabilities(xmlDom);
            // Retrieve a WmsLayerCapabilities object by the desired layer name
            var wmsLayerCapabilities = wms.getNamedLayer(layerName);
            // Form a configuration object from the WmsLayerCapability object
            var wmsConfig = WorldWind.WmsLayer.formLayerConfiguration(wmsLayerCapabilities);
            // Modify the configuration objects title property to a more user friendly title
            wmsConfig.title = "Average Surface Temp";
            // Create the WMS Layer from the configuration object
            var wmsLayer = new WorldWind.WmsLayer(wmsConfig);

            // Add the layers to WorldWind and update the layer manager
            wwd.addLayer(wmsLayer);
            layerManager.synchronizeLayerList();
        };




        // Called if an error occurs during WMS Capabilities document retrieval
        var logError = function (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " + text + " exception: " + exception);
        };

        $.get(serviceAddress).done(createLayer).fail(logError);

        // Create a layer manager for controlling layer visibility.
        var layerManager = new LayerManager(wwd);
        // Generate 10000 random points to display on the HeatMap with varying intensity over the area of the whole world.
        var locations = [];

        for (var ii = 0; ii < 10; ii++) {
            locations.push(
                new WorldWind.MeasuredLocation(
                    -89 + (179 * Math.random()),
                    -179 + (359 * Math.random()),
                    Math.ceil(100 * Math.random())
                )
            );
        }

        // Add new HeatMap Layer with the points as the data source.
        wwd.addLayer(new WorldWind.HeatMapLayer("HeatMap", locations));
    });