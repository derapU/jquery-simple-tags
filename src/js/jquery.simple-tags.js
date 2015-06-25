/*
 * jquery-simple-tags
 * https://github.com/derapU/jquery-simple-tags
 *
 * Copyright (c) 2015 Andreas Berghaus
 * Licensed under the MIT license.
 */

( function ( $ ) {
	"use strict";

	var SimpleTags;

	$.fn.simple_tags = function ( opts ) {
		return this.each( function () {
			if ( undefined !== this.simple_tags ) {
				this.simple_tags._revert();
			}
			if ( undefined === this.simple_tags ) {
				return this.simple_tags = new SimpleTags( $( this ), opts );
			}
		} );
	};

	SimpleTags = function ( $input, opts ) {
		this._init( $input, opts );
		return this;
	};
	SimpleTags.prototype = {
		_default_opts: {
			min_length: 3,
			delimiter: ',',
			border_spacing:  null, // null | px
			input_min_width: 30,   // in px
			events: {
				change: function ( tags ) { return tags; }
			},
			typeahead: null        // example: function ( value ) { return ''; }
		},
		_opts: null,

		_tags: [],

		_$original_input: null,
		_$input:          null,
		_$container:      null,
		_$list:           null,

		_init: function ( $input, opts ) {
			var self = this;

			// configure and save the original field
			this._opts            = $.extend( true, {}, this._default_opts, opts );
			this._$original_input = $input;

			// create elements
			this._createContainer();
			this._createList();
			this._createInput();

			// insert container
			this._$input.before( this._$container );
			this._$container.append( this._$list );

			// check typeahead
			if ( null !== this._opts.typeahead ) {
				this._$input.typeahead( {
					complete: this._opts.typeahead,
					events: {
						select: function ( value ) {
							self._addTag( value );
							self._$input.val( '' );
						}
					}
				} );
			}

			// bind events
			this._bindEvents();

			// update taglist with values from original input
			this._tags = this._readTags();
			this.updateView();
		},

		_createInput: function () {
			// create new input-field
			this._$input = this._$original_input.clone().attr( 'id', '' ).attr( 'name', '' );

			// append new input-field
			this._$original_input.after( this._$input.val( '' ) );

			// hide original-input
			this._$original_input.css( {
				position: 'absolute',
				zIndex: -1,
				width: 0
			} );
		},

		_createContainer: function () {
			this._$container = $( '<div class="simple-tags-container">' );

			// clone some css-properties
			this._$container.clonecss( this._$original_input, [
				'font-family',
				'font-size',
				'font-style',
				'font-weight',
				'margin-top',
				'margin-left',
				'margin-right',
				'text-transform',
				'text-decoration',
				'width'
			] ).css ( {
				marginBottom: this._opts.border_spacing,
				minHeight:  this._$original_input.outerHeight(),
				lineHeight: '1em'
			} );
		},
		_createList: function () {
			if ( null === this._opts.border_spacing ) {
				this._opts.border_spacing = parseInt( this._$original_input.css( 'padding-top' ), 10 );
			}
			this._$list = $( '<div class="simple-tags-list">' );
			this._$list.css( 'padding-bottom', 0.5*this._opts.border_spacing + 'px' );
		},

		updateView: function () {
			var self = this,
				$tag = $( '<span class="simple-tags-tag">' );

			this._tags = this._readTags();

			// add correct border-spacing
			$tag.css( {
				marginTop: this._opts.border_spacing + 'px',
			} );

			// remove tags
			this._$list.find( ':not(input).simple-tags-tag' ).remove();

			// insert tags in list
			$.each( this._tags, function () {
				self._$list.append( $tag.clone().html( this ) );
			} );
		},


		// add or remove tag to / from tag-box
		_addTag: function ( tag ) {
			tag = this._trim( tag );

			// drop empty tag
			if ( '' === tag ) {
				return false;
			}

			// drop short tags
			if ( this._opts.min_length > tag.length ) {
				return false;
			}

			// remove duplicate-tag and append it to the end
			if ( true === this._tag_exists( tag ) ) {
				this._remove_tag( tag );
			}

			// add to original input
			this._tags.push( tag );
			this._writeTags();

			// add to view
			this.updateView();
		},
		_remove_tag: function ( tag ) {
			var index = $.inArray( tag, this._tags );

			// remove original input
			if ( -1 < index ) {
				this._tags.splice( index, 1 );
				this._writeTags();
			}

			// update view
			this.updateView();
		},
		_tag_exists: function ( tag ) {
			return true === -1 < $.inArray( tag, this._tags );
		},


		// read and write tags from / to original input-field
		_readTags: function () {
			var self = this;
			return $.map( this._$original_input.val().split( this._opts.delimiter ), function ( tag ) {
				return self._trim( tag ) || null;
			} );
		},
		_writeTags: function () {
			this._$original_input.val( this._tags.join( this._opts.delimiter ) );
			this._opts.events.change.apply( this, [this._tags] );
		},

		_trim: function ( val ) {
			return val.replace( /^\s*|\s*$/g, '' );
		},
		_revert: function () {
			this._$container.replaceWith( this._$original_input );
			this._$original_input.get( 0 ).simple_tags = undefined;

			this._$input.remove();

			// remove styles from original-input
			this._$original_input.css( {
				position: '',
				zIndex: '',
				width: ''
			} );
		},

		_bindEvents: function () {
			var self = this;

			// remove tag on click
			this._$list.on( 'click', '> .simple-tags-tag', function ( e ) {
				e.preventDefault();
				self._remove_tag( $( this ).html() );
			} );

			// autoresize inputfield and check if we have to add a tag
			this._$input.on( 'keyup', function ( e ) {
				// add tag
				if ( 13 === e.keyCode || self._opts.delimiter === self._$input.val().substr( -1 ) ) {
					e.preventDefault();
					if ( false !== self._addTag( self._$input.val().replace( /,$/i, '', self._$input.val() ) ) ) {
						self._$input.val( '' );
					}
				}
			} );

			// focus input on container-click
			this._$container.on( 'click', function ( e ) {
				e.preventDefault();
				self._$input.trigger( 'focus' );
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
