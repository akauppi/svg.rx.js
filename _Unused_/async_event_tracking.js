    /***
    * Seems the events actually get dispatched right away, and our problems were about other things. AKa080516
    *
    * Use this code if that's not true.
    ***/
    var TEST_ASYM = false;

    if (TEST_ASYM) {
      // Note: The events are only dispatched, not received and processed, yet. Give some time, and check the situation
      //      again.
      //
      // See -> http://stackoverflow.com/questions/4402287/javascript-remove-event-listener
      //
      window.addEventListener('mouseup', function name (ev) {    // Note: 'name' needed for removing the listener
        console.log( "Seems we're done", ev );

        window.removeEventListener('mouseup', name);

        var sbox= r.sbox();

        sbox.x.should.be.closeTo( X+DX, 0.01 );
        sbox.y.should.be.closeTo( Y+DY, 0.01 );

        done();
        return true;    // carry on
      });
    }
