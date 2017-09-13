
// ATTRIBUTIONS:
//  Used the Google Maps API course materials for function examples and inspiration.


var locations = [
  {type: 'groomer', title: 'Wizard of Paws', location: {lat: 37.876001, lng: -122.300502}},
  {type: 'groomer', title: 'Tails A Go-Go', location: {lat: 37.890157, lng: -122.297627}},
  {type: 'groomer', title: 'Kutz For Mutz', location: {lat: 37.889388, lng: -122.298894}},
  {type: 'groomer', title: 'Dogs Best Friend & The Cats Meow', location: {lat: 37.896172, lng: -122.300565}},
  {type: 'groomer', title: 'Mudpuppys', location: {lat: 37.89906, lng: -122.323997}},
  {type: 'park', title: 'Ohlone Doggy Park', location: {lat: 37.873013, lng: -122.275446}},
  {type: 'park', title: 'Cesar E. Chavez Park', location: {lat: 37.869658, lng: -122.31949}},
  {type: 'park', title: 'Point Isabel Dog Park', location: {lat: 37.900929, lng: -122.324709}},
  {type: 'store', title: 'Holistic Hound', location: {lat: 37.879906, lng: -122.268456}},
  {type: 'store', title: 'Your Basic Bird', location: {lat: 37.857557, lng: -122.253388}},
  {type: 'store', title: 'Pet Food Express', location: {lat: 37.8694, lng: -122.291979}},
  {type: 'store', title: 'Alpha Pet Supply', location: {lat: 37.888288, lng: -122.298632}},
  {type: 'store', title: 'Paco Collars', location: {lat: 37.856434, lng: -122.266362}}
];


// Inititalize the background map, called from the src on index.html.

var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.879789, lng: -122.289945},
    zoom: 14,
    mapTypeControl: false
  });

// Create an array of markers from the array of locations.

var markers = [];

for (var i = 0; i < locations.length; i++) {
  var position = locations[i].location;
  var title = locations[i].title;
  var marker = new google.maps.Marker({
    position: position,
    map: map,
    title: title,
    id: i
  });
  markers.push(marker);

  // marker.addListener('click', function() {
  //   populateInfoWindow(this, largeInfowindow);
  //   this.setIcon(selectedIcon);
  // });
}

};
