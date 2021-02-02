(function(){
	var comp = app.project.activeItem;
	var layer = comp.selectedLayers[0];
	var shape = layer.selectedProperties[1].value;
	var verts = shape.vertices, ins = shape.inTangents, outs = shape.outTangents;

	function getWorkDir(){ return app.project.file.parent.fsName }
	function printf(s,a){
	// mostly this is to make string concatenation
	// easier -- similar to printf in C
		var s2=s,i;
		for( i=0; i<a.length; i++ ){
			s2 = s2.replace("%s",a[i]);
		}
		return s2;
	}
	function doConversion(){
		var fname = printf(
			"%s/%s.json",
			[ getWorkDir(), prompt("Enter Name") ]
		);
		var f = new File( fname );
		f.open( "w" );
		f.write(
			JSON.stringify({
				verts:verts,
				ins:ins,
				outs:outs
			})
		);
		f.close();
	}

	if ( !app.project.file ){
		alert( "Project file must be saved first" );
		return 1;
	}

	// script is available at https://github.com/douglascrockford/JSON-js
	$.evalFile( "json2.js" );

	if ( init() === 1 ) return;
	doConversion();
}());
