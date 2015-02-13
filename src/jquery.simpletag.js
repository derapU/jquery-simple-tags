/*
 * jquery-simpletag
 * https://github.com/derapU/jquery-simpletag
 *
 * Copyright (c) 2015 Andreas Berghaus
 * Licensed under the MIT license.
 */

( function( $ ) {
	var SimpleTag,
		default_opts;


	$.fn.simpletag = function ( opts ) {
		return this.each( function () {
			console.log( this );
			this.simpletag = new SimpleTag( $( this ), opts );
		} );
	};

	SimpleTag = function ( $input, opts ) {
		this.init( $input, opts );
		console.log( this );
	};
	SimpleTag.prototype = {
		default_opts: {
			delimiter: ','
		},
		opts: null,

		tags: [],

		$original_input: null,
		$container:      null,
		$list:           null,

		init: function ( $input, opts ) {
			// configure and save the original field
			this.opts            = $.extend( {}, this.default_opts, opts );
			this.$original_input = $input;

			// create elements
			this.$container = $( '<div class="simpletag-container">' );
			this.$list      = $( '<ul class="simpletag-list">' );

			// insert container and put original input inside
			// then append our taglist
			this.$original_input.before( this.$container );
			this.$container
				.append( this.$original_input )
				.append( this.$list );



			// bind events
			this.bind_events();

			// update taglist with values from original input
			this.tags = this.read_tags();
			this.update_view();
		},

		update_view: function ( field_value ) {
			var self = this,
				$li  = $( '<li>' );

			// empty list
			this.$list.empty();

			// insert tags in list
			$.each( this.tags, function () {
				self.$list.append( $li.clone().html( this ) );
			} );
		},


		// add or remove tag to / from tag-box
		add_tag: function ( tag ) {
			var $li = $( '<li>' );

			// add to original input
			this.tags.push( tag );
			this.write_tags();

			// add to view
			$li.html( tag );
			this.$list.append( $li );
		},
		remove_tag: function ( tag ) {
			var index = $.inArray( tag, this.tags );

			// remove original input
			if ( -1 < index ) {
				this.tags.splice( index, 1 );
				this.write_tags();
			}

			// update view
			this.update_view();
		},


		// read and write tags from / to original input-field
		read_tags: function () {
			var self = this;
			return $.map( this.$original_input.val().split( this.opts.delimiter ), function ( tag ) {
				return self.trim( tag );
			} );
		},
		write_tags: function () {
			this.$original_input.val( this.tags.join( this.opts.delimiter ) );
		},


		trim: function ( val ) {
			return val.replace( /^\s*|\s*$/g, '' );
		},

		bind_events: function () {
			var self = this;

			// remove tag on click
			this.$list.on( 'click', '>li', function ( e ) {
				e.preventDefault();
				self.remove_tag( $( this ).html() );
			} );
		}
	}
} ( jQuery ) );
