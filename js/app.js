
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
    zoom: 14,
    mapTypeControl: false
  });

  ko.applyBindings(new ViewModel());

};


var ViewModel = function() {

  var self = this;

  // Initiates the locationList (including list and marker data) by pushing locations
  // through the Location object.
  this.locationList = ko.observableArray([]);

  initLocations.forEach(function(locationItem){
    var marker = new google.maps.Marker({
      position: locationItem.position,
      title: locationItem.title,
      map: map
    });
    locationItem.marker = marker;
    self.locationList.push(new Location(locationItem));
  });

  // this.currentLocation = ko.observable(this.locationList()[0]); // Need this?

  // Builds filtered lists and markers based on user input.
  self.selectedCategory = ko.observable('all');

  self.filteredLocations = ko.computed(function() {
    self.locationList().forEach(function(filterItem){
      var category = self.selectedCategory();
      console.log(filterItem);
      console.log(category);
      if(category === 'all') {
        return filterItem;
        filterItem.marker.setVisible(true);
      } else if(filterItem.category() === category) {
          return filterItem;
          filterItem.marker.setVisible(true);
      } else {
          filterItem.marker.setVisible(false);
      }
    });
  });

  // self.filteredLocations = ko.computed(function() {
  //   switch (self.selectedCategory()) {
  //
  //   default:
  //     return self.locationList();
  //
  //   case 'groomer':
  //     var tempList = self.locationList().slice();
  //     return tempList.filter(function(filterItem) {
  //       return filterItem.category() === 'groomer';
  //     });
  //
  //   case 'park':
  //     var tempList = self.locationList().slice();
  //     return tempList.filter(function(filterItem) {
  //       return filterItem.category() === 'park';
  //     });
  //
  //   case 'store':
  //     var tempList = self.locationList().slice();
  //     return tempList.filter(function(filterItem) {
  //       return filterItem.category() === 'store';
  //     });
  //   }
  // });

  // self.filteredLocations = ko.computed(function() {
  //   var category = self.selectedCategory();
  //   if(category === 'all') {
  //     return self.locationList();
  //   } else {
  //     var tempList = self.locationList().slice();
  //     return tempList.filter(function(location) {
  //       return location.category() === category;
  //     });
  //   }
  // });

};
