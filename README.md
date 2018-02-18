# General


This app gives tempearture details when clicked on marker. </br>
It is possible to click on every marker to get more information regarding temperature. </br>
There is a menu on the left side of the app. </br>
There is a filter option to filter the markers and list views.

# This app was developed using the folowing technologies

1. Google maps API
2. OpenWeather API
3. Ajax request (JSON)
4. Js libraries - JQuery, KnockoutJS 
5. CSS - bootstrap
6. HTML

# Instructions 

1. Open index.html in a web browser.
2. By clicking on one of the markers - the marker will start bouncing and an info window will open. 
3. By clicking close icon the infowindow will be closed .
4. By clicking on another marker, the current info window will close and a new info window will open.
6. By clicking on the listview or marker marker will animate(bouncing).
7. At a time only one marker will animate.
8. By clicking new marker previous marker will stop animating.
9. Every info window includes - 
		1. The name of the Location.
		2. The Temperature of that particular location.
		3. The Minimun and Maximun Temperatures of that particular location.
		4. humidity of that location in percentages.
10. On the upper left side there is a menu bar -  
		1. By clicking on it the menu will close.
		2. By clicking again the menu will open.
11. Clicking on any location on the menu will open the info window of this location and the marker will start bouncing.
12. Above the map there is a filter box - every search in this box will filter the resturants in the menu and the markers in the map.
