
// ATTRIBUTIONS:
//  Used the Google Maps API course materials for function examples and inspiration.
//  Used code ideas for filtering the list at https://codepen.io/blakewatson/pen/ZQXNmK.


// Initializes the map locations.
var initLocations = [
  {category: 'groomer', title: 'Wizard of Paws', position: {lat: 37.876001, lng: -122.300502}},
  {category: 'groomer', title: 'Tails A Go-Go', position: {lat: 37.890157, lng: -122.297627}},
  {category: 'groomer', title: 'Kutz For Mutz', position: {lat: 37.889388, lng: -122.298894}},
  {category: 'groomer', title: 'Dogs Best Friend & The Cats Meow', position: {lat: 37.896172, lng: -122.300565}},
  {category: 'groomer', title: 'Mudpuppys', position: {lat: 37.89906, lng: -122.323997}},
  {category: 'park', title: 'Ohlone Doggy Park', position: {lat: 37.873013, lng: -122.275446}},
  {category: 'park', title: 'Cesar E. Chavez Park', position: {lat: 37.869658, lng: -122.31949}},
  {category: 'park', title: 'Point Isabel Dog Park', position: {lat: 37.900929, lng: -122.324709}},
  {category: 'store', title: 'Holistic Hound', position: {lat: 37.879906, lng: -122.268456}},
  {category: 'store', title: 'Your Basic Bird', position: {lat: 37.857557, lng: -122.253388}},
  {category: 'store', title: 'Pet Food Express', position: {lat: 37.8694, lng: -122.291979}},
  {category: 'store', title: 'Alpha Pet Supply', position: {lat: 37.888288, lng: -122.298632}},
  {category: 'store', title: 'Paco Collars', position: {lat: 37.856434, lng: -122.266362}}
];

// Creates the 'Location' object to build the location list, including list and marker elements.
var Location = function(data) {
  this.title = ko.observable(data.title);
  this.position = ko.observable(data.position);
  this.category = ko.observable(data.category);
  this.marker = data.marker;
};

// Inititalizes the background map, called from the src on index.html. Initiates the ViewModel.
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.879789, lng: -122.289945},
    zoom: 13,
    mapTypeControl: false
  });

  ko.applyBindings(new ViewModel());

};


var ViewModel = function() {

  var self = this;

  // Initiates the locationList (including list and marker data) by pushing locations
  // through the Location object.
  this.locationList = ko.observableArray([]);

  // Initializes the infoWindow.
  var infoWindow = new google.maps.InfoWindow();

  // Creates the default marker.
  var defaultIcon = makeMarkerIcon('FF3F33');

  // Creates the selected location marker.
  var selectedIcon = makeMarkerIcon('33FF49');

  initLocations.forEach(function(locationItem){
    var marker = new google.maps.Marker({
      position: locationItem.position,
      title: locationItem.title,
      icon: defaultIcon,
      map: map
    });
    locationItem.marker = marker;
    locationItem.marker.addListener('click', function() {
      setMarkersDefault();
      populateInfoWindow(this, infoWindow);
    });
    self.locationList.push(new Location(locationItem));
  });

  // Initializes the currentLocation binding purposes.
  this.currentLocation = ko.observable(this.locationList()[0]);

  // Builds filtered lists and markers based on user input.
  self.selectedCategory = ko.observable('all');

  self.filteredLocations = ko.computed(function() {
    var selectedCategory = self.selectedCategory().toLowerCase();

    // If the 'All' category is selected, shows all listings and markers.
    if (selectedCategory === 'all') {
      self.locationList().forEach(function(location) {
        if (location.marker) {
          location.marker.setVisible(true);
        }
      });
      return self.locationList();
    }

    // Else if a category is selected, filters the list and markers.
    return ko.utils.arrayFilter(self.locationList(), function(location) {
      var category = location.category().toLowerCase();
      var match = category === selectedCategory; // true or false
      // toggle marker visibility
      self.locationList().forEach(function(location) {
        if (location.category() === selectedCategory) {
          location.marker.setVisible(true);
        } else {
          location.marker.setVisible(false);
        }
      })
      return match;
    });
  });


  // Creates markers, passing in a color to toggle between active and inactive markers.
  function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
      'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
      '|40|_|%E2%80%A2',
      new google.maps.Size(21, 34),
      new google.maps.Point(0, 0),
      new google.maps.Point(10, 34),
      new google.maps.Size(21,34));
    return markerImage;
  }

  function setMarkersDefault() {
    self.locationList().forEach(function(locationItem) {
      locationItem.marker.setIcon(defaultIcon);
    });
  };

  // Populates the infoWindow with location content.
  function populateInfoWindow(marker, infowindow) {

    if (infowindow.marker != marker) {
         // Clear the infowindow content to give the streetview time to load.
         infowindow.setContent('');
         infowindow.marker = marker;
         // Make sure the marker property is cleared if the infowindow is closed.
         infowindow.addListener('closeclick', function() {
             marker.setIcon(defaultIcon);
         });
     }

    marker.setIcon(selectedIcon);
    infowindow.setContent('<div>' + marker.title + '</div><div></div>');
    infowindow.open(map, marker);
  };

  // Connects the selected location from the list to it's marker.
  this.currentLocation = function(location) {
    google.maps.event.trigger(this.marker, 'click');
  };




};
