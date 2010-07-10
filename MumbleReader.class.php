<?php
/**
 * Copyright 2010 Pimmetje
 * contact Pimmetje (at) gmail (dot) com
 * 
 * Past of the PHP code is based on what i leared from the mumble viewer
 * http://sourceforge.net/projects/mumbleviewer/ this code is GPL licenced
 * All code i have used is refactored and commented.
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

class mumblereader {
  
  private $port;
  private $ice;

  public function mumblereader($port) {
    $this->ice = $this->init_ICE();
    $this->port = $port;
  }

  /**
   * Create's a ICE object
   *
   * @return ice object
   */
  private function init_ICE() {
    global $ICE;
    Ice_loadProfile();
    $base = $ICE->stringToProxy("Meta:tcp -h 127.0.0.1 -p 6502");
    return $base->ice_checkedCast("::Murmur::Meta");
  }

  /**
   * Converts recursively an Ice-Channel to an array.
   *
   * @param IceObject $iceChannel
   * @return Channel-Array
   */
  private function loadChannel($iceChannel) {
    $channel             = array();
    $channel['id']       = $iceChannel->c->id;
    $channel['name']     = $iceChannel->c->name;
    $channel['parent']   = $iceChannel->c->parent;
    $channel['channels'] = array();
    $channel['users']    = array();
    $channel['links']    = array();
    foreach ($iceChannel->children as $_channel) {
      $channel['channels'][] = $this->loadChannel($_channel);
    }
    // for mumble 1.1.x compability!
    if (isset($iceChannel->players) && $iceChannel->players != null) {
      foreach ($iceChannel->players as $_player) {
        $channel['users'][] = $this->loadUser($_player);
      }
    } else if ($iceChannel->users != null) {
      foreach ($iceChannel->users as $_user) {
        $channel['users'][] = $this->loadUser($_user);
      }
    }
    return $channel;
  }

  /**
   * Converts recursively an Ice-User to an array.
   *
   * @param IceObject $iceUser
   * @return User-Array
   */
  private function loadUser($iceUser) {
    $user = array();
    $user['session']     = $iceUser->session;
    $user['userid']      = isset($iceUser->playerid) ? $iceUser->playerid : isset($iceUser->userid) ? $iceUser->userid : '';
    $user['mute']        = $iceUser->mute;
    $user['deaf']        = $iceUser->deaf;
    $user['suppressed']  = isset($iceUser->suppressed) ? $iceUser->suppressed : '';
    $user['selfMute']    = $iceUser->selfMute;
    $user['selfDeaf']    = $iceUser->selfDeaf;
    $user['channel']     = $iceUser->channel;
    $user['name']        = $iceUser->name;
    $user['onlinesecs']  = $iceUser->onlinesecs;
    $user['idlesecs']    = $iceUser->idlesecs;
    $user['os']          = $iceUser->os;
    $user['release']     = $iceUser->release;
    $user['bytespersec'] = $iceUser->bytespersec;

    return $user;
  }

  /**
   * Load all data to a array
   * 
   * @return array of the server
   */
  private function loadData() {
    $servers    = $this->ice->getBootedServers();
    $default    = $this->ice->getDefaultConf();

    foreach ($servers as $id => $iceServer) {
      if($iceServer->getConf('port') == $this->port) {
        $port       = $iceServer->getConf('port');
        $servername = $iceServer->getConf("registername");
        $tree       = $iceServer->getTree();
        $uptime       = $iceServer->getUptime();
        $server['root'] = $this->loadChannel($tree);
        $server['name'] = $servername;
        $server['id'] = $tree->c->id;
        $server['uptime'] = $uptime;
        $server['x_connecturl'] = "conurl";
        return $server;
      }
    }
    return null;
  }

  /**
   * Load all data from a server tree to a array
   *
   * @return array of the server
   */
  private function loadTree() {
    $servers    = $this->ice->getBootedServers();
    $default    = $this->ice->getDefaultConf();

    foreach ($servers as $id => $iceServer) {
      if($iceServer->getConf('port') == $this->port) {
        $tree       = $iceServer->getTree();
        $array = get_object_vars($tree);
        return $array;
      }
    }
    return null;
  }

  /**
   * Render JSON(P) output for this server
   *
   * @return JSON(P) representing the server
   */
  public function renderTree() {
    return $this->renderJsonP($this->loadTree());
  }


  /**
   * Render JSON(P) output for this server
   * 
   * @return JSON(P) representing the server
   */
  public function render() {
    return $this->renderJsonP($this->loadData());
  }

  /**
   * Make from a array a json or jsonp string (depending on is $_GET['callback'] is set)
   * 
   * @param $d the array that needs to be converted
   * @return json(p) string
   */
  private function renderJsonP($d) {
    $data = json_encode($d);
    $callback = '';
    if(isset($_GET['callback'])) {$callback = $_GET['callback'];}
    if(!empty($callback)) {
      return $callback . '(' . $data . ');';
    } else {
      return $data;
    }
  }
}
