// window.to_file_size = function(size) {
//   var precision = 1;
//   var sz = ['b', 'kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb'];
//   var szmax = sz.length-1;
// 
//   // Force units to be at least kB
//   var unit = 1;
//   size /= 1024;
// 
//   while ((size >= 1024) && (unit < szmax)) {
//     size /= 1024;
//     unit++;
//   }
//   return (size.toFixed(precision || 1) + " " + sz[unit]);
// }

window.progress_to_file_size = function( downloaded, size ){
    //console.log( downloaded, size );
    var precision = 1;
    var sz = ['b', 'kb', 'Mb', 'Gb', 'Tb', 'Pb', 'Eb'];
    var szmax = sz.length-1;

    // Force units to be at least kB
    var unit = 1;
    size /= 1024;
    downloaded /= 1024;

    while ((size >= 1024) && (unit < szmax)) {
      size /= 1024;
      downloaded /= 1024;
      unit++;
    }
    //return  (downloaded.toFixed(precision || 1)) + '/' + (size.toFixed(precision || 1) + " " + sz[unit]);
    return  (size.toFixed(precision || 1) + " " + sz[unit]);
};

window.FileView = Backbone.View.extend({
	tagName: 'li',
	initialize: function() {
		_.bindAll(this, 'render');
		this.bind('change', this.render);
	},
	render: function() {
		$(this.el).empty();
		$(this.el).append(this.model.get('properties').get('name'));
		return this;
	}
});

window.TorrentView = Backbone.View.extend({
    //$progress: null, //reference for the progress bar
    className: 'torrentView',
	initialize: function() {
		_.bindAll(this, 'render');
		this.bind('change', this.render);
		console.log( 'initialize torrent', this.model, this, this.model.get('file') );
		
		
		//figure out what is going on with the events
        // this.model.on('change', function(a){
        //    console.log( 'on model change', a, this ); 
        // });
        // this.model.on('change:properties', function(a){
        //    console.log( 'on model change:properties', a, this ); 
        // });
        // this.model.get('file').on('change', function(a){
        //    console.log( 'on file change', a, this ); 
        // });
        // this.model.get('file').on('change:properties', function(a){
        //    console.log( 'on file change:properties', a, this ); 
        // });

        var _this = this;

        // this.model.on('change', function(model,opts) {
        //     console.log('active torrent change',_this.model.get('name'),_this.model.changedAttributes());
        //     _this.render();
        // });
        //this.bind_action_events();

	},
	render: function() {
	    //Add a play button for streaming stuff
	    
	    var properties = this.model.get('properties');
	        //properties.prototype = {};
        //extend the helper functions
        _.extend( properties, this.canHaz );
        //_.extend(properties.prototype, this.canHaz);

	    //console.log('render', this.model, properties, this.model.get('properties'), properties.attributes.downloaded, properties.attributes.status );
	    
	    //this.el = $("#torrents");
	    ich.torrent_view( properties );
	    
	    this.$el.html( ich.torrent_view( properties ) );
	    
	    this.attachHandlers();
	    	    
        // $(this.el).empty();
        // $(this.el).append('<b class="torrent_name">' + this.model.get('properties').get('name') + '</b>');
        // var status = this.model.get('properties').get('status');
        // var started = (status % 2 === 1);
        // var remove = $('<input type="button" value="" class="button_remove"></input>');
        // remove.click(_.bind(function() { 
        //  //debugger;
        //  this.model.remove();
        //  this.remove();
        // }, this));
        // $(this.el).append(remove);
        // if(started) {
        //  $(this.el).append('<input type="button" value="" class="button_stop"></input>');
        // } else {
        //  $(this.el).append('<input type="button" value="" class="button_start"></input>');
        // }
        // $(this.el).append('<p class="clearfix progress">&nbsp;</p>');
        // //$(this.el).append('<p class="file_header">Files</p>');
        // $(this.el).append('<ul id="' + this.model.id + '" class="files"></ul>');
        // $(this.el).append('<p class="peers"><img src="img/peers.png"></p>');
        // $(this.el).append('<p class="clearfix">&nbsp;</p>');
		return this;
	},
	attachHandlers: function(){
	    var _this = this;
	    
	    $('.button_remove', this.$el).click(function(e){
	        _this.model.remove();
	        _this.remove();
	    });
	    
	    $('.stop_start', this.$el).click(function(e){
	        console.log( 'START OR STOP', $(this).hasClass('button_stop') );
	        $(this).hasClass('button_stop') ?
	            _this.model.pause() :
	            _this.model.start();
	    });
	},
	//to store the moustache helper functions
	canHaz: {
	    start_class: function(){
	        var cls = 'button_stop'; //201 is running
	        
	        if( this.attributes.status === 233 ){
	            cls = 'button_start';
	        }
	        
	        //return ( this.attributes.status % 2 === 1 ? 'button_stop' : 'button_start' );
	        return cls;
	    },
	    progress: function(){
	        //console.log('progress', this);
	        //return this.attributes.downloaded / this.attributes.size;
	        return ( 100 - (this.attributes.downloaded / this.attributes.size * 100) ).toFixed(2);
	    },
	    pct_complete: function(){
	        return ~~(this.attributes.downloaded / this.attributes.size * 100);
	    },
	    pretty_size: function(){
            //console.log('size', this);
	        return progress_to_file_size( this.attributes.downloaded, this.attributes.size );
	    },
	    time_remaining: function(){
	        var eta = this.attributes.eta;
	        
	        return ( eta < 0 ? 
	                    'Complete' :
	                    eta < 60 ?
	                        '< 1 min' :
	                        eta < 3600 ?
	                            ~~(eta / 60) + ' min' :
	                            eta / 3600 === 1 ?
	                                eta / 3600 + ' hour' :
	                                ( eta / 3600 ).toFixed(2) + ' hours'	                                
	                );
	    },
	    quality: function(){	        
	        var ratio = this.attributes.seeds_in_swarm 	        
	        
	        return (
	            ratio > 35 ?
	                'Leet' :
	                ratio > 25 ?
	                    'Sweet' :
	                    ratio > 15 ?
	                        'KK' :
	                        ratio > 5 ?
	                            'Meh' :
	                              'Sux'
	        );
	    }
	}
	
});

