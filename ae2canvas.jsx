(function(){
	var comp = app.project.activeItem;
	var layer = comp.selectedLayers[0];
	var shapes = layer.Contents, sName, mName;
	var round = Math.round,data = {},shape,path,prop,i,j;
	function printf(s,a){
		var s2=s,i;
		for(i=0;i<a.length;i++){
			s2 = s2.replace("%s",a[i]);
		}
		return s2;
	}
	function saveData( data, fname ){
		f = new File(
			printf(
				"%s/%s.json",
				[getWorkDir(),fname]
			)
		);
		f.open( "w" );
		f.write( JSON.stringify(data) );
		f.close();
		system.callSystem(
			printf(
				"open -a TextEdit '%s';",
				[f.fsName]
			)
		);
	}
	// function compress( n ){
	// 	return String(
	// 		"000" + round(n+w).toString(32)
	// 	).slice(-3);
	// }
	function convert( path ){
		return {
			verts: path.vertices,
			ins: path.inTangents,
			outs: path.outTangents
		};
	}
	function rgbToHex( rgb ){
		var hex = '#',i;
		for( i=0; i<rgb.length; i++ ){
			hex += String( "00" + (rgb[i]*255).toString(16) ).slice(-2);
		}
		return hex;
	}
	function getColor( prop ){
		return rgbToHex( prop.Color.value );
	}
	function getStrokeWidth( prop ){
		return prop("Stroke Width").value;
	}
	function getWorkDir(){ return app.project.file.parent.fsName }
	function init(){
		if ( !app.project.file ){
			alert( "Project file must be saved first" );
			return 1;
		}
		$.evalFile( "json2.js" );
	}
	function main(){
		if ( init() === 1 ) return;
		for( i=1; i<=shapes.numProperties; i++ ){
			sName = shapes(i).name;
			data[sName] = {};
			for( j=1; j<=shapes(i).Contents.numProperties; j++ ){
				prop = shapes(i).Contents(j);
				mName = prop.matchName;
				switch ( mName ){
				case "ADBE Vector Shape - Group":
					path = prop(2).value;
					part = prop.name;
					data[sName][part] = convert(path);
					break;
				case "ADBE Vector Graphic - Fill":
					data[sName].fill = getColor( prop );
					break;
				case "ADBE Vector Graphic - Stroke":
					data[sName].stroke = {
						w: getStrokeWidth( prop ),
						style: getColor( prop ),
					}
					break;
				default:
					break;
				}
			}
		}
		saveData( data, layer.name );
	}
	main();
}());
