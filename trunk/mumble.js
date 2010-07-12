/**
 * Copyright 2010 Pimmetje 
 * contact Pimmetje (at) gmail (dot) com
 *  
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Create object to
 * Load the mumble viewer inside a div and make use it gets renderd
 * 
 * @param jsonurl a full url to a JSONP from your mumble server
 * @param div the div to load the viewer in
 */
function mumbleReader(jsonurl, div) {
  var ldiv = div;
  var ljsonurl = jsonurl;
  //General options
  var ltooltip = "true";
  var limgpath = "http://cdn.rko.nu/mumble/";
  var llenght = 20;
  var luseservername = false;
  
  /**************************************************************
   * Mumble Reader functions
   */
  this.setuseservername = function (val) {
    luseservername = val;
  }

  this.settooltip = function (val) {
    ltooltip = val;
  }

  this.setimgpath = function (val) {
    limgpath = val;
  }

  this.setlenght = function (val) {
    llenght = val;
  }

  /**
   * Render channels and subchannels
   *
   * @param data the json data for the channels to render
   * @return valid representation of the channel and subchannels
   */
  var channels = function(data) {
    var d = "";
    $.each(data,function (i,da) {
      d += channel(da);
    });
    return d;
  }
  
  /**
   * Render a channel
   *
   * @param data the json data for the channel to render
   * @return valid representation of the channel
   */
  var channel = function(data) {
    var tip = "Name: "+data.name;
    var d = "<div class=\"mumstatusItem\"><div class=\"mumstatusLabel\"><a href=\""+"\" tooltip=\""+tip+"\">" + img('channel.png', '') + lengh(data.name)+ "</a></div>";
    if(data.channels != null) {
      d += channels(data.channels);
    }
    if(data.users != null) {
      d += users(data.users);
    }
    d += "</div>";
    return d;
  }
  
  /**
   * Render users
   *
   * @param data user data
   * @reten all users renderd
   */
  var users = function(data) {
    var d = "";
    $.each(data,function (i,da) {
      d += user(da);
    });
    return d;
  }
  
  
  /**
   * Render a user
   *
   * @param data user data
   * @reten the user renderd
   */
  var user = function(data) {
    var tip = "Name: "+data.name+"<br />Idle:" + parseTime(data.idlesecs) + "<br />Online:" + parseTime(data.onlinesecs) + "<br />OS:" +data.os;
    var imgf = (data.idlesecs == 0) ? img('talking_on.png', '') : img('talking_off.png', '');
    var d = "<div class=\"mumstatusItem\"><div class=\"mumstatusLabel\"><a tooltip=\""+ tip +"\">" +imgf+ lengh(data.name) + "</div>";
    d += "<div class=\"mumstatusFlags\">";
    d += userflags(data);
    d += "</div></a>";
    if(data.channels != null) {
      d += users(data.users);
    }
    d += "</div>";
    return d;
  }
  
  /**
   * Create the img html code for all flags of a user
   *
   * @param data user data
   * @reten HTML code for all the images for user flags
   */
  var userflags = function(data) {
    var imgf = "";
    imgf += (data.mute) ? img('muted_server.png', '') : "" ;
    imgf += (data.deaf) ? img('deafened_server.png', '') : "";
    imgf += (data.suppressed) ? img('muted_local.png', '') : "";
    imgf += (data.selfMute) ? img('muted_self.png', '') : "";
    imgf += (data.selfDeaf) ? img('deafened_self.png', '') : "";
    imgf += (data.id != -1) ? img('authenticated.png', '') : "";
    return imgf;
  }
  
  /**
   * Activate the tooltip for a given div
   *
   * @param div the div to activate the tooltips on
   */
  var activatehover = function() {
    $('#'+ldiv+' [tooltip]').each(function() // Select all elements with the \"tooltip\" attribute
    {
      $(this).qtip({content: $(this).attr('tooltip')}); // Retrieve the tooltip attribute value from the current element
    });
  }
  
  /**
   * Give a human readable format voor de time
   *
   * $param arg time in seconds
   * @return string representation of time
   */
  var parseTime = function(arg) {
    var myTime = [];
    myTime[0] = ["seconds",1];
    myTime[1] = ["minutes", 60];
    myTime[2] = ["hours",3600];
    myTime[3] = ["days", 86400];
    myTime[4] = ["weeks", 604800];
    myTime[5] = ["months", 2628000];
    myTime[6] = ["years", 31536000];
    var i = 1;
    while(i < 6 && (myTime[(i+1)][1]) < arg) {
      i++;
    }
    var temp = Math.floor(arg / myTime[i][1]);
    var j = i - 1;
    return temp + " " + myTime[i][0] + " " + Math.round((arg - (temp * myTime[i][1])) / myTime[j][1]) + " " + myTime[j][0];
  }
  
  /**
   * Change the strings to a length given maybe do some formating
   *
   * @oaran str the stinrg to check
   * @parma length the length sting may not be longer as
   * @return a well formated not to long string
   */
  var lengh = function (str) {
    if(str.length < llenght) {
      return str;
    } else {
      return str.substring(0, llenght);
    }
  }
  
  /**
   * Render a image for use in the viewer
   *
   * @param file the file name of the image
   * @param alt the alt of the image
   * @return valid html of the image for viewer
   */
  var img = function (file, alt) {
    return "<img src='"+ limgpath + file +"' alt='" + alt + "' />";
  }

  /**
   * Rebder the mumble settings for root
   *
   * @param data the server data
   * @return the renderd data
   */
  var root = function (data) {
    var tip = "Name:"+data.name+"<br />Uptime:"+parseTime(data.uptime);
    var d = "<div class=\"mumstatus\">";
    var src = (data.x_connecturl != null) ? data.x_connecturl : '';
    var name = "Root";
    if(luseservername) name = data.name;
    d += "<a href=\""+src+"\" tooltip=\""+ tip +"\">"+img('mumble.png', '')+" "+name+": </a><br />";
    if(data.root.channels != null) {
      d += channels(data.root.channels);
    }
    if(data.root.users != null) {
      d += users(data.root.users);
    }
    d += "</div>";
    return d;
  }

  /**
   * Will render the view and put it in a div
   *
   * @param data the json data object
   */
  var render = function (data) {
    if(data != null) {
      var d = root(data);
      if(ltooltip) {
        $('#' + ldiv + ' [tooltip]').qtip("hide");
        $('#' + ldiv + ' [tooltip]').qtip("destroy");
      }
      $('#' + div).empty();
      $('#' + div).append(d);
      if(ltooltip) {
        activatehover();
      }
    }
  }

  /**
   * This methode will render the viewer
   */
  this.start = function() {
    $.getJSON(jsonurl,
    function(data){
      render(data);
    });
  }
}
