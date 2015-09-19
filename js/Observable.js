/*
* Observable.js
*
* Usage:
*   val o = new Observable(value);
*   ...
*   o.subscribe( function(v) { ... } );
*   ...
*   o.emit(value);
*   ...
*   o.dispose();
*/
//assert( Rx );

function Observable(val) {
  this.value = val;
  this.subject = new Rx.Subject();
  
  this.subject.onNext(val);
}

Observable.prototype.subscribe = function (handlerF) {    // ( (Any) => Unit )
  this.subject.subscribe(handlerF);
};

Observable.prototype.emit = function (val) {    // ( (Any) => Unit )
  this.subject.onNext(val);
};

Observable.prototype.dispose = function () {
  this.subject.dispose();
};
