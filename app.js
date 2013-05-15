var r = require('request');
var fs = require('fs');
var http = require('http');
var growl = require('growl');
var teams = {
  'memphis' : 'MEM',
	'okcity'  : 'OKC',
	'indiana' : 'IND',
	'newyork' : 'NYK',
	'miami'   : 'MIA',
	'chicago' :  'CHI',
	'goldenst': 'GS',
	'sanantonio': 'SA'

}

var scores = {
  'memphis' : 0,
  'okcity'  : 0,
  'indiana' : 0,
  'newyork' : 0,
  'miami'   : 0,
  'chicago' : 0,
  'goldenst': 0,
  'sanantonio':0
}

var first = true;
var showNotify = function(pic,title,text){
	console.log(title);
	console.log(text);
  	growl(text, { title: title, image:' '+__dirname+'/logos/'+pic+'.png' });//,function(e){console.log(e)}); //the npm version is buggie so until they update be fix here.

};

var getText = function(last,now,team,msj,cb){

  var title;
  var diff = now - last;
			switch (diff){
			  case 1:
					title = "Tiro libre encestado de "+teams[team];
					break;

				case 2:
					title = "Doble de "+teams[team]+"!!";
					break;
				case 3:
					title = "Triple de "+teams[team]+"!!!";
					break;
				default:
					title = "Actualizacion de resultado";
					break;
			}
			cb(team,title,msj);
	} 


http.get({host:'68.71.216.158',path:'/nba/rts'},
	       	function(res){
					  res.setEncoding();
						//console.log(res);
		       	res.on('data',function(d){
			       if( d.indexOf("Welcome") != -1){
				       console.log(d);
			       } else {
				       //console.log(d);
							var title;
				      var m = d.split('/');
				      if(m.length > 4) {
                msj = teams[m[1]]+" "+m[3]+" vs "+teams[m[2]]+" "+m[4]+ " time: "+m[7].split('qtr')[0];                    
							  
								if (first){
							  	// have to set the scores
									scores[m[1]] = m[3];
									scores[m[2]] = m[4];
									//notify and change flag
									first = false;
                  showNotify(m[2],'Comienzo: El partido va..',msj);
								}
								else{
   								//set score
	  							if ( scores[m[1]] !== m[3] ) {
								    
		  						   title = getText(scores[m[1]],m[3],m[1],msj,showNotify);				
			  					   scores[m[1]] = m[3];
				  				};
					  			if ( scores[m[2]] !== m[4] ) { 
						  			title = getText(scores[m[2]],m[4],m[2],msj,showNotify);			
							  		scores[m[2]] = m[4] 
							  	};
                }

								//console.log(teams[m[1]]+" "+scores[m[1]]+" vs "+teams[m[2]]+" "+scores[m[2]]+ " time: "+m[7].split('qtr')[0]);
								
                //showNotify('',title,msj);
					   }
				  }
			 })
		});
//r.get('http://68.71.216.158/nba/rts').pipe(fs.createWriteStream('a.log'))
