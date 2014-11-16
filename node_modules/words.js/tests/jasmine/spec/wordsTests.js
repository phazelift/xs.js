
//
var _= Strings= Words.Strings;
describe("new Words and .set( strings )", function() {

    it("should return an empty string if no or invalid arguments are given", function(){

        result= new Words().$;
        expect( result ).toBe( '' );

        result= new Words( null ).$;
        expect( result ).toBe( '' );

        result= new Words( true ).$;
        expect( result ).toBe( '' );

        result= new Words( /regexp/ ).$;
        expect( result ).toBe( '' );

        result= new Words( undefined ).$;
        expect( result ).toBe( '' );

        result= new Words( {ok: 'ok'} ).$;
        expect( result ).toBe( '' );
    });

    it("should return the strings given at initialization", function(){

        result= new Words('this should be split into words').$;
        expect( result ).toBe( 'this should be split into words' );

        result= new Words(1, 2, 3).$;
        expect( result ).toBe( '1 2 3' );

        result= new Words('multiple', 'arguments', 'should', 'be', 'fine').$;
        expect( result ).toBe( 'multiple arguments should be fine' );

        result= new Words('mixed', 1, 'arguments', 2 ).$;
        expect( result ).toBe( 'mixed 1 arguments 2' );
    });


    it("should accept space delimited string, multiple arguments and array", function(){

        result= new Words('this should be split into words').$;
        expect( result ).toBe( 'this should be split into words' );

        result= new Words(['this', 'should', 'be', 'split', 'into', 'words']).$;
        expect( result ).toBe( 'this should be split into words' );

        result= new Words('this', 'should', 'be', 'split', 'into', 'words').$;
        expect( result ).toBe( 'this should be split into words' );
    });

});

describe("get( indices )", function() {

    var words= new Words('testing get', 4, 'now');

    it("should return the full string if no arguments are given", function(){

        result= words.get();
        expect( result ).toBe( 'testing get 4 now' );
    });

    it("should return empty string if invalid arguments were given", function(){

        result= words.get( null );
        expect( result ).toBe( '' );

        result= words.get( true );
        expect( result ).toBe( '' );

        result= words.get( /regexp/ );
        expect( result ).toBe( '' );

        result= words.get( undefined );
        expect( result ).toBe( '' );

        result= words.get( {ok: 'ok'} );
        expect( result ).toBe( '' );
    });

    it("should return a string assembled from the indices given", function(){

        result= words.get( 2, 1 );
        expect( result ).toBe( 'get testing' );

        result= words.get( -1, 1 );
        expect( result ).toBe( 'now testing' );

        result= words.get( -1, -2, -3, -4 );
        expect( result ).toBe( 'now 4 get testing' );

        result= words.get( 1, -4, 1 );
        expect( result ).toBe( 'testing testing testing' );

        result= words.get( [2], [3] );
        expect( result ).toBe( 'get 4' );

        result= words.get( '4', '1' );
        expect( result ).toBe( 'now testing' );

        result= words.get( '4px', '1deg' );
        expect( result ).toBe( 'now testing' );

    });
});


describe("xs( callback )", function() {

    var words= new Words('testing xs now');

    it("should return the context of the object", function(){

        result= words.xs();
        expect( result ).toBe( words );

        result= words.xs( null );
        expect( result ).toBe( words );
    });

    it("should not change @words if invalid input is given", function(){

        result= words.xs( null ).$;
        expect( result ).toBe( 'testing xs now' );

        result= words.xs( true ).$;
        expect( result ).toBe( 'testing xs now' );

        result= words.xs( new Date() ).$;
        expect( result ).toBe( 'testing xs now' );

        result= words.xs( [1, 2, 3] ).$;
        expect( result ).toBe( 'testing xs now' );

        result= words.xs( {} ).$;
        expect( result ).toBe( 'testing xs now' );
    });

    it("should return a string with all 't's removed", function(){
        result= words.xs( function(word){
            if ( Strings.contains(word, 't') )
                return Strings.remove(word, 't');
            return true;
        }).$;
        expect( result ).toBe( 'esing xs now' );
    });

    it("should return a string assembled from every second word", function(){

        words.set('we need some more words for the following test');

        result= words.xs( function(w, index){
            if ( index% 2 !== 0 )
                return true;
        }).$;
        expect( result ).toBe( 'need more for following' );
    });
});


