'use strict';

crop.factory('cropArea', ['cropCanvas', function(CropCanvas) {
  var CropArea = function(ctx, events) {
    this._ctx=ctx;
    this._events=events;

    this._minHeight = this._minWidth =80;

    this._cropCanvas=new CropCanvas(ctx);

    this._image=new Image();
    this._x = 0;
    this._y = 0;
    this._height = this._width = 200;
  };

  /* GETTERS/SETTERS */

  CropArea.prototype.getImage = function () {
    return this._image;
  };
  CropArea.prototype.setImage = function (image) {
    this._image = image;
  };

  CropArea.prototype.getX = function () {
    return this._x;
  };
  CropArea.prototype.setX = function (x) {
    this._x = x;
    this._dontDragOutside();
  };

  CropArea.prototype.getY = function () {
    return this._y;
  };
  CropArea.prototype.setY = function (y) {
    this._y = y;
    this._dontDragOutside();
  };

  CropArea.prototype.getHeight = function () {
    return this._height;
  };
  CropArea.prototype.setHeight = function (height) {
    this._height = Math.max(this._minHeight, height);
    this._dontDragOutside();
  };

  CropArea.prototype.getMinHeight = function () {
    return this._minHeight;
  };
  CropArea.prototype.setMinHeight = function (height) {
      this._minHeight = height;
    this._height = Math.max(this._minHeight, this._height);
    this._dontDragOutside();
  };

  CropArea.prototype.getWidth = function () {
      return this._width;
  };
  CropArea.prototype.setWidth = function (width) {
      this._width = Math.max(this._minWidth, width);
      this._dontDragOutside();
  };

  CropArea.prototype.getMinWidth = function () {
      return this._minWidth;
  };

  CropArea.prototype.setMinWidth = function (width) {
      this._minWidth = width;
      this._width = Math.max(this._minWidth, this._width);
      this._dontDragOutside();
  };

  /* FUNCTIONS */
  CropArea.prototype._dontDragOutside=function() {
    var h=this._ctx.canvas.height,
        w=this._ctx.canvas.width;
    if(this._width>w) { this._width=w; }
    if(this._height>h) { this._height=h; }
    if(this._x<this._width/2) { this._x=this._width/2; }
    if(this._x>w-this._width/2) { this._x=w-this._width/2; }
    if(this._y<this._height/2) { this._y=this._height/2; }
    if(this._y>h-this._height/2) { this._y=h-this._height/2; }
  };

  CropArea.prototype._drawArea=function() {};

  CropArea.prototype.draw=function() {
    // draw crop area
    this._cropCanvas.drawCropArea(this._image,[this._x,this._y], this._width, this._height,this._drawArea);
  };

  CropArea.prototype.processMouseMove=function() {};

  CropArea.prototype.processMouseDown=function() {};

  CropArea.prototype.processMouseUp=function() {};

  return CropArea;
}]);