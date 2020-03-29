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
        var wwd = new WorldWind.WorldWindow("canvasOne");
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
            placemarkAttributes.imageSource = "https://geoview-lasvegasnevada-gov.appspot.com/static/img/map_icons/yellowDotBlackOutline.png";
            var position = new WorldWind.Position(out[i].latitude, out[i].longitude, 100.0);
            var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);
            placemark.label = out[i].type + "\n" +
                "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
                "Lon " + placemark.position.longitude.toPrecision(5).toString();
            placemark.alwaysOnTop = true;
            placemarkLayer.addRenderable(placemark);



        }


    }).catch(err => console.error(err));