describe("find( word )", function() {

    var words= new Words('for finding some some duplicate words and words');

    it("should always return an array", function(){

        result= _.typeof( words.find() );
        expect( result ).toBe( 'array' );

        result= _.typeof( words.find( null ) );
        expect( result ).toBe( 'array' );

        result= _.typeof( words.find( new Object() ) );
        expect( result ).toBe( 'array' );

        result= _.typeof( words.find( /regexp/ ) );
        expect( result ).toBe( 'array' );
    });

    it("should return an array with the found indices, or empty if not found", function(){

        result= words.find( 'some' );
        expect( result ).toEqual( [3, 4] );

        result= words.find( 'the' );
        expect( result ).toEqual( [] );

        result= words.find( 'words' );
        expect( result ).toEqual( [6, 8] );
    });

});

describe("upper( indices/words )", function() {

    var words= new Words('testing upper and lower');

    it("should always return the context", function(){

        result= words.upper()
        expect( result ).toBe( words );

        result= words.upper( null )
        expect( result ).toBe( words );

        result= words.upper( [] )
        expect( result ).toBe( words );
    });


    it("should not change @words if invalid arguments were given", function(){

        var words= new Words('testing upper and lower');

        result= words.upper( null ).$;
        expect( result ).toBe( 'testing upper and lower' );

        result= words.upper( true ).$;
        expect( result ).toBe( 'testing upper and lower' );

        result= words.upper( {} ).$;
        expect( result ).toBe( 'testing upper and lower' );

        result= words.upper( /abc/ ).$;
        expect( result ).toBe( 'testing upper and lower' );

    });

    it("should return the entire string in uppercase if no arguments were given", function(){

        result= words.upper().$;
        expect( result ).toBe( 'TESTING UPPER AND LOWER' );

    });

    it("should return the string with the words on indices in uppercase", function(){

        words.set('testing upper and lower');
        result= words.upper(1, 2).$;
        expect( result ).toBe( 'TESTING UPPER and lower' );

        words.set('testing upper and lower');
        result= words.upper(-3, 1).$;
        expect( result ).toBe( 'TESTING UPPER and lower' );

    });

    it("should return the string with the found words in uppercase", function(){

        words.set('testing upper and lower');
        result= words.upper('upper').$;
        expect( result ).toBe( 'testing UPPER and lower' );

        words.set('testing upper and lower');
        result= words.upper('upper', 'testing').$;
        expect( result ).toBe( 'TESTING UPPER and lower' );

    });

    it("should accept mixed indices/words in any order", function(){

        words.set('testing upper and lower');
        result= words.upper(-2, 'upper', -1).$;
        expect( result ).toBe( 'testing UPPER AND LOWER' );

        words.set('testing upper and lower');
        result= words.upper('and', 1).$;
        expect( result ).toBe( 'TESTING upper AND lower' );

    });

    it("should ignore duplicate indices/words if already set", function(){

        words.set('testing upper and lower');
        result= words.upper(2, 'upper', -2).$;
        expect( result ).toBe( 'testing UPPER AND lower' );

        words.set('testing upper and lower');
        result= words.upper('and', 1, 'and', 1 ).$;
        expect( result ).toBe( 'TESTING upper AND lower' );

    });

    it("should uppercase every first character of any word", function(){

        words.set('testing upper and lower');
        result= words.upper(0, 1).$;
        expect( result ).toBe( 'Testing Upper And Lower' );
    });

    it("should uppercase every first and last character of any word", function(){

        words.set('testing upper and lower');
        result= words.upper(0, 1, -1).$;
        expect( result ).toBe( 'TestinG UppeR AnD LoweR' );
    });

    it("should uppercase every first and last character of any word and allow words arguments as well", function(){

        words.set('testing upper and lower');
        result= words.upper(0, 'upper', 1, -1).$;
        expect( result ).toBe( 'TestinG UPPER AnD LoweR' );

        words.set('testing upper and lower');
        result= words.upper( 'upper', 0, 1, -1).$;
        expect( result ).toBe( 'TestinG UPPER AnD LoweR' );
    });

});


