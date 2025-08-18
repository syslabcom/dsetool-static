jQuery(document).ready(function() {
	selection();
	codeLanguagesList();
	cargaMapa();
	jQuery(window).resize(function() {
		codeLanguagesList();
	});
});


function selection() {
	jQuery(".MapSC").addClass("selected"); //first time
	jQuery("#listText").hide(); //first time
	jQuery(".ListSC .arrow").removeClass(); //first time
	
	jQuery(".MapSC").click(function() {
		if(!jQuery(this).hasClass("selected")) {
			jQuery(".MapSC").addClass("selected");
			jQuery(".ListSC").removeClass("selected");
			jQuery("#listText").hide(); 
			jQuery(".ListSC .arrow").hide(); 
			jQuery("#mapImg").fadeIn(); 
			jQuery(".MapSC .arrow").show(); 
		}
		if(jQuery("#containerPopLanguages").length>0) {
    		jQuery("#containerPopLanguages").remove();
    		jQuery("#arrowPop").remove();
    	}
	});
	
	jQuery(".ListSC").click(function() {
		if(!jQuery(this).hasClass("selected")) {
			jQuery(".ListSC").addClass("selected");
			jQuery(".MapSC").removeClass("selected");
			jQuery("#mapImg").hide();
			jQuery(".MapSC .arrow").hide(); 
			jQuery("#listText").fadeIn(); 
			jQuery(".ListSC div").addClass("arrow"); 
		}
		if(jQuery("#containerPopLanguages").length>0) {
    		jQuery("#containerPopLanguages").remove();
    		jQuery("#arrowPop").remove();
    	}
	});
}

function codeLanguagesList() {

	if(jQuery(window).width()>1006) {
		jQuery("#listText ul li ul").each(function() {
			jQuery(this).hide();
		});
		jQuery("#listText ul li").each(function() {
			jQuery(this).css("cursor","pointer");
			jQuery(this).click(function() {
				jQuery("#listText ul li ul").each(function() {
					jQuery(this).hide();
				});
				
				topParent=jQuery(this).position().top+10;
				leftParent=jQuery(this).position().left;
				
				
				
				var width=jQuery(this).width();

				if(jQuery("ul",this).is(':visible')) {
					jQuery("ul",this).slideUp("fast");
				} else {
					//jQuery("ul",this).css("left",leftParent+"px").css("top",topParent+"px").css("min-width",width+"px").slideDown("fast");
					jQuery("ul",this).css("left",leftParent+"px").css("top",topParent+"px").slideDown("fast");
				}
			});
		});

		//manipulo los estilo para el separador de idiomas
		jQuery("#listText ul li ul li a").each(function(){
			jQuery(this).mouseover(function() {
				if(jQuery(this).parent().prev().find("a").hasClass("moreItems")) {
					jQuery(this).parent().prev().find("a").removeClass("moreItems").addClass("deleteTmp");
				}
			});
			jQuery(this).mouseout(function() {
				if(jQuery(this).parent().prev().find("a").hasClass("deleteTmp")) {
					jQuery(this).parent().prev().find("a").removeClass("deleteTmp").addClass("moreItems");
				}
			});
		});
	} else {
		jQuery("#listText ul li ul").each(function() {
			jQuery(this).removeAttr("style");
			jQuery("li",this).each(function() {
				jQuery(this).addClass("lineR");
			});
			jQuery("li:last",this).removeClass("lineR");
		});
	}
}

