// Use the D3 library to read in samples.json.
//Read the url input the data into State drop down select tag
url="https://s3.us-west-2.amazonaws.com/gis.api.test/gisapi_test.json"
url2="https://s3.us-west-2.amazonaws.com/gis.api.test/sd_event_api.json"
url3 = "https://s3.us-west-2.amazonaws.com/gis.api.test/twitter_json_data.json"

d3.json(url).then(function createMap(data) {
    console.log(data);

    // Emontion Dropdown menu
    var dropdownMenu = d3.select("#emontion");
    var dropdownValue = dropdownMenu.property("value");

    var dropdownMenu_p = d3.select("#polarity");
    var dropdownValue_p = dropdownMenu_p.property("value");

    //ClusterMap selection
    var myClusterMap = L.map("myCMap", {
        center: [36.7782, -119.4179],
        zoom: 5
      });
      // Adding the tile layer and initial marker set
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myClusterMap);

    // //Hmap
    // var myHeatMap = L.map("myHMap", {
    //     center: [36.7782, -119.4179],
    //     zoom: 5
    //   });

    // // Adding the tile layer and initial marker set
    // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    //     attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    // }).addTo(myHeatMap);


    // ClusterMap Markers
    var markersLayer = new L.LayerGroup();
    // markersLayer.clearLayers()
    mapping(dropdownValue)
    updateMap()

    function updateMap(){
        emontion_dropdown = d3.select("#emontion");
        emontion = emontion_dropdown.property("value");
        console.log(emontion);

        polarity_dropdown = d3.select("#polarity");
        polarity = polarity_dropdown.property("value");
        console.log(polarity);

        
        mapping(emontion, polarity)
        // updateheatmap(emontion)
    }

    function mapping(emontion, polarity){
        d3.json(url).then(function(response) {
        
            // Create a new marker cluster group.
            var markers = L.markerClusterGroup({
                chunkedLoading: true,
                //singleMarkerMode: true,
                spiderfyOnMaxZoom: false
            });
            var markerList = [];

            // Loop through the data.
            for(var i =0; i < response.length; i++){
                
                var created = response[i].properties.created
                var Polarity = response[i].properties.Polarity
                var Emontion = response[i].properties.Emotion
                var Cognition = response[i].properties.Cognition;
                var twitter = response[i].properties.text;
                // Set the data location property to a variable.

                if (response[i].properties.Emotion==emontion && response[i].properties.Polarity==polarity){

                    var latitude = response[i].properties.lat;
                    var longitude = response[i].properties.lon;
                    var popuplist = "<p style='color:black;'>Date: " + created 
                        + "</br> Polarity: " + Polarity
                        + "</br> Emontion: " + Emontion
                        + "</br> Cognition: " + Cognition
                        + "</br> Teittwe: " + twitter + "</p>";
                        // Check for the location property.
                        if (latitude) {
                        // Add a new marker to the cluster group, and bind a popup.
                        markers.addLayer(L.marker([latitude, longitude]).bindPopup(popuplist));
                        }

                }  /// end if

                else if(emontion == "all" && polarity == "all"){
                    var latitude = response[i].properties.lat;
                    var longitude = response[i].properties.lon;

                    var popuplist = "<p style='color:black;'>Date: " + created 
                    + "</br> Polarity: " + Polarity
                    + "</br> Emontion: " + Emontion
                    + "</br> Cognition: " + Cognition
                    + "</br> Teittwe: " + twitter + "</p>";

                    // Check for the location property.
                    if (latitude) {
                    // Add a new marker to the cluster group, and bind a popup.
                    markers.addLayer(L.marker([latitude, longitude]).bindPopup(popuplist));
                    }
                }  // end else if 
            }   /// end for loop

            // Add our marker cluster layer to the map.
            markersLayer = markers

            myClusterMap.addLayer(markersLayer);



        }) /// end d3
    } /// end mapping function
    

    // HeatMap
    // function updateheatmap(emontion){
    //     var heatArray=[]
    //     for (var i = 0; i < data.length; i++) {
    //         var location = data[i].properties;
    //         var data_emotion = location.Emotion;

    //         if (data_emotion==emontion) {
    //             heatArray.push([location.lat, location.lon]);
    //           } // end if 
    //         else if(emontion == "all"){
    //         heatArray.push([location.lat, location.lon]);
    //         }// end else if 

    //     } /// end for loop

    //     var heat = L.heatLayer(heatArray, {
    //         radius: 35,
    //         blur: 15, 
    //         maxZoom: 10,
    //         max: 4.0,
  
    //         gradient: {
    //             0.0:'green',
    //             0.3: 'blue',
    //             0.7: 'yellow',
    //             1.0: 'red'
    //         }
  
    //         }).addTo(myHeatMap);

    // } /// end updateheatmapfunction

    // When different test ID is selected, call an function optionChanged
   d3.select("#emontion").on("change", optionChanged);
  
   function optionChanged() {
    console.log("Different emontion was selected.");
    var dropdownMenu = d3.select("#emontion");
    var dropdownValue = dropdownMenu.property("value");
    console.log(`Currently emontion ${dropdownValue} is shown on the page`);

    // Update graph
    myClusterMap.off();
    myClusterMap.remove();
    // myHeatMap.off();
    // myHeatMap.remove();
    createMap(data);
   
  }

  d3.select("#polarity").on("change", optionChanged);
  
   function optionChanged() {
    console.log("Different polarity was selected.");
    var dropdownMenu_p = d3.select("#polarity");
    var dropdownValue_p = dropdownMenu_p.property("value");
    console.log(`Currently polarity ${dropdownValue} is shown on the page`);

    // Update graph
    myClusterMap.off();
    myClusterMap.remove();
    // myHeatMap.off();
    // myHeatMap.remove();
    createMap(data);
   
  }



})