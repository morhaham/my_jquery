(function() {
  $ = function(selector) {
      if (this instanceof $) {
        if ($.isArray(selector)) {
          [].push.apply(this, selector);
        } else {
        var elements = document.querySelectorAll(selector);
        [].push.apply(this, elements);
        }
       } else {
        return new $(selector);
       }
  }

  $.extend = function(target, object) {
    for (var prop in object) {
          target[prop] = object[prop];      
    }
    return target;
  };

  // Static methods
  var isArrayLike = function(obj) {
    if (typeof obj.length === 'number') {
      if (obj.length === 0) {
        return true;
      } else {
        return (obj.length-1) in obj;
      }
    };
    return false;
  }

  var makeTraverser = function(cb) {
    return function(args) {
      var arr= [];
      $.each(this, function() {
        var el = cb.apply(this, [args]);
        if (el && isArrayLike(el)) {
          [].push.apply(arr, el);
        } else if (el) {
           arr.push(el);
        }
      })
      return $(arr);
    }
  }

  $.extend($, {
    isArray: function(obj) {
      if (Object.prototype.toString.call(obj) === "[object Array]") {
        return true;
      } else {
        return false;
      }
    },
    each: function(collection, cb) {
      if (isArrayLike(collection)) {
        for (var i = 0; i < collection.length; i++) {
            cb.call(collection[i], i, collection[i]);
        }
      } else {
        for (var prop in collection) {
          cb.call(collection[prop], prop, collection[prop]);
        }
      }
      return collection;
    },
    makeArray: function(arr) {
      if (isArrayLike(arr)) {
        var newArr = [];
        $.each(arr, function(i, value) {
          newArr.push(value);
        });
        return newArr
      }
    },
    proxy: function(fn, context) {
      return function(args) {
        return fn.apply(context, [args]);
      };
    },
  });

  $.extend($.prototype, {
    html: function(newHtml) {
      if (arguments.length) {
        $.each(this, function() {
          this.innerHTML = newHtml;
        });
        return this;
      } else {
        return this[0].innerHTML;
      }   
    },
    val: function(newVal) {
      if (newVal) {
        $.each(this, function() {
          this.value = newVal;
        })
        return this;
      } else {
        return this[0].value;
      }
    },
    text: function(newText) {
      if (arguments.length) {
        this.html("");
        $.each(this, function() {
          var textNode = document.createTextNode(newText);
          this.appendChild(textNode);
        })
      } else {
        var textNodes = '';
        (function addTextNodes(el) {
          if (!el.childNodes) return;
          $.each(el.childNodes, function() {
            if (this.nodeName === '#text') {
               textNodes += this.nodeValue;
            } else {
              addTextNodes(this);
            }
          })
        })(this[0]);
        return textNodes;
      }
    },
    find: makeTraverser(function(args) {
      return this.querySelectorAll(args);
    }),
    next: makeTraverser(function() {
      var current = this.nextSibling;
          while (current && current.nodeName === '#text') {
            current = current.nextSibling;
          }
          if (current) {
          return current;
          }
    }),
    prev: makeTraverser(function() {
      current = this.previousSibling;
          while (current && current.nodeName === '#text') {
            current = current.previousSibling;
          }
          if (current) {
            return current;
          }
    }),
    parent: makeTraverser(function() {
     return this.parentNode;
    }),
    children: makeTraverser(function() {
      return this.children;
    }),
    attr: function(attrName, value) {
      if (arguments.length > 1) {
        $.each(this, function() {
          this.setAttribute(attrName, value);  
        })
        return this;
      } else {
        return this[0] && this[0].getAttribute(attrName);
      }
    },
    css: function(cssPropName, value) {
      if (arguments.length > 1) {
        $.each(this, function(){
          this.style[cssPropName] = value;
        })
        return this;
      } else {
        return this[0] && document.defaultView.getComputedStyle(this[0])
          .getPropertyValue(cssPropName);
      }
    },
    width: function() {
      var width = this[0].clientWidth - (parseInt(document.defaultView.getComputedStyle(this[0])
      .getPropertyValue('padding-left')) + parseInt(document.defaultView.getComputedStyle(this[0])
      .getPropertyValue('padding-right')));

      return this[0] && width;
    },
    offset: function() {
      var offset = this[0].getBoundingClientRect();
      return {
        top: offset.top + window.pageYOffset,
        left: offset.left + window.pageXOffset
      };
    },
    hide: function() {
      return this.css("display", "none");
    },
    show: function() {
      return this.css("display", "");
    },

    // Events
    bind: function(eventName, handler) {
      $.each(this, function() {
        this.addEventListener(eventName, handler, false);
      })
      return this;
    },
    unbind: function(eventName, handler) {
      $.each(this, function() {
        this.removeEventListener(eventName, handler, false);
      })
      return this;
    },
    has: function(selector) {
      var elements = [];
      $.each(this, function(i, el) {
        if(el.matches(selector)) {
          elements.push(el);
        }
      });
      
      return $( elements );
    }
  });

  $.fn = $.prototype;
  $.buildFragment = function(html) {};
})();