describe("lower( indices/words )", function() {

    // lower uses the same methods as upper so only test availability

    var words= new Words('testing upper and lower');

    it("should always return the context", function(){

        result= words.lower()
        expect( result ).toBe( words );

        result= words.lower( null )
        expect( result ).toBe( words );

        result= words.lower( [] )
        expect( result ).toBe( words );
    });
});


describe("reverse( indices/words )", function() {

    var words= new Words('lets reverse some words!');

    it("should always return the context", function(){

        result= words.reverse()
        expect( result ).toBe( words );

        result= words.reverse( null )
        expect( result ).toBe( words );

        result= words.reverse( [] )
        expect( result ).toBe( words );
    });

    it("should reverse the indices if no arguments were given", function(){

        words.set('lets reverse some words!');
        result= words.reverse().$
        expect( result ).toBe( 'words! some reverse lets' );
    });

    it("should reverse the words at indices", function(){

        words.set('lets reverse some words!');
        result= words.reverse(2).$
        expect( result ).toBe( 'lets esrever some words!' );

        words.set('lets reverse some words!');
        result= words.reverse(-1, 2).$
        expect( result ).toBe( 'lets esrever some !sdrow' );
    });

    it("should reverse the words in place if 0 is given as only argument", function(){

        words.set('lets reverse some words!');
        result= words.reverse(0).$
        expect( result ).toBe( 'stel esrever emos !sdrow' );

    });
});


describe("shuffle( indices/words )", function() {

    var words= new Words('shuffle the words!');

    it("should always return the context", function(){

        result= words.shuffle()
        expect( result ).toBe( words );

        result= words.shuffle( null )
        expect( result ).toBe( words );

        result= words.shuffle( [] )
        expect( result ).toBe( words );
    });

    // cannot test random results..

});


describe("clear()", function() {

    var words= new Words('wipe this string');

    it("should always return the context", function(){

        result= words.clear()
        expect( result ).toBe( words );

        result= words.clear( null )
        expect( result ).toBe( words );

        result= words.clear( [] )
        expect( result ).toBe( words );
    });

    it("should set @words to empty", function(){

        words.set('wipe this string');
        result= words.clear().words
        expect( result ).toEqual( [] );

        words.set('wipe this string');
        result= words.clear().$
        expect( result ).toBe( '' );
    });

});


describe("remove( words )", function() {

    var words= new Words('remove some words from this string');

    it("should always return the context", function(){

        result= words.remove()
        expect( result ).toBe( words );

        result= words.remove( null )
        expect( result ).toBe( words );

        result= words.remove( [] )
        expect( result ).toBe( words );
    });

    it("should remove matching words", function(){

        words.set('remove some words from this string');
        result= words.remove('words').$
        expect( result ).toBe( 'remove some from this string' );

        words.set('remove some words from this string');
        result= words.remove('words', 'some').$
        expect( result ).toBe( 'remove from this string' );

        words.set('remove some words from this string');
        result= words.remove('from', 'this', 'string').$
        expect( result ).toBe( 'remove some words' );
    });

    it("should remove indices", function(){

        words.set('remove some words from this string');
        result= words.remove(3).$
        expect( result ).toBe( 'remove some from this string' );

        words.set('remove some words from this string');
        result= words.remove(-4, -5).$
        expect( result ).toBe( 'remove from this string' );

        words.set('remove some words from this string');
        result= words.remove(-1, -3, 5).$
        expect( result ).toBe( 'remove some words' );
    });

    it("should remove indices and words mixed in any order", function(){

        words.set('remove some words from this string');
        result= words.remove(3, 'some').$
        expect( result ).toBe( 'remove from this string' );

        words.set('remove some words from this string');
        result= words.remove(-4, 'some').$
        expect( result ).toBe( 'remove from this string' );

        words.set('remove some words from this string');
        result= words.remove('string', -3, 5).$
        expect( result ).toBe( 'remove some words' );
    });

});



