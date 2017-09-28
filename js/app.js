
// ATTRIBUTIONS:
//  Used the Google Maps API to generate the map and markers.
//  Used the Foursquare API to render user/checkin information.
//  Used the Google Maps API course materials for function examples and inspiration.
//  Used code ideas for filtering the list at https://codepen.io/blakewatson/pen/ZQXNmK.
//  Used styling ideas for the location list at https://designshack.net/articles/css/5-simple-and-practical-css-list-styles-you-can-copy-and-paste/.


// Initializes the map locations.
var initLocations = [
  {category: 'groomer', title: 'Wizard of Paws', position: {lat: 37.876001, lng: -122.300502}, fsID: '4f16f853e4b09e81de268500'},
  {category: 'groomer', title: 'Tails A Go-Go', position: {lat: 37.890157, lng: -122.297627}, fsID: '51382c3fe4b0d152d7bf70e8'},
  {category: 'groomer', title: 'Kutz For Mutz', position: {lat: 37.889388, lng: -122.298894}, fsID: '4e42aee8d1645b30b56d8efb'},
  {category: 'groomer', title: 'Dogs Best Friend', position: {lat: 37.896172, lng: -122.300565}, fsID: '4bec78d949430f47f4c407d2'},
  {category: 'groomer', title: 'Mudpuppys', position: {lat: 37.89906, lng: -122.323997}, fsID: '4bc8963592b376b0cfb2513a'},
  {category: 'park', title: 'Ohlone Doggy Park', position: {lat: 37.873013, lng: -122.275446}, fsID: '4bdddf1de75c0f47e5f1c503'},
  {category: 'park', title: 'Cesar E. Chavez Park', position: {lat: 37.869658, lng: -122.31949}, fsID: '4a6a929ef964a520bfcd1fe3'},
  {category: 'park', title: 'Point Isabel Dog Park', position: {lat: 37.900929, lng: -122.324709}, fsID: '4ea9facb775bf085695fabec'},
  {category: 'store', title: 'Holistic Hound', position: {lat: 37.879906, lng: -122.268456}, fsID: '4ae343d0f964a520909221e3'},
  {category: 'store', title: 'Your Basic Bird', position: {lat: 37.857557, lng: -122.253388}, fsID: '4bc69101424195211372041d'},
  {category: 'store', title: 'Pet Food Express', position: {lat: 37.8694, lng: -122.291979}, fsID: '4aff64f8f964a520263822e3'},
  {category: 'store', title: 'Alpha Pet Supply', position: {lat: 37.888288, lng: -122.298632}, fsID: '4b58a575f964a520756328e3'},
  {category: 'store', title: 'Paco Collars', position: {lat: 37.856434, lng: -122.266362}, fsID: '4b50ca10f964a5209d3227e3'}
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

function googleError() {
  alert("Sorry, Google Maps cannot load at this time.")
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
      id: locationItem.fsID,
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
          infoWindow.close();
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

    // Gets data from Foursquare API and inserts it into the infowindow.
    var clientID = 'P3XBPSRBVEWY2NESJ3BKZ2WOEARQ3G5QR2WUZGTRZ5IXHDEV';
    var clientSecret = 'INTGRR5EJR05A4AUDKUK51AL0P5XFPUXBL5K2SMAYERRZNOU';
    var version = '20170101';
    var venueID = marker.id;
    var foursquareURL = 'https://api.foursquare.com/v2/venues/' + venueID + '?client_id=' +
    clientID + '&client_secret=' + clientSecret + '&v=' + version;

    $.getJSON(foursquareURL, function(data){
      var userCount = data.response.venue.stats.usersCount;
      var checkinCount = data.response.venue.stats.checkinsCount;
      var fsUrl = data.response.venue.canonicalUrl;

      marker.setIcon(selectedIcon);
      infowindow.setContent('<div id="markerTitle">' + marker.title + '</div><br><div>On Foursquare, <strong>' +
       userCount + '</strong> users have checked in <strong>' + checkinCount +
       '</strong> times.</div><br><div><a href="' + fsUrl + '" target="_blank">Visit this place on Foursquare</a></div>');
      infowindow.open(map, marker);

    }).fail(function() {alert('Sorry, we could not access Foursquare!');});

  };

  // Connects the selected location from the list to its marker.
  this.currentLocation = function(location) {
    google.maps.event.trigger(this.marker, 'click');
  };

};
