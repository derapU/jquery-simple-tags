/*
 * jquery-simple-tags
 * https://github.com/derapU/jquery-simple-tags
 *
 * Copyright (c) 2015 Andreas Berghaus
 * Licensed under the MIT license.
 */

( function( $ ) {
	"use strict";

	var SimpleTags,
		default_opts;

	$.fn.simple_tags = function ( opts ) {
		return this.each( function () {
			this.simple_tags = new SimpleTags( $( this ), opts );
		} );
	};

	SimpleTags = function ( $input, opts ) {
		this.init( $input, opts );
	};
	SimpleTags.prototype = {
		default_opts: {
			min_length: 3,
			delimiter: ',',
			border_spacing:  null, // null | px
			input_min_width: 30    // in px
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
			this.$container = $( '<div class="simple-tags-container">' );

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
				'margin-bottom',
				'margin-top',
				'margin-left',
				'margin-right',
				'text-transform',
				'text-decoration',
				'width'
			] ).css ( {
				minHeight:  this.$original_input.outerHeight(),
				lineHeight: '1em'
			} );
		},
		create_input: function () {
			this.$input = $( '<input type="text" class="simple-tags-tag simple-tags-input">' )
				.css( {
					width: this.opts.input_min_width,
					maxHeight: this.$original_input.css( 'font-size' ),
					marginTop: this.opts.border_spacing
				} )
				.clonecss( this.$original_input, [
					'background-color',
					'color'
				] )
				.val( '' );
		},
		create_list: function () {
			if ( null === this.opts.border_spacing ) {
				this.opts.border_spacing = parseInt( this.$original_input.css( 'padding-top' ), 10 );
			}
			this.$list = $( '<div class="simple-tags-list">' ).clonecss( this.$original_input, [
				'padding-right',
				'padding-left'
			] );
			this.$list.css( 'padding-bottom', this.opts.border_spacing + 'px' )
		},

		update_view: function ( field_value ) {
			var self = this,
				$tag = $( '<span class="simple-tags-tag">' );

			// add correct border-spacing
			$tag.css( {
				marginTop: this.opts.border_spacing + 'px',
			} );

			// remove tags
			this.$list.find( ':not(input).simple-tags-tag' ).remove();

			// insert tags in list
			$.each( this.tags, function () {
				self.$input.before( $tag.clone().html( this ) );
			} );
		},


		// add or remove tag to / from tag-box
		add_tag: function ( tag ) {
			tag = this.trim( tag );

			// drop empty tag
			if ( '' === tag ) {
				return false;
			}

			// drop short tags
			if ( this.opts.min_length > tag.length ) {
				return false;
			}

			// remove duplicate-tag and append it to the end
			if ( true === this.tag_exists( tag ) ) {
				this.remove_tag( tag );
			}

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
		tag_exists: function ( tag ) {
			return true === -1 < $.inArray( tag, this.tags );
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
			this.$list.on( 'click', '> .simple-tags-tag', function ( e ) {
				e.preventDefault();
				self.remove_tag( $( this ).html() );
			} );

			// autoresize inputfield and check if we have to add a tag
			this.$input.on( 'keyup', function ( e ) {
				// add tag
				if ( 13 === e.keyCode || self.opts.delimiter === self.$input.val().substr( -1 ) ) {
					e.preventDefault();
					if ( false !== self.add_tag( self.$input.val().replace( /,$/i, '', self.$input.val() ) ) ) {
						self.$input.val( '' );
					}
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
