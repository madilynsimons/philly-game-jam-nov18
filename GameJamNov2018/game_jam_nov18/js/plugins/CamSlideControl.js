#------------------------------------------------------------------------------#
#  Galv's Cam Slide Control
#------------------------------------------------------------------------------#
#  For: RPGMAKER VX ACE
#  Version 1.0
#------------------------------------------------------------------------------#
#  2015-10-09 - Version 1.0 - release
#------------------------------------------------------------------------------#
# This script gives the camera a slide effect and also more control of where
# the camera is focused. You can set it to follow an event or scroll to an x,y
# position on the map.
 
 
 
#-------------------------------------------------------------------------------
#  SCRIPT CALL
#-------------------------------------------------------------------------------
# $game_map.camslide(status)      # status can be true or false (default true)
#
#                                 # when false - cam reverts to default,
#                                 # does not slide and 'scroll map' event works
#
#                                 # when true - slide effect and targeting
#                                 # works but 'scroll map' does not.
#
# $game_map.camtarget(x,s)        # x is event ID
#                                 # s is speed of camera scroll (800 default)
#                                 # the greater the speed the slower the scroll
#                                 # sets camslide to true automatically.
#
# $game_map.camtarget_xy(x,y,s)   # x,y are the x,y co-ordinates on the map.
#                                 # s is speed (same as above)
#                                 # sets camslide to true automatically.
#
# $game_map.cam_default           # sets camtarget back to player
#                                 # sets camslide to true automatically.
#-------------------------------------------------------------------------------
 
class Game_Player < Game_Character
 
  alias galv_scroll_gp_gc_update_scroll update_scroll
  def update_scroll(last_real_x, last_real_y)
    return if !$game_map.free_cam
    galv_scroll_gp_gc_update_scroll(last_real_x, last_real_y)
  end
 
end
 
 
 
class Game_Map
  attr_accessor :free_cam
  attr_accessor :camtarget
   
  alias galv_scroll_gm_initialize initialize
  def initialize
    galv_scroll_gm_initialize
    cam_default
  end
   
  def camslide(status)
    @free_cam = !status
  end
 
  alias galv_scroll_gm_setup setup
  def setup(map_id)
    cam_default
    galv_scroll_gm_setup(map_id)
  end
   
  def camtarget(x, spd = 800)
    @camtarget = @events[x]
    @free_cam = false
    @camspeed = spd
  end
   
  def camtarget_xy(x,y,spd = 800)
    @camtarget = Camxytarget.new
    @camtarget.camxy(x,y)
    @free_cam = false
    @camspeed = spd
  end
   
  def cam_default(speed = 800)
    @camtarget = $game_player
    @free_cam = false
    @camspeed = speed
  end
   
  alias galv_scroll_gm_update_scroll update_scroll
  def update_scroll
     
    return galv_scroll_gm_update_scroll if @free_cam
    @scroll_rest = 0
    cw = (Graphics.width / 2)
    ch = (Graphics.height / 2)
     
    sx = 0.016 + (@camtarget.screen_x - cw).abs / @camspeed
    sy = 0.016 + (@camtarget.screen_y - ch).abs / @camspeed
    y_pos = @camtarget.screen_y.to_i
    x_pos = @camtarget.screen_x.to_i
    if y_pos < ch
      $game_map.scroll_up(sy)
    elsif y_pos > ch
      $game_map.scroll_down(sy)
    end
    if x_pos < cw
      $game_map.scroll_left(sx)
    elsif x_pos > cw
      $game_map.scroll_right(sx)
    end
  end
   
end
 
 
class Camxytarget < Game_CharacterBase
 
  def camxy(x,y)
    @x = x
    @y = y
    @real_x = @x
    @real_y = @y
  end
end