function cargaMapa() {
	
	jQuery('#vmap').vectorMap({
	    map: 'europe_en',
	    backgroundColor: '#ececec',
	    borderColor: '#ffffff',
	    borderOpacity: 1,
	    borderWidth: 1,
	    color: '#bdbfbe',
	    enableZoom: false,
	    hoverColor: '#99cc00',
	    hoverOpacity: 0.5,
	    normalizeFunction: 'linear',
	    scaleColors: ['#b6d6ff', '#005ace'],
	    selectedColor: '',
	    selectedRegion: null,
	    showTooltip: false,

	    onRegionOver: function(event, code, region)
	    {
     		if(code=="no" || code=="pt" || code=="is" || code=="at" || code=="si" || code=="ee" || code=="ro" || code=="es" || code=="lt" || code=="de"){
     			
     			jQuery("path#jqvmap1_" + code).addClass("intro");     			
     			
     		}
	    },


	    onRegionClick: function(element,e,code,region) { 
	    	barrablanca = (jQuery(window).width() - jQuery("#vmap").width())/2 ;
			
	    	if(code!="tr" && code!="ua" && code!="by" && code!="ba" && code!="rs" && code!="al" && code!="mk" && code!="md" && code!="ch" && code!="bg" &&
	    	   code!="hr" && code!="cy" && code!="cz" && code!="dk" && code!="fr" && code!="gr" && code!="hu" && code!="ie" && code!="be" && code!="it" &&
	    	   code!="lv" && code!="nl" && code!="pl" && code!="sk" && code!="se" && code!="gb" && code!="fi"
	    	) {
		    /*	if(jQuery("#containerPopLanguages").length>0) {
		    		jQuery("#containerPopLanguages").remove();
		    		jQuery("#arrowPop").remove();
		    	}
			*/	
		    	var x=e.pageX;
		    	var y=e.pageY;


				var htmlParent=jQuery("ul."+code).parent().html();


				//Countries with only one language
				if (code=="bg" ||code=="cy"|| code=="cz"|| code=="ro" || code=="at" ||
				code=="dk"||  code=="fr"|| code=="hr"|| code=="de"||code=="gr"||code=="hu"||code=="ie"||
				code=="it"|| code=="lt"|| code=="lv"|| code=="nl"||code=="pl"||code=="pt"||code=="sk"||
				code=="si"|| code=="es"|| code=="se"|| code=="gb"||code=="is"||code=="no"||code=="ee"){

					// Countries with language code different than country code
					if (code == "ee")
					{
						code = "et";
					}
					else if (code == "si")
					{
						code = "sl";
					}
					else if (code == "at")
					{
						code = "AT_de";
					}
					
					var htmlParent=jQuery("ul."+code).html();
					
					if (htmlParent==undefined){
						fills();
						return false;
					}

					var cachos=htmlParent.split('href="');
					var trozo=jQuery.trim(cachos[1]);
					var cachos2=trozo.split('">');
					var hrefpais=jQuery.trim(cachos2[0]);
					
					hrefpais=hrefpais.replace("&amp;","&");
				    window.location.href = hrefpais;
					barrablanca = 50000;
				//Countries with more than one languages
				}else{
					var x= jQuery("#jqvmap1_"+code).position().top;
		    		var y= jQuery("#jqvmap1_"+code).position().left;
		    		
		    		var x=e.pageX;
		    		var y=e.pageY;

		    		var htmlParent=jQuery("ul."+code).html();

					var cachos=htmlParent.split("<");

					var country=jQuery("ul."+code).parent().text();
					country = country.slice(0, country.indexOf(" "));

			        var html="<div id='containerPopLanguages'>"+
			        		"<img src='/dangerous-substances/sites/all/themes/bootstrapDs/images/closeMoreinfo.png'>"+
			        		"<div class='lan-" + code +"'></div><div id='countryPop'>"+country+
							"</div><ul id='languageCountriesMap'>"+
			        		jQuery("ul."+code).html()+"</ul></div><div id='arrowPop'></div>";

			  		jQuery("#vmap").after(html);
			  		//close the language selector
			  		jQuery("#containerPopLanguages img").click(function() {	
  						jQuery("#containerPopLanguages").slideUp("fast", function() {
   						
   						});
   						jQuery("#arrowPop").remove();
   						jQuery("#arrowPop").slideUp("fast", function() {
   						
   						});
	  				});



			  		if(jQuery("#admin-menu").length>0) {
			  			jQuery("#arrowPop").css("position","absolute").css("top",y-20+"px").css("left",x-5+"px");
			  		} else {
			  			jQuery("#arrowPop").css("position","absolute").css("top",y-20+"px").css("left",x-5+"px");
			  		}
			  		
			  		var topCon=jQuery("#arrowPop").position().top-jQuery("#containerPopLanguages").height();
			  		var leftCon=jQuery("#arrowPop").position().left-(jQuery("#containerPopLanguages").width()/2-10);
			  		jQuery("#containerPopLanguages").css("top",topCon+"px").css("left",leftCon+"px");
			  		 
			  		var body = jQuery("html, body");
					body.stop().animate({scrollTop:topCon}, '800', 'swing', function() { 
					});
				}
				
				
			} 
			fills();
			
			setTimeout("fills()",10);
			setTimeout("fills()",100);
	    	setTimeout("fills()",200);
	    	setTimeout("fills()",300);
	    	setTimeout("fills()",400);
	    	setTimeout("fills()",500);
	    	setTimeout("fills()",600);
	    	setTimeout("fills()",700);
	    	setTimeout("fills()",800);
	    	setTimeout("fills()",900);
				
	    }
	});
	//fills();

}

function fills() {
	jQuery(".jvectormap-region").each(function() {
		var id=jQuery(this).attr("id");
		if (id=="jqvmap1_tr") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_ua") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_by") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_ba") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_rs") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_al") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_mk") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_md") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_es") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_pt") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_fr") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_de") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_gb") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_ie") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_it") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_mt") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_is") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_nl") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_be") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_lu") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_ch") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_cz") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_pl") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_no") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_se") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_fi") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_lt") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_lv") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_hr") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_gr") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_bg") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_si") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_sk") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_hu") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_dk") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
		if (id=="jqvmap1_cy") {
			jQuery(this).attr("fill","#eaebeb").attr("stroke","#989a9b");
		}
	});

}