describe("pop( amount )", function() {

    var words= new Words('pop some words from this string');

    it("should always return a string", function(){

        result= typeof words.pop()
        expect( result ).toBe( 'string' );

        result= typeof words.pop( null )
        expect( result ).toBe( 'string' );

        result= typeof words.pop( [] )
        expect( result ).toBe( 'string' );
    });

    it("should pop only one word if no or invalid arguments are given", function(){

        words.set('pop some words from this string');
        words.pop();
        result= words.$;
        expect( result ).toBe( 'pop some words from this' );

        words.set('pop some words from this string');
        words.pop( null );
        result= words.$;
        expect( result ).toBe( 'pop some words from this' );

        words.set('pop some words from this string');
        words.pop( true );
        result= words.$;
        expect( result ).toBe( 'pop some words from this' );
    });

    it("should pop amount words if amount is valid", function(){

        words.set('pop some words from this string');
        words.pop( 1 );
        result= words.$
        expect( result ).toBe( 'pop some words from this' );

        words.set('pop some words from this string');
        words.pop( 3 );
        result= words.$
        expect( result ).toBe( 'pop some words' );

        words.set('pop some words from this string');
        words.pop( -3 );
        result= words.$
        expect( result ).toBe( 'pop some words' );

        words.set('pop some words from this string');
        words.pop( '-3px' );
        result= words.$
        expect( result ).toBe( 'pop some words' );

        words.set('pop some words from this string');
        words.pop( [5] );
        result= words.$
        expect( result ).toBe( 'pop' );
    });

    it("should return the popped words in reversed order, as space delimited string", function(){

        words.set('pop some words from this string');
        result= words.pop( 1 );
        expect( result ).toBe( 'string' );

        words.set('pop some words from this string');
        result= words.pop( 3 );
        expect( result ).toBe( 'from this string' );

        words.set('pop some words from this string');
        result= words.pop( -3 );
        expect( result ).toBe( 'from this string' );

        words.set('pop some words from this string');
        result= words.pop( '-3px' );
        expect( result ).toBe( 'from this string' );

        words.set('pop some words from this string');
        result= words.pop( [5] );
        expect( result ).toBe( 'some words from this string' );
    });

});


describe("push( words )", function() {

    var words= new Words('push some words');

    it("should always return the context", function(){

        result= words.push()
        expect( result ).toBe( words );

        result= words.push( null )
        expect( result ).toBe( words );

        result= words.push( [] )
        expect( result ).toBe( words );
    });


    it("should push nothing if no or invalid arguments", function(){

        words.set('');
        result= words.push( null ).$
        expect( result ).toBe( '' );

        words.set('');
        result= words.push( [1, 2] ).$
        expect( result ).toBe( '' );

        words.set('');
        result= words.push( true ).$
        expect( result ).toBe( '' );

        words.set('');
        result= words.push( function(){} ).$
        expect( result ).toBe( '' );

        words.set('');
        result= words.push( NaN ).$
        expect( result ).toBe( '' );
    });

    it("should push the arguments if they are Number or String", function(){

        words.set('');
        result= words.push( 1, 2, 3 ).$
        expect( result ).toBe( '1 2 3' );

        words.set('');
        result= words.push( 'a', 1, 'b' ).$
        expect( result ).toBe( 'a 1 b' );

        words.set('');
        result= words.push( 'any', 'combination', 1, 2, 'should', 3, 'be', 'fine' ).$
        expect( result ).toBe( 'any combination 1 2 should 3 be fine' );

    });

});

