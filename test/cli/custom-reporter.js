const JSReporters = require( "js-reporters" );
const NPMReporter = require( "npm-reporter" );

const findReporter = require( "../../src/cli/find-reporter" ).findReporter;

const expectedOutput = require( "./fixtures/expected/tap-outputs" );
const execute = require( "./helpers/execute" );

QUnit.module( "find-reporter", function() {
	QUnit.test( "tap reporter from js-reporters is bundled", function( assert ) {
		assert.strictEqual( QUnit.reporters.tap, JSReporters.TapReporter );
	} );

	QUnit.test( "find console reporter", function( assert ) {
		const reporter = findReporter( "console", QUnit.reporters );
		assert.strictEqual( reporter, JSReporters.ConsoleReporter );
	} );

	QUnit.test( "find tap reporter", function( assert ) {
		const reporter = findReporter( "tap", QUnit.reporters );
		assert.strictEqual( reporter, JSReporters.TapReporter );
	} );

	QUnit.test( "default to tap reporter", function( assert ) {
		const reporter = findReporter( undefined, QUnit.reporters );
		assert.strictEqual( reporter, JSReporters.TapReporter );
	} );

	QUnit.test( "find extra reporter package", function( assert ) {
		const reporter = findReporter( "npm-reporter", QUnit.reporters );
		assert.strictEqual( reporter, NPMReporter );
	} );
} );

QUnit.module( "CLI Reporter", function() {
	QUnit.test( "runs tests using the specified reporter", async function( assert ) {
		const command = "qunit --reporter npm-reporter";
		const execution = await execute( command );

		assert.equal( execution.code, 0 );
		assert.equal( execution.stderr, "" );
		assert.equal( execution.stdout, expectedOutput[ command ] );
	} );

	QUnit.test( "exits early and lists available reporters if reporter is not found", async function( assert ) {
		const command = "qunit --reporter does-not-exist";

		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, expectedOutput[ command ] );
			assert.equal( e.stdout, "" );
		}
	} );

	QUnit.test( "exits early and lists available reporters if reporter option is used with no value", async function( assert ) {
		const command = "qunit --reporter";

		try {
			await execute( command );
		} catch ( e ) {
			assert.equal( e.code, 1 );
			assert.equal( e.stderr, expectedOutput[ command ] );
			assert.equal( e.stdout, "" );
		}
	} );
} );
