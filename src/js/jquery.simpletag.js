/*
 * jquery-simpletag
 * https://github.com/derapU/jquery-simpletag
 *
 * Copyright (c) 2015 Andreas Berghaus
 * Licensed under the MIT license.
 */

( function( $ ) {
	"use strict";

	var SimpleTag,
		default_opts;

	$.fn.simpletag = function ( opts ) {
		return this.each( function () {
			this.simpletag = new SimpleTag( $( this ), opts );
		} );
	};

	SimpleTag = function ( $input, opts ) {
		this.init( $input, opts );
	};
	SimpleTag.prototype = {
		default_opts: {
			delimiter: ',',
			input_min_width: 30 // in px
		},
		opts: null,

		tags: [],

		$original_input: null,
		$input:          null,
		$container:      null,
		$list:           null,

		init: function ( $input, opts ) {
			// configure and save the original field
			this.opts            = $.extend( {}, this.default_opts, opts );
			this.$original_input = $input;

			// create elements
			this.create_container();
			this.create_list();

			// clone original-input and append it to the list
			this.create_input();

			// insert container and put original input inside
			// then append our taglist
			this.$original_input.before( this.$container );
			this.$container
				.append( this.$original_input )
				.append( this.$list );


			// append the input field
			this.$list.append( this.$input );

			// bind events
			this.bind_events();

			// update taglist with values from original input
			this.tags = this.read_tags();
			this.update_view();
		},

		create_container: function () {
			this.$container = $( '<div class="simpletag-container">' );

			// clone some css-properties
			this.$container.clonecss( this.$original_input, [
				'background-color',
				'color',
				'border-style',
				'border-color',
				'border-width',
				'float',
				'font-family',
				'font-size',
				'font-style',
				'font-weight',
				'line-height',
				'margin-top',
				'margin-right',
				'margin-bottom',
				'margin-left',
				'text-transform',
				'text-decoration',
				'width'
			] ).css ( {
				minHeight: this.$original_input.outerHeight(),
			} );
		},
		create_input: function () {
			this.$input = $( '<input type="text" class="simpletag-input">' )
				.css( {
					width: this.opts.input_min_width,
				} )
				.val( '' );
		},
		create_list: function () {
			this.$list = $( '<div class="simpletag-list">' ).clonecss( this.$original_input, [
				'padding-top',
				'padding-right',
				'padding-bottom',
				'padding-left'
			] );
		},

		update_view: function ( field_value ) {
			var self = this,
				$tag  = $( '<span class="simpletag-tag">' );

			// remove tags
			this.$list.find( '.simpletag-tag' ).remove();

			// insert tags in list
			$.each( this.tags, function () {
				self.$input.before( $tag.clone().html( this ) );
			} );
		},


		// add or remove tag to / from tag-box
		add_tag: function ( tag ) {
			// add to original input
			this.tags.push( tag );
			this.write_tags();

			// add to view
			this.update_view();
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


		// resize the input-field to match the contents length
		$mirror: null,
		resize_input: function () {
			var self    = this,
				$mirror = this.$mirror;

			if ( null === $mirror ) {
				$mirror = $( '<span>' );
				$mirror.css( {
					display:  'block',
					position: 'absolute',
					top:      '-100000px',
					left:     '-100000px',
					padding:  0,
					margin:   0,
					width:    'auto'
				} );

				// clone font-properties from inputfield
				$mirror.clonecss( self.$input, [
					'font-family',
					'font-size',
					'font-style',
					'font-weight',
					'letter-spacing',
					'line-height',
					'text-transform',
					'text-indent',
					'whitespace',
					'word-spacing'
				] );

				// save the mirror
				$( 'body' ).prepend( $mirror );
				this.$mirror = $mirror;
			}

			// set current input-value, get the rendered width and apply
			// it to the input including the configured min-width to save some
			// place for the next character.
			$mirror.html( self.$input.val() );
			self.$input.width( parseInt( $mirror.innerWidth(), 10 )+self.opts.input_min_width + 'px' );
		},


		trim: function ( val ) {
			return val.replace( /^\s*|\s*$/g, '' );
		},

		bind_events: function () {
			var self = this;

			// remove tag on click
			this.$list.on( 'click', '> .simpletag-tag', function ( e ) {
				e.preventDefault();
				self.remove_tag( $( this ).html() );
			} );

			// autoresize inputfield and check if we have to add a tag
			this.$input.on( 'keyup', function ( e ) {
				// add tag
				if ( 13 === e.keyCode || self.opts.delimiter === self.$input.val().substr( -1 ) ) {
					e.preventDefault();
					self.add_tag( self.$input.val().replace( /,$/i, '', self.$input.val() ) );
					self.$input.val( '' );
				}

				self.resize_input();
			} ).on( 'keydown', function ( e ) {
				// remove tag
				if ( 8 === e.keyCode && 0 === self.$input.val().length ) {
					e.preventDefault();
					self.remove_tag( self.tags[self.tags.length-1] );
				}
			} );

			// focus input on container-click
			this.$container.on( 'click', function ( e ) {
				e.preventDefault();
				self.$input.trigger( 'focus' );
			} );
		}
	};

	// little helper to clone css-properties
	$.fn.clonecss = function ( $src, props ) {
		return $.each( this, function () {
			var $dest = $( this );
			return $.each( props, function () {
				return $dest.css( this, $src.css( this ) );
			} );
		} );
	};
} ( jQuery ) );