describe("shift( amount )", function() {

    var words= new Words('shift some words');

    it("should always return the context", function(){

        result= words.shift()
        expect( result ).toBe( words );

        result= words.shift( null )
        expect( result ).toBe( words );

        result= words.shift( [] )
        expect( result ).toBe( words );
    });


    it("should shift only one word if no or invalid arguments are given", function(){

        words.set('one to be shifted');
        result= words.shift( null ).$
        expect( result ).toBe( 'to be shifted' );

        words.set('one to be shifted');
        result= words.shift( [1, 2] ).$
        expect( result ).toBe( 'to be shifted' );

        words.set('one to be shifted');
        result= words.shift( true ).$
        expect( result ).toBe( 'to be shifted' );

        words.set('one to be shifted');
        result= words.shift( function(){} ).$
        expect( result ).toBe( 'to be shifted' );

        words.set('one to be shifted');
        result= words.shift( NaN ).$
        expect( result ).toBe( 'to be shifted' );
    });

    it("should shift the amount of words", function(){

        words.set('shifting 1 2 3');
        result= words.shift().$
        expect( result ).toBe( '1 2 3' );

        words.set('shifting 1 2 3');
        result= words.shift( 1 ).$
        expect( result ).toBe( '1 2 3' );

        words.set('shifting 1 2 3');
        result= words.shift( 3 ).$
        expect( result ).toBe( '3' );

    });

});

describe("prepend( words )", function() {

    var words= new Words('prepend some words');

    it("should always return the context", function(){

        result= words.prepend()
        expect( result ).toBe( words );

        result= words.prepend( null )
        expect( result ).toBe( words );

        result= words.prepend( [] )
        expect( result ).toBe( words );
    });


    it("should prepend nothing if no or invalid arguments are given", function(){

        words.set('prepend nothing!');
        result= words.prepend( null ).$
        expect( result ).toBe( 'prepend nothing!' );

        words.set('prepend nothing!');
        result= words.prepend( [1, 2] ).$
        expect( result ).toBe( 'prepend nothing!' );

        words.set('prepend nothing!');
        result= words.prepend( true ).$
        expect( result ).toBe( 'prepend nothing!' );

        words.set('prepend nothing!');
        result= words.prepend( function(){} ).$
        expect( result ).toBe( 'prepend nothing!' );

        words.set('prepend nothing!');
        result= words.prepend( NaN ).$
        expect( result ).toBe( 'prepend nothing!' );
    });

    it("should prepend words in the order they were given", function(){

        words.set('time to prepend');
        result= words.prepend( 'it', 'is' ).$
        expect( result ).toBe( 'it is time to prepend' );

        words.set('time to prepend');
        result= words.prepend( 1, 2, 3, 'it', 'is' ).$
        expect( result ).toBe( '1 2 3 it is time to prepend' );
    });


    it("should ignore invalid arguments amidst the valid", function(){

        words.set('time to prepend');
        result= words.prepend( 1, 2, 3, null, 'it', 'is' ).$
        expect( result ).toBe( '1 2 3 it is time to prepend' );

        words.set('time to prepend');
        result= words.prepend( NaN, '1', 2, 3, 'it', {}, 'is' ).$
        expect( result ).toBe( '1 2 3 it is time to prepend' );
    });

});

describe("insert( words )", function() {

    var words= new Words('insert some words');

    it("should always return the context", function(){

        result= words.insert()
        expect( result ).toBe( words );

        result= words.insert( null )
        expect( result ).toBe( words );

        result= words.insert( [] )
        expect( result ).toBe( words );
    });

    it("should insert nothing if no or invalid arguments are given", function(){

        words.set('insert nothing!');
        result= words.insert( null ).$
        expect( result ).toBe( 'insert nothing!' );

        words.set('insert nothing!');
        result= words.insert( [1, 2] ).$
        expect( result ).toBe( 'insert nothing!' );

        words.set('insert nothing!');
        result= words.insert( true ).$
        expect( result ).toBe( 'insert nothing!' );

        words.set('insert nothing!');
        result= words.insert( function(){} ).$
        expect( result ).toBe( 'insert nothing!' );

        words.set('insert nothing!');
        result= words.insert( NaN ).$
        expect( result ).toBe( 'insert nothing!' );
    });

    it("should insert words in the order they were given", function(){

        words.set('time to insert');
        result= words.insert( 1, 'my' ).$
        expect( result ).toBe( 'my time to insert' );

        words.set('time to insert');
        result= words.insert( -1, 'do' ).$
        expect( result ).toBe( 'time to do insert' );

        words.set('time to insert');
        result= words.insert( -1, 'do', 'some', 'more' ).$
        expect( result ).toBe( 'time to do some more insert' );

        words.set('time to insert');
        result= words.insert( -1, 'do', 1, 2, 3 ).$
        expect( result ).toBe( 'time to do 1 2 3 insert' );
    });

    it("should ignore invalid arguments amidst the valid", function(){

        words.set('time to insert');
        result= words.insert( -1, 'do', null, 'some', NaN, 'more' ).$
        expect( result ).toBe( 'time to do some more insert' );

        words.set('time to insert');
        result= words.insert( -1, 'do', 1, 2, 3 ).$
        expect( result ).toBe( 'time to do 1 2 3 insert' );
    });

});

