// arrays to hold copies of the markers and html used by the side-bar 
// because the function closure trick doesnt work there 
var map;
var largeInfowindow;
var bounds;
var previous_marker=null;

function initializeMap() {

  var styles = [{
    featureType: 'water',
    stylers: [{
      color: '#19a0d8'
    }]
  }, {
    featureType: 'administrative',
    elementType: 'labels.text.stroke',
    stylers: [{
        color: '#ffffff'
      },
      {
        weight: 6
      }
    ]
  }, {
    featureType: 'administrative',
    elementType: 'labels.text.fill',
    stylers: [{
      color: '#e85113'
    }]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{
        color: '#efe9e4'
      },
      {
        lightness: -40
      }
    ]
  }, {
    featureType: 'transit.station',
    stylers: [{
        weight: 9
      },
      {
        hue: '#e85113'
      }
    ]
  }, {
    featureType: 'road.highway',
    elementType: 'labels.icon',
    stylers: [{
      visibility: 'off'
    }]
  }, {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{
      lightness: 100
    }]
  }, {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{
      lightness: -100
    }]
  }, {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{
        visibility: 'on'
      },
      {
        color: '#f0e4d3'
      }
    ]
  }, {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{
        color: '#efe9e4'
      },
      {
        lightness: -25
      }
    ]
  }];
  // create the map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 16.499725,
      lng: 80.656067
    },
    zoom: 13,
    styles: styles,
    mapTypeControl: false
  });


  google.maps.event.addListener(map, 'click', function () {
    largeInfowindow.close();
    previous_marker.setAnimation(null);
  });

  // These are the real estate listings that will be shown to the user.
  // Normally we'd have these in a database instead.


  largeInfowindow = new google.maps.InfoWindow();
  bounds = new google.maps.LatLngBounds();
  // The following group uses the location array to create an array of markers on initialize.
  viewModel.locations().forEach(function (loc, index) {
    // Get the position from the location array.
    var position = loc.location;
    var title = loc.title;
    // Create a marker per location, and put into markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      id: index
    });
    // Push the marker to our array of markers.
    viewModel.markers.push(marker);
    // Two event listeners - one for mouseover, one for mouseout,
    // to change the colors back and forth.
    // marker.addListener('mouseover', function () {
    //   toggleBounce(this);
    // });
    marker.addListener('click', function () {
      toggleBounce(this);
    });
    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function () {
      populateInfoWindow(this, largeInfowindow);
    });
    // marker.addListener('click',function(){
    //   toggleBounce(this);
    // });
    bounds.extend(viewModel.markers()[index].position);
  });
  // Extend the boundaries of the map for each marker
  map.fitBounds(bounds);

}
//This function gives the functionality of animation when marker clicked

function toggleBounce(marker) {

	if(previous_marker!==null)
	{
		previous_marker.setAnimation(null);
	}
	if (marker.getAnimation() !== null) {
	    marker.setAnimation(null);
	  } else {
	    marker.setAnimation(google.maps.Animation.BOUNCE);
	  }
	 previous_marker=marker;
  
}
// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.marker = marker;
    //Openweather API(3rd party API for giving weather ddetails)
    var temperature;
    var temperature_max;
    var temperature_min;
    var humidity;
    var url = 'http://api.openweathermap.org/data/2.5/weather?q=' + marker.title + '&units=metric&APPID=ca00000c0c61350764e15f346d45c593';
    $.ajax({
      url: url,
      dataType: "jsonp",
    }).done(function (response) {
      temperature = response.main.temp;
      temperature_max = response.main.temp_max;
      temperature_min = response.main.temp_min;
      humidity = response.main.humidity;
      infowindow.setContent('<div><h3>' + marker.title + '</h3><h6>Temperature : ' + temperature + ' Celsius</h6><h6>Temperature Max: ' + temperature_max + ' Celsius</h6><h6>Temperature Min: ' + temperature_min + ' Celsius</h6><h6>Humidity : ' + humidity + ' %</h6></div>');
    }).fail(function (error) {
      infowindow.setContent('<div><h3>' + marker.title + '</h3><span>Cannot get weather information</span></div>');
    });
    map.fitBounds(bounds);

    infowindow.open(map, marker);
    // Make sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function () {
      infowindow.setMarker = null;
    });
  }
}

function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21, 34));
  return markerImage;
}

// This function picks up the click and opens the corresponding info window

//Model
function Model() {
  this.locations = [{
      title: 'Benz Circle',
      location: {
        lat: 16.499725,
        lng: 80.656067
      }
    },
    {
      title: 'Bus Stand',
      location: {
        lat: 16.5092498,
        lng: 80.61750189999998
      }
    },
    {
      title: 'Machilipatnam',
      location: {
        lat: 16.1788995,
        lng: 81.13188519999994
      }
    },
    {
      title: 'Gudiwada',
      location: {
        lat: 16.4302937,
        lng: 80.98830470000007
      }
    },
    {
      title: 'Airport',
      location: {
        lat: 16.523838,
        lng: 80.79141720000007
      }
    },
    {
      title: 'Hanuman Junction',
      location: {
        lat: 16.6385059,
        lng: 80.97052919999999
      }
    },
    {
      title: 'Hyderabad',
      location: {
        lat: 17.387140,
        lng: 78.491684
      }
    },
    {
      title: 'Vuyyuru',
      location: {
        lat: 16.367497,
        lng: 80.843539
      }
    },
    {
      title: 'Nuzvid IIIT Campus',
      location: {
        lat: 16.793202,
        lng: 80.824168
      }
    },
    {
      title: 'Mylavaram',
      location: {
        lat: 16.763826,
        lng: 80.638241
      }
    },
    {
      title: 'Eluru',
      location: {
        lat: 16.7106604,
        lng: 81.09524310000006
      }
    },
    {
      title: 'Pamarru',
      location: {
        lat: 16.322985,
        lng: 80.961208
      }
    },
    {
      title: 'Karl Marx Road',
      location: {
        lat: 16.5182435,
        lng: 80.64842959999999
      }
    },
    {
      title: 'Guntur',
      location: {
        lat: 16.3066525,
        lng: 80.43654019999997
      }
    }
  ];
  this.markers = [];

}
var model = new Model();
//ViewModel
function ViewModel(model) {
  var self = this;
  self.locations = ko.observableArray(model.locations);
  self.markers = ko.observableArray(model.markers);
  self.query = ko.observable(''); //make the query string as observable
  // to open the infoWindow of marker when clicked in listview
  self.listMarkerAnimateAndClick = function (marker) {
  	toggleBounce(marker);
    populateInfoWindow(marker, largeInfowindow);
  };
  // self.listItemMouseOut = function (marker) {
  //   toggleBounce(this);
  // };
  //filter the items using the filter text
  self.filteredItem = ko.computed(function () {
    var query = this.query().toLowerCase();
    if (!query) {
      self.markers().forEach(function (marker) {
        marker.setVisible(true);
        bounds.extend(marker.position);
      });
      return self.markers();
    } else {
      var filteredMarkers = self.markers();
      return filteredMarkers.filter(function (marker) {
        var markerName = marker.title;
        console.log(markerName);
        var bool = markerName.toLowerCase().indexOf(query) > -1;
        console.log(bool);
        marker.setVisible(bool);
        return bool;
      });
    }
  }, self);

}
var viewModel = new ViewModel(model);

function googleError() {
  alert('The map could not be loaded.');
}
$(document).ready(function () {
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
    $("#map").toggleClass('map-full');
  });
  ko.applyBindings(new ViewModel(model));
});