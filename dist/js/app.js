// IOS Safari font size change on orientation fix
if (navigator.userAgent.match(/(iPhone|iPod|iPad)/)) {
document.write("<style>body {-webkit-text-size-adjust: none;}</style>")
} 

//Android font booster fix
if (navigator.userAgent.match(/(Android)/)) {
document.write("<style>p,a,h1,h2,h3,h4,h5,div {max-height: 100000px;}</style>")
} 
  

//Smart resize
(function($,sr){
  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 100);
      };
  }
  // smartresize 
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartresize');


// usage:
$(window).smartresize(function(){

});

//window scroll throttling

function bodyBgToggle () {
  $('body').prepend('<div style="js_bg_image_toggle bg_image_toggle">toggle bg</div>')
}
bodyBgToggle();

$(document).ready(function(){
  $('.image').on('click', function(){
    alert('image clicked');    
  });
});