describe("replace( words )", function() {

    var words= new Words('replace some words');

    it("should always return the context", function(){

        result= words.replace()
        expect( result ).toBe( words );

        result= words.replace( null )
        expect( result ).toBe( words );

        result= words.replace( [] )
        expect( result ).toBe( words );
    });

    it("should replace nothing if no or invalid arguments are given", function(){

        words.set('replace nothing!');
        result= words.replace( null ).$
        expect( result ).toBe( 'replace nothing!' );

        words.set('replace nothing!');
        result= words.replace( [1, 2] ).$
        expect( result ).toBe( 'replace nothing!' );

        words.set('replace nothing!');
        result= words.replace( true ).$
        expect( result ).toBe( 'replace nothing!' );

        words.set('replace nothing!');
        result= words.replace( function(){} ).$
        expect( result ).toBe( 'replace nothing!' );

        words.set('replace nothing!');
        result= words.replace( NaN ).$
        expect( result ).toBe( 'replace nothing!' );
    });

    it("should replace only valid words", function(){

        words.set('time to replace');
        result= words.replace( 'replace', 'move on..' ).$
        expect( result ).toBe( 'time to move on..' );

        words.set('time to replace');
        result= words.replace( 'replace', 'stop' ).$
        expect( result ).toBe( 'time to stop' );

        words.set('time to replace');
        result= words.replace( 'replace', null ).$
        expect( result ).toBe( 'time to replace' );

        words.set('time to replace');
        result= words.replace( 'replace', NaN ).$
        expect( result ).toBe( 'time to replace' );

        words.set('time to replace');
        result= words.replace( 'replace', 1 ).$
        expect( result ).toBe( 'time to 1' );

        words.set('time to replace');
        result= words.replace( 1, 1 ).$
        expect( result ).toBe( '1 to replace' );

        words.set('time to replace');
        result= words.replace( -1, 'quit' ).$
        expect( result ).toBe( 'time to quit' );
    });

});

describe("sort()", function() {

    var words= new Words('sort some words');

    it("should always return the context", function(){

        result= words.sort()
        expect( result ).toBe( words );

        result= words.sort( null )
        expect( result ).toBe( words );

        result= words.sort( [] )
        expect( result ).toBe( words );
    });

    it("should sort words by their first characters ordinal value", function(){

        words.set('time to do some sorting!');
        result= words.sort().$
        expect( result ).toBe( 'do some sorting! time to' );

        words.set( 5, 3, 7, 65, 9, 4, 3, 6, 78, 89, 5 );
        result= words.sort().$
        expect( result ).toBe( '3 3 4 5 5 6 65 7 78 89 9' );
    });
});

describe("startsWith()", function() {

    var words= new Words('startsWith some words');

    it("should always return a Boolean", function(){

        result= _.typeof( words.startsWith() )
        expect( result ).toBe( 'boolean' );

        result= _.typeof( words.startsWith(null) )
        expect( result ).toBe( 'boolean' );

        result= _.typeof( words.startsWith([]) )
        expect( result ).toBe( 'boolean' );

        result= _.typeof( words.startsWith(NaN) )
        expect( result ).toBe( 'boolean' );
    });

    it("should return true if @words starts with the word(s) given", function(){

        words.set('Starting off with some words');
        result= words.startsWith('Starting')
        expect( result ).toBe( true );

        words.set('Starting off with some words');
        result= words.startsWith('Starting off')
        expect( result ).toBe( true );

    });

    it("should return false if the word(s) given are a only a part of the starting word(s)", function(){

        words.set('Starting off with some words');
        result= words.startsWith('Starting o')
        expect( result ).toBe( false );

        words.set('Starting off with some words');
        result= words.startsWith('Start')
        expect( result ).toBe( false );

        words.set('Starting off with some words');
        result= words.endsWith('Starting off with some word')
        expect( result ).toBe( false );

        words.set('Starting off with some words');
        result= words.startsWith('Starting off with some words?')
        expect( result ).toBe( false );

    });

    it("should be case sensitive", function(){
        words.set('Starting off with some words');
        result= words.startsWith('Starting off with some wordS')
        expect( result ).toBe( false );

    });


});

