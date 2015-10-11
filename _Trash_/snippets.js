	var proto = SVG.Element.prototype;
  
  // 'was_f': the original method function
  // 'n': index in the 'this._observables' array to emit to
  // 'ctx': the 'this' context
  //
  // Returns: the wrapped method function
  //
  var fact = function (was_f, n, ctx) {
  	return function (v) {                 // (Number) => ctx or () => Number
  
  		if (v !== undefined) {
  			// Making the change before informing observers (we don't want to trust
  			// in the implementation details of '.onNext'). Then again, the order
  			// probably doesn't even matter. AKa280915
  			//
  			was_f.call(ctx,v);
  
  			var obs = ctx._observables ? ctx._observables[n] : null;
  			if (obs) {
  				obs.onNext(v);
  			}
  
  			return ctx;
  			
  		} else {
  			return was_f.call(ctx);
  		}
  
  	};
  };
  
  // tbd. DAMN making JavaScript inheritence right is difficult (take ES6 to help!). 
  //      (The problem here is getting the right 'this' context for the factory-made method.) AKa190915
  //
  // Note: 'move', 'cx', 'cy', 'center' get processed indirectly, because they forward to
  //      'x','y','width','height' calls.
  //
  var was_x = proto.x;
  var was_y = proto.y;
  //var was_width = proto.width;
  //var was_height = proto.height;
  
  proto.x = function(v) { return fact(was_x, 0, this)(v); };
  proto.y = function(v) { return fact(was_y, 1, this)(v); };
  //proto.width = function(v) { return fact(was_width, 2, this)(v); };
  //proto.height = function(v) { return fact(was_height, 3, this)(v); };


...

		track: function (obsX, obsY /*, obsW, obsH*/) {    // ([Rx.BehaviorSubject], [Rx.BehaviorSubject], [Rx.BehaviorSubject], [Rx.BehaviorSubject]) => this
    
    	// Note: This overrides earlier trackings. Should we do a '.dispose()' or is it okay just to leave them waiting for
    	//      garbage collection? tbd. AKa200915
    	//
    	this._observables = [obsX, obsY /*, obsW, obsH*/];
    	
    	return this;
    },
    
    // Make the element's attribute ("x","y","width" or "height") follow an 'SVG.Observable'.
    // 
    follow: function (attr, obs) {    // (String, SVG.Observable) => this
    	var el= this;
    	
    	obs.subscribe( function (v) {
    		el.attr(attr, v);
    	} );
    	
    	return this;
    }