window.CreationView = Backbone.View.extend({
	initialize: function() {
		_.bindAll(this, 'render');
		//console.log('initing CreationView', this);
		
		this.attachHandlers();
	},
	attachHandlers: function(){
        var input_add_url = $('.download-url .torrent_url');
        
        //add url
        $('.item_url').click(_.bind(function(e){
            showAddUrl();
        }, this));
        
        //add url submit
        $('.download-url .button_add_url').click(_.bind(function(e){
            btapp.get('add').torrent( input_add_url.val() );
            hideEverything();
            input_add_url.val('');
            $('.download-url').fadeOut(100);
            $('.torrent_wrapper').delay(100).fadeIn(300);
        }, this));
        
        $('.item_file').click(function() {
            btapp.browseforfiles(function(files) {
                console.log('create click', files);

                //TODO: figure this out
                var torrent = btapp.bt.create('', _.values(files), function( something ) {
                    console.log('torrent created', something, this);
                }).then(function(a, b){
                    console.log('torrent created then', this, a, b, torrent);
                });
                
            });
        });
        
        
        
        return this;
	},
	render: function() {
	    console.log('rendering CreationView');
	    
	    return this;
	}
});


jQuery(function() {
	window.btapp = new Btapp();
	btapp.torrent_views = {};
    btapp.torrent_list_shown = false;
    
	btapp.on('add:add', function(add) {
		//add.torrent('http://featuredcontent.utorrent.com/torrents/CountingCrows-BitTorrent.torrent')
		//add.torrent('magnet:?xt=urn:btih:2110C7B4FA045F62D33DD0E01DD6F5BC15902179&dn=CountingCrows-BitTorrent&tr=udp://tracker.openbittorrent.com:80/announce')
		console.log('ready to add torrents', add, add.torrent, this);
	});

	btapp.on('add:settings', function(settings) {
		console.log('ready to play with settings', settings);
	});

	btapp.on('add:torrent', function(torrent_list) {
		console.log('we have ' + torrent_list.length + ' torrents', torrent_list);
		
		//hide the no torrent area and show the main list
		if( torrent_list.length ){
		    if ( !btapp.torrent_list_shown ){
	            $('.null_torrents').hide();
		        $('#torrents').show();
		        btapp.torrent_list_shown = true;
		    }
		} else {
		    if ( btapp.torrent_list_shown ){
	            $('.null_torrents').show();
		        $('#torrents').hide();
		        btapp.torrent_list_shown = false;
		    }
		}
		
		
        torrent_list.each(function(torrent) { 
            console.log(torrent.get('properties').get('name'));
        });
	});

	btapp.on('delete:torrent', function(torrent_list) {
		console.log('we have ' + torrent_list.length + ' torrents', torrent_list);
		    if ( !torrent_list.length && btapp.torrent_list_shown ){
	            $('.null_torrents').show();
		        $('#torrents').hide();
		        btapp.torrent_list_shown = false;
		    }
        torrent_list.each(function(torrent) { 
            console.log(torrent.get('properties').get('name'));
        });
	});

	btapp.on('add:dht', function(dht) {
		console.log('we have access to the dht', dht);
	});

    //live the torrent binders
    btapp.live('torrent *', function(torrent) {
        console.log('torrent(' + torrent.id + ')', torrent, torrent.get('properties'), torrent.get('file') );
        btapp.torrent_views[torrent.id] = new TorrentView({'model':torrent});
        $('#torrents').append(btapp.torrent_views[torrent.id].render().el);

        //properties may or may not exist yet, so live them.
        torrent.live('properties', function(properties){
            //console.log( 'torrent live properties', torrent, properties, torrent.get('properties'));
            
            properties.on('change', function(a,b){
                //this works
                //console.log('properties change', a, b, this);
                
                //render the view again
                btapp.torrent_views[torrent.id].render();
            });
        });        
    });

    // btapp.live('torrent * file *', function(file) {
    //  console.log('we have a file in a torrent: ', file);
    //  
    //         file.on('change:properties', function(properties){
    //            console.log( 'file status change', file, properties); 
    //         });
    // });

    // btapp.live('torrent * file * properties name', function(name) {
    //  console.log('we have a file in a torrent: ' + name);
    // });

	btapp.on('client:connected', function() {
		console.log('client:connected');
	});

	btapp.connect({
		product: 'SoShare'
	});

	btapp.creationView = new CreationView();
	//$('#creation').append((new CreationView).render().el);
});