describe("endsWith()", function() {

    var words= new Words('endsWith some words');

    it("should always return a Boolean", function(){

        result= _.typeof( words.endsWith() )
        expect( result ).toBe( 'boolean' );

        result= _.typeof( words.endsWith(null) )
        expect( result ).toBe( 'boolean' );

        result= _.typeof( words.endsWith([]) )
        expect( result ).toBe( 'boolean' );

        result= _.typeof( words.endsWith(NaN) )
        expect( result ).toBe( 'boolean' );
    });

    it("should return true if @words ends with the word(s) given", function(){

        words.set('Starting off with some words');
        result= words.endsWith('words')
        expect( result ).toBe( true );

        words.set('Starting off with some words');
        result= words.endsWith('with some words')
        expect( result ).toBe( true );
    });

    it("should return false if the word(s) given are a only a part of the last word(s)", function(){

        words.set('Starting off with some words');
        result= words.endsWith('rds')
        expect( result ).toBe( false );

        words.set('Starting off with some words');
        result= words.endsWith('me words')
        expect( result ).toBe( false );

        words.set('Starting off with some words');
        result= words.endsWith('tarting off with some words')
        expect( result ).toBe( false );

        words.set('Starting off with some words');
        result= words.endsWith('eStarting off with some words')
        expect( result ).toBe( false );
    });

    it("should be case sensitive", function(){
        words.set('Starting off with some words');
        result= words.endsWith('starting off with some words')
        expect( result ).toBe( false );

    });

});


describe(".$", function() {

    var words= new Words('testing getters');

    it("should always return a String", function(){

        result= _.typeof( words.$ )
        expect( result ).toBe( 'string' );

        words.set( null, NaN );
        result= _.typeof( words.$ )
        expect( result ).toBe( 'string' );

        words.set( [], {} );
        result= _.typeof( words.$ )
        expect( result ).toBe( 'string' );
    });

    it("should return the entire internal array as space seperated string", function(){

        result= words.set( 'the entire string' ).$;
        expect( result ).toBe( 'the entire string' );

        result= words.set( 1, 2, 3, 4 ).$;
        expect( result ).toBe( '1 2 3 4' );
    });

    // no need to test specific because .$ calls .get()
});

describe(".string", function() {

    var words= new Words('testing getters');

    it("should always return a String", function(){

        result= _.typeof( words.string )
        expect( result ).toBe( 'string' );

        words.set( null, NaN );
        result= _.typeof( words.string )
        expect( result ).toBe( 'string' );

        words.set( [], {} );
        result= _.typeof( words.string )
        expect( result ).toBe( 'string' );
    });

    it("should return the entire internal array as space seperated string", function(){

        result= words.set( 'the entire string' ).string;
        expect( result ).toBe( 'the entire string' );

        result= words.set( 1, 2, 3, 4 ).string;
        expect( result ).toBe( '1 2 3 4' );
    });

    // no need to test specific because .string calls .get()
});


describe(".count", function() {

    var words= new Words('testing getters');

    it("should always return a Number", function(){

        result= _.typeof( words.count )
        expect( result ).toBe( 'number' );

        words.set( null, NaN );
        result= _.typeof( words.count )
        expect( result ).toBe( 'number' );

        words.set( [], {} );
        result= _.typeof( words.count )
        expect( result ).toBe( 'number' );
    });

    it("should return the amount of words in @words", function(){

        result= words.set().count;
        expect( result ).toBe( 0 );

        result= words.set( 'counting words' ).count;
        expect( result ).toBe( 2 );

        result= words.set( 1, 2, 3, 4 ).count;
        expect( result ).toBe( 4 );
    });
});

