# jQuery Simpletag
Just another tag-box-plugin, developed for the official [laut.fm](http://laut.fm) radioadmin.

## Why another one?
My intention was to create a tag-box based on jQuery that tries to preserve the original appearance of the input-field it replaces. I also needed some special behaviors like removing the delete-button from a tag in the list. Actually there doesn't even exist one in the current version.

And finally: I like to do things ...

## How to use
Call `simple_tags()` on the input-field containing the list of tags:
```javascript
$( 'input.tagbox' ).simple_tags();
```

You can configure a custom delimiter too
```javascript
$( 'input.tagbox' ).simple_tags( {
  delimiter: ','
} );
```

By default a tag will be pushed to the list, if you press the `enter` key or if you enter the configured delimiter.
