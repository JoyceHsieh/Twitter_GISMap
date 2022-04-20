// Use the D3 library to read in samples.json.


//Read the url input the data into State drop down select tag
url="https://s3.us-west-2.amazonaws.com/gis.api.test/gisapi_test.json"




d3.json(url).then(function createPlotly(data) {
    console.log(data);
    



    // Emontion Dropdown menu
    var dropdownMenu = d3.select("#emontion");
    var dropdownValue = dropdownMenu.property("value");
    


  //Cmap
    var myMap = L.map("myCMap", {
      center: [36.7782, -119.4179],
      zoom: 5
    });

    // Adding the tile layer and initial marker set
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);

    //Hmap
    var myHeatMap = L.map("myHMap", {
      center: [36.7782, -119.4179],
      zoom: 5
    });


    // Adding the tile layer and initial marker set
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myHeatMap);


    
    var markersLayer = new L.LayerGroup();
    markersLayer.clearLayers()
    mapping(dropdownValue)
    updateheatmap(emontion)
    updateMap()

    function updateMap() {
      emontion_dropdown = d3.select("#emontion");
      emontion = emontion_dropdown.property("value");
      console.log(emontion);
      
      
      markersLayer.clearLayers();
      // updateview(emontion);
      mapping(emontion)
      updateheatmap(emontion)
    
    
    }

    // function updateview(emontion){

    //   var center_cord = [39.8283, -98.5795];
    //   var zoom_num = 4;

    //   for (var i = 0; i < data.length; i++) {
    //     var location = data[i].properties;
    //     var data_emotion = location.Emotion;
    //     var data_location_lat = location.lat;
    //     var data_location_lon = location.lon;
        
    //     if(data_emotion==emontion)
    //     {
    //       markers.addLayer(L.marker([data_location_lat, data_location_lon]));
    //     }


    //   };
    //   // myMap.setZoom(zoom_num);
    //   // myMap.flyTo(center_cord,zoom_num);
    //   console.log(center_cord);
      
    //   };
      //create a function that maps the markers
        function mapping(emontion)
        {

          d3.json(url).then(function(response) {

          // Create a new marker cluster group.
          var markers = L.markerClusterGroup();
          

          // Loop through the data.
          for (var i = 0; i < response.length; i++) {

            var created = response[i].properties.created
            var Polarity = response[i].properties.Polarity
            var Emontion = response[i].properties.Emotion
            var Cognition = response[i].properties.Cognition;
            var twitter = response[i].properties.text;
            // Set the data location property to a variable.

            if (response[i].properties.Emotion==emontion)
            {
              var latitude = response[i].properties.lat;
              var longitude = response[i].properties.lon;

              var popuplist = "Date: " + created 
              + "</br> Polarity: " + Polarity
              + "</br> Emontion: " + Emontion
              + "</br> Cognition: " + Cognition
              + "</br> Teittwe: " + twitter;

              

              // Check for the location property.
              if (latitude) {
              // Add a new marker to the cluster group, and bind a popup.
              markers.addLayer(L.marker([latitude, longitude]).bindPopup(popuplist));
              }
              
            }  /// end if 

            else if(emontion == "all"){
              
              var latitude = response[i].properties.lat;
              var longitude = response[i].properties.lon;

              var popuplist = "Date: " + created 
              + "</br> Polarity: " + Polarity
              + "</br> Emontion: " + Emontion
              + "</br> Cognition: " + Cognition
              + "</br> Teittwe: " + twitter;

              // Check for the location property.
              if (latitude) {
              // Add a new marker to the cluster group, and bind a popup.
              markers.addLayer(L.marker([latitude, longitude]).bindPopup(popuplist));
              }
            }  /// end else if 

          }  /// end for loop

        // Add our marker cluster layer to the map.
        markersLayer = markers

        myMap.addLayer(markersLayer);
        });  /// end d3

        }  // end function


       // HeatMap
        function updateheatmap(emontion){

          var heatArray=[]

          for (var i = 0; i < data.length; i++) {
          var location = data[i].properties;
          var data_emotion = location.Emotion;

          if (data_emotion==emontion) {
            heatArray.push([location.lat, location.lon]);
          }

          else if(emontion == "all"){
            heatArray.push([location.lat, location.lon]);
          }

          
        }

        var heat = L.heatLayer(heatArray, {
          radius: 35,
          blur: 15, 
          maxZoom: 10,
          max: 4.0,

          gradient: {
              0.0:'green',
              0.3: 'blue',
              0.7: 'yellow',
              1.0: 'red'
          }

          }).addTo(myHeatMap);
          
          };

    
    // When different test ID is selected, call an function optionChanged
   d3.select("#emontion").on("change", optionChanged);
  
    function optionChanged() {
     console.log("Different emontion was selected.");
     var dropdownMenu = d3.select("#emontion");
     var dropdownValue = dropdownMenu.property("value");
     console.log(`Currently emontion ${dropdownValue} is shown on the page`);

     // Update graph
     myMap.off();
     myMap.remove();
     myHeatMap.off();
     myHeatMap.remove();
     createPlotly(data);
    
   }




  })







    

    

    

    
    


 
   