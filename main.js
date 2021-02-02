function addShape(shape, s, o, C){
// draws the shape (stroke and fill are done separate)
// shape: object -> {verts:[[0,1],..],ins:[[2,3],..],outs:[[4,5],..]}
// s: size: where `1` is 100% scale eg. [1.5,-0.34]
// o: optional position: where [0,0] is center (eg. `[-200,36.9]`)
// C: target canvas context
	var vs = shape.verts;
	var l = vs.length;
	
	// optional after effects' "in tangents"
	var is = shape.ins || null;

	// optional after effects' "out tangents" 
	var os = shape.outs || null;

	// get offset versions of x and y
	var x = SZ/2+(o?o[0]:0), y = SZ/2+(o?o[1]:0);

	// these will store the calculated vertices and tangents
	var ax, ay, bx, by, cx, cy;

	var i,j,k;

	C.beginPath();
	C.moveTo( x+vs[l-1][0]*s[0], y+vs[l-1][1]*s[1] );
	for( i=l; i<=l*2+(temp||0); i++ ){

		// converts after effects' bezier curve format
		// to html canvas.
		//
		//    AFTERFX     -->     CANVAS
		// in<-vert->out  -->  vert->out in<-
		//
		j = (i-1)%l, k = i%l;
		os ? ax = x+(vs[j][0]+os[j][0])*s[0]:null;
		os ? ay = y+(vs[j][1]+os[j][1])*s[1]:null;
		is ? bx = x+(vs[k][0]+is[k][0])*s[0]:null;
		is ? by = y+(vs[k][1]+is[k][1])*s[1]:null;
		cx = x+vs[k][0]*s[0];
		cy = y+vs[k][1]*s[1];
		
		// finally add it to the canvas
		if ( is && os ){
			C.bezierCurveTo( ax, ay, bx, by, cx, cy );
		} else {
			C.lineTo( cx, cy );
		}
	}
}
