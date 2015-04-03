# HOW TO USE #

If u there's no JSONP Channel Viewer Protocol for your server than the  php code should be placed on a server that is able to connect to the murmur server instance ICE port. Note you also need [PHP-ICE](http://mumble.sourceforge.net/Ice).
Place the mumble.php on a public place and MumbleReader.class.php somethere in your include path. For example the same directory as your mumble.php

If your not running the server ask your server admin to make the public version of the json(p) Channel Viewer Protocol
but first check if there not already one.
http://mumble.sourceforge.net/Channel_Viewer_Protocol

NOTE that if u have a big server loading could freeze the browser for a second or more.

# ONE YOUR WEBSITE #

inlude the requred javascript file in given order on your page you want to display the viewer
  * Jquery (tested jquery-1.3.2.min.js) http://jquery.com/
  * qTip (tested jquery.qtip-1.0.0-rc3.min.js) http://craigsworks.com/projects/qtip/
  * mumble viewer js file (mumble.js included in this package) http://mumble.rko.nu/ Or take the latest version from the SVN http://mumblereader.googlecode.com/svn/trunk/jquery.mumblereader.min.js


for a bit styling u also need to include the css file style.css.
```
<link rel="stylesheet" type="text/css" href="http://yoursite/path/to/style.css" />
```

the following could should make the viewer appear in a div where
```
id="mumbleviewerdiv" make sure it exists (<div id="mumbleviewerdiv"></div>)
```

**Make sure u change the url http://api.rko.nu/mumble.php?callback=? to where our JSON Channel Viewer Protocol is located and**
**make sure the callback=? is at the end of the of the url (if u want to add a port http://api.rko.nu/mumble.php?port=64738&callback=?)***

# Example #
```

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <title>PHP Mumble Viewer</title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8" />
    <link rel="stylesheet" type="text/css" href="http://cdn.rko.nu/mumble/style.css" />
    <link rel="shortcut icon" type="image/x-icon" href="mumble.ico" />
    <script type="text/javascript" src="http://cdn.rko.nu/jquery-qtip/jquery-1.3.2.min.js"></script>
    <script type="text/javascript" src="http://cdn.rko.nu/jquery-qtip/jquery.qtip-1.0.0-rc3.min.js"></script>
    <script type="text/javascript" src="http://mumblereader.googlecode.com/svn/trunk/jquery.mumblereader.min.js"></script>
<script type='text/javascript'>
$(document).ready(function()
{
  load_mum(); //This will to the loading the first time
  window.setInterval("load_mum();", 30000); //This will load the viewer every 30
});

var mr = new mumbleReader('http://shotgunfun.de/mumble/1.json?callback=?', 'mum1'); //REPLACE THE URL WITH OUR OWN
var mr1 = new mumbleReader('http://api.rko.nu/mumble.php?callback=?', 'mum2'); //REPLACE THE URL WITH OUR OWN
mr.setuseservername(true); //Use the server name as name of the root channel
//mr1.setuseservername(true); //Use the server name as name of the root channel
//mr.setlenght(5); //Set the max lenght for displaying
mr1.settooltip(false);//To disable the tooltip
function load_mum() {
  mr.start(); //This will reload the viewer
  mr1.start(); 
}

</script>
  </head>
  <body>
    <table>
      <tr>
        <td VALIGN="top"><div id="mum1"></div></td>
        <td VALIGN="top"><div id="mum2"></div></td>
      </tr>
    </table>
  </body>
</html